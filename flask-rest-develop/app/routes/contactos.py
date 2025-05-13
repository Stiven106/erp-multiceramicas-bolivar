from flask_restx import Namespace, Resource, reqparse
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

# Crear contacto
def crear_contacto_en_odoo(nombre, email, telefono):
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
                "res.partner",
                "create",
                [{"name": nombre, "email": email, "phone": telefono}]
            ]
        },
        "id": 3
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Contacto creado correctamente"}, 201
    else:
        return {"error": "Error al crear contacto"}, 500

# Ruta GET y POST
@contactos_ns.route('/api/contactos')
class ContactosResource(Resource):
    def get(self):
        contactos = obtener_contactos_desde_odoo()
        return contactos, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("name", required=True, help="El nombre del contacto es requerido")
        parser.add_argument("email", required=True, help="El email del contacto es requerido")
        parser.add_argument("phone", required=True, help="El teléfono del contacto es requerido")
        args = parser.parse_args()
        nombre = args["name"]
        email = args["email"]
        telefono = args["phone"]
        return crear_contacto_en_odoo(nombre, email, telefono)
