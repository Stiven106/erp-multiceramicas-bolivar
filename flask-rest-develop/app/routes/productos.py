from flask_restx import Namespace, Resource, reqparse
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
                "product.template",
                "search_read",
                [[]],
                {"fields": ["id", "name", "list_price", "default_code", "type"], "limit": 222}
            ]
        },
        "id": 2
    }
    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])

# Crear producto

def crear_producto_en_odoo(nombre, precio, codigo):
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
                "product.template",
                "create",
                [{"name": nombre, "list_price": precio, "default_code": codigo}]
            ]
        },
        "id": 3
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Producto creado correctamente"}, 201
    else:
        return {"error": "Error al crear producto"}, 500

# Editar producto

def editar_producto_en_odoo(producto_id, nombre, precio, codigo):
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
                "product.template",
                "write",
                [[producto_id], {"name": nombre, "list_price": precio, "default_code": codigo}]
            ]
        },
        "id": 4
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Producto actualizado correctamente"}, 200
    else:
        return {"error": "Error al actualizar producto"}, 500

# Eliminar producto

def eliminar_producto_en_odoo(producto_id):
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
                "product.template",
                "unlink",
                [[producto_id]]
            ]
        },
        "id": 5
    }
    response = requests.post(odoo_url, json=payload)
    if response.ok:
        return {"message": "Producto eliminado correctamente"}, 200
    else:
        return {"error": "Error al eliminar producto"}, 500

# Rutas GET, POST, PUT y DELETE
@productos_ns.route('/api/productos')
class ProductosResource(Resource):
    def get(self):
        productos = obtener_productos_desde_odoo()
        return productos, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("name", required=True, help="El nombre del producto es requerido")
        parser.add_argument("list_price", required=True, type=float, help="El precio del producto es requerido")
        parser.add_argument("default_code", required=True, help="El código del producto es requerido")
        args = parser.parse_args()
        nombre = args["name"]
        precio = args["list_price"]
        codigo = args["default_code"]
        return crear_producto_en_odoo(nombre, precio, codigo)

@productos_ns.route('/api/productos/<int:id>')
class ProductoResource(Resource):
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("name", required=True, help="El nombre del producto es requerido")
        parser.add_argument("list_price", required=True, type=float, help="El precio del producto es requerido")
        parser.add_argument("default_code", required=True, help="El código del producto es requerido")
        args = parser.parse_args()
        nombre = args["name"]
        precio = args["list_price"]
        codigo = args["default_code"]
        return editar_producto_en_odoo(id, nombre, precio, codigo)

    def delete(self, id):
        return eliminar_producto_en_odoo(id)
    