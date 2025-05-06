from flask_restx import Namespace, Resource
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

# Obtener ventas
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
                {
                    "fields": [
                        "id",
                        "name",
                        "date_order",
                        "partner_id",
                        "user_id",
                        "amount_total",
                        "state",
                        "payment_term_id",
                        "invoice_status"
                    ],
                    "limit": 10
                }
            ]
        },
        "id": 2
    }

    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])

# Ruta GET
@ventas_ns.route('/api/ventas')
class VentasResource(Resource):
    def get(self):
        ventas = obtener_ventas_desde_odoo()
        return ventas, 200
