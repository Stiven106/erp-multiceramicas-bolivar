from flask_restx import Namespace, Resource
import requests

contactos_ns = Namespace('contactos', description='Operaciones relacionadas con contactos')

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

# Obtener contactos
def obtener_contactos_desde_odoo():
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
                "res.partner",
                "search_read",
                [[]],
                {"fields": ["id", "name", "email", "phone"], "limit": 10}
            ]
        },
        "id": 2
    }
    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])

# Ruta GET
@contactos_ns.route('/api/contactos')
class ContactosResource(Resource):
    def get(self):
        contactos = obtener_contactos_desde_odoo()
        return contactos, 200
    
    