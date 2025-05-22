from flask_restx import Namespace, Resource, reqparse
import requests

inventario_ns = Namespace('inventario', description='Operaciones relacionadas con inventario')

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

# Obtener inventario (stock.quant)

def obtener_inventario_desde_odoo():
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
                "stock.quant",
                "search_read",
                [[]],
                {"fields": ["id", "product_id", "quantity", "location_id"], "limit": 222}
            ]
        },
        "id": 2
    }
    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])

# Crear inventario (stock.quant)
def crear_inventario_en_odoo(product_id, quantity, location_id):
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
                "stock.quant",
                "create",
                [{
                    "product_id": product_id,
                    "quantity": quantity,
                    "location_id": location_id
                }]
            ]
        },
        "id": 3
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Inventario creado correctamente"}, 201
    else:
        return {"error": "Error al crear inventario"}, 500

# Editar inventario
def editar_inventario_en_odoo(inventario_id, product_id, quantity, location_id):
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
                "stock.quant",
                "write",
                [[inventario_id], {
                    "product_id": product_id,
                    "quantity": quantity,
                    "location_id": location_id
                }]
            ]
        },
        "id": 4
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Inventario actualizado correctamente"}, 200
    else:
        return {"error": "Error al actualizar inventario"}, 500

# Eliminar inventario
def eliminar_inventario_en_odoo(inventario_id):
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
                "stock.quant",
                "unlink",
                [[inventario_id]]
            ]
        },
        "id": 5
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Inventario eliminado correctamente"}, 200
    else:
        return {"error": "Error al eliminar inventario"}, 500

# Rutas GET, POST, PUT y DELETE
@inventario_ns.route('/api/inventario')
class InventarioResource(Resource):
    def get(self):
        inventario = obtener_inventario_desde_odoo()
        return inventario, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("product_id", required=True, type=int, help="El ID del producto es requerido")
        parser.add_argument("quantity", required=True, type=float, help="La cantidad es requerida")
        parser.add_argument("location_id", required=True, type=int, help="El ID de la ubicación es requerido")
        args = parser.parse_args()
        product_id = args["product_id"]
        quantity = args["quantity"]
        location_id = args["location_id"]
        return crear_inventario_en_odoo(product_id, quantity, location_id)

@inventario_ns.route('/api/inventario/<int:id>')
class InventarioItemResource(Resource):
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("product_id", required=True, type=int, help="El ID del producto es requerido")
        parser.add_argument("quantity", required=True, type=float, help="La cantidad es requerida")
        parser.add_argument("location_id", required=True, type=int, help="El ID de la ubicación es requerido")
        args = parser.parse_args()
        product_id = args["product_id"]
        quantity = args["quantity"]
        location_id = args["location_id"]
        return editar_inventario_en_odoo(id, product_id, quantity, location_id)

    def delete(self, id):
        return eliminar_inventario_en_odoo(id)