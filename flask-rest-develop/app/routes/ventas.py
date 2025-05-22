from flask_restx import Namespace, Resource
from flask import request
import requests

ventas_ns = Namespace('ventas', description='Operaciones relacionadas con ventas')

# Configuración Odoo
odoo_url = "http://localhost:8069/jsonrpc"
odoo_db = "test-db"
odoo_user = "stiven12312@yopmail.com"
odoo_password = "odoo123"

# Autenticación
def odoo_autenticar():
    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "common",
            "method": "login",
            "args": [odoo_db, odoo_user, odoo_password]
        },
        "id": 1
    }
    response = requests.post(odoo_url, json=payload)
    return response.json().get("result")

# Obtener ventas (con líneas)
def obtener_ventas_desde_odoo():
    uid = odoo_autenticar()
    if not uid:
        return []
    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "object",
            "method": "execute_kw",
            "args": [
                odoo_db,
                uid,
                odoo_password,
                "sale.order",
                "search_read",
                [[]],
                {"fields": ["id", "partner_id", "date_order", "amount_total", "order_line"], "limit": 222}
            ]
        },
        "id": 2
    }
    response = requests.post(odoo_url, json=payload)
    ventas = response.json().get("result", [])
    for venta in ventas:
        order_line_ids = venta.get("order_line", [])
        if order_line_ids:
            payload_line = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute_kw",
                    "args": [
                        odoo_db,
                        uid,
                        odoo_password,
                        "sale.order.line",
                        "read",
                        [order_line_ids],
                        {"fields": ["id", "product_id", "product_uom_qty", "price_subtotal"]}
                    ]
                },
                "id": 3
            }
            resp_line = requests.post(odoo_url, json=payload_line)
            lines = resp_line.json().get("result", [])
            venta["order_lines"] = [
                {
                    "id": l["id"],
                    "product_id": l["product_id"],
                    "quantity": l["product_uom_qty"],
                    "price_subtotal": l["price_subtotal"]
                }
                for l in lines
            ]
        else:
            venta["order_lines"] = []
    return ventas

# Crear venta (espera product_id de variantes)
def crear_venta_en_odoo(partner_id, date_order, order_lines):
    uid = odoo_autenticar()
    if not uid:
        return {"error": "No se pudo autenticar en Odoo"}, 500

    lineas = [
        (0, 0, {"product_id": int(line["product_id"]), "product_uom_qty": float(line["quantity"])})
        for line in order_lines
    ]

    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "object",
            "method": "execute_kw",
            "args": [
                odoo_db,
                uid,
                odoo_password,
                "sale.order",
                "create",
                [{
                    "partner_id": int(partner_id),
                    "date_order": date_order,
                    "order_line": lineas
                }]
            ]
        },
        "id": 4
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok and response.json().get("result"):
        return {"message": "Venta creada correctamente"}, 201
    else:
        return {"error": "Error al crear venta"}, 500

# Editar venta
def editar_venta_en_odoo(venta_id, partner_id, date_order, order_lines):
    uid = odoo_autenticar()
    if not uid:
        return {"error": "No se pudo autenticar en Odoo"}, 500

    lineas = [
        (0, 0, {"product_id": int(line["product_id"]), "product_uom_qty": float(line["quantity"])})
        for line in order_lines
    ]

    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "object",
            "method": "execute_kw",
            "args": [
                odoo_db,
                uid,
                odoo_password,
                "sale.order",
                "write",
                [[venta_id], {
                    "partner_id": int(partner_id),
                    "date_order": date_order,
                    "order_line": [(5, 0, 0)] + lineas
                }]
            ]
        },
        "id": 5
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok and response.json().get("result"):
        return {"message": "Venta actualizada correctamente"}, 200
    else:
        return {"error": "Error al actualizar venta"}, 500

# Eliminar venta
def eliminar_venta_en_odoo(venta_id):
    uid = odoo_autenticar()
    if not uid:
        return {"error": "No se pudo autenticar en Odoo"}, 500
    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "object",
            "method": "execute_kw",
            "args": [
                odoo_db,
                uid,
                odoo_password,
                "sale.order",
                "unlink",
                [[venta_id]]
            ]
        },
        "id": 6
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Venta eliminada correctamente"}, 200
    else:
        return {"error": "Error al eliminar venta"}, 500

# Preview de venta: crea borrador, lee total, elimina
@ventas_ns.route('/api/ventas/preview')
class VentasPreviewResource(Resource):
    def post(self):
        data = request.get_json()
        partner_id = int(data.get("partner_id"))
        date_order = data.get("date_order")
        order_lines = data.get("order_lines", [])

        uid = odoo_autenticar()
        if not uid:
            return {"error": "Autenticación Odoo fallida"}, 500

        lineas = [
            (0, 0, {"product_id": int(line["product_id"]), "product_uom_qty": float(line["quantity"])})
            for line in order_lines
        ]

        # 1. Crear pedido temporal
        create_payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute_kw",
                "args": [
                    odoo_db,
                    uid,
                    odoo_password,
                    "sale.order",
                    "create",
                    [{
                        "partner_id": partner_id,
                        "date_order": date_order,
                        "order_line": lineas
                    }]
                ]
            },
            "id": 101
        }
        create_response = requests.post(odoo_url, json=create_payload)
        order_id = create_response.json().get("result")
        if not order_id:
            return {"error": "No se pudo crear venta temporal para preview"}, 500

        # 2. Leer el total real
        read_payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute_kw",
                "args": [
                    odoo_db,
                    uid,
                    odoo_password,
                    "sale.order",
                    "read",
                    [[order_id], ["amount_total"]]
                ]
            },
            "id": 102
        }
        read_response = requests.post(odoo_url, json=read_payload)
        total = 0
        try:
            total = read_response.json()["result"][0]["amount_total"]
        except Exception:
            pass

        # 3. Borrar el pedido temporal
        delete_payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute_kw",
                "args": [
                    odoo_db,
                    uid,
                    odoo_password,
                    "sale.order",
                    "unlink",
                    [[order_id]]
                ]
            },
            "id": 103
        }
        requests.post(odoo_url, json=delete_payload)

        return {"amount_total": total}

# Rutas REST
@ventas_ns.route('/api/ventas')
class VentasResource(Resource):
    def get(self):
        ventas = obtener_ventas_desde_odoo()
        return ventas, 200

    def post(self):
        data = request.get_json()
        partner_id = data.get("partner_id")
        date_order = data.get("date_order")
        order_lines = data.get("order_lines", [])
        if not partner_id or not date_order or not order_lines:
            return {"error": "Faltan datos obligatorios."}, 400
        return crear_venta_en_odoo(partner_id, date_order, order_lines)

@ventas_ns.route('/api/ventas/<int:id>')
class VentaResource(Resource):
    def put(self, id):
        data = request.get_json()
        partner_id = data.get("partner_id")
        date_order = data.get("date_order")
        order_lines = data.get("order_lines", [])
        if not partner_id or not date_order or not order_lines:
            return {"error": "Faltan datos obligatorios."}, 400
        return editar_venta_en_odoo(id, partner_id, date_order, order_lines)

    def delete(self, id):
        return eliminar_venta_en_odoo(id)