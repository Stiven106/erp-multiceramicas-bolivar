from flask_restx import Namespace, Resource
import requests

productos_ns = Namespace('productos', description='Operaciones relacionadas con productos')

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

# Obtener productos
def obtener_productos_desde_odoo():
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
                "product.template",  # Modelo de productos
                "search_read",
                [[]],
                {"fields": ["id", "name", "list_price", "default_code"], "limit": 10}
            ]
        },
        "id": 2
    }
    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])

# Ruta GET
@productos_ns.route('/api/productos')
class ProductosResource(Resource):
    def get(self):
        productos = obtener_productos_desde_odoo()
        return productos, 200
