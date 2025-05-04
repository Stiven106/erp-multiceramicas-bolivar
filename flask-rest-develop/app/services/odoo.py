"""from flask import Flask, jsonify, requests

app = Flask(__name__)

# ===== CONFIGURACIÓN DE ODOO =====
odoo_url = "http://localhost:8069/jsonrpc"  # URL del JSON-RPC de tu Odoo
odoo_db = "nombre_de_tu_base_de_datos"      # Nombre de la base de datos en Odoo
odoo_user = "tu_correo@correo.com"          # Usuario (normalmente es el email)
odoo_password = "tu_contraseña"             # Contraseña del usuario

# ===== FUNCIÓN PARA AUTENTICARSE EN ODOO =====
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
    return response.json().get("result")  # Retorna el user ID (uid)

# ===== FUNCIÓN PARA CONSULTAR CLIENTES =====
def obtener_clientes_desde_odoo():
    uid = odoo_autenticar()  # Obtenemos el ID del usuario autenticado

    if not uid:
        return []  # Si no se pudo autenticar, devolvemos lista vacía

    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "service": "object",
            "method": "execute_kw",
            "args": [
                odoo_db,          # Base de datos
                uid,              # ID del usuario autenticado
                odoo_password,    # Contraseña del usuario
                "res.partner",    # Modelo de Odoo (aquí: clientes)
                "search_read",    # Método que busca y lee registros
                [[]],             # Sin filtros (devuelve todos)
                {"fields": ["id", "name", "email", "phone"], "limit": 10}
            ]
        },
        "id": 2
    }

    response = requests.post(odoo_url, json=payload)
    return response.json().get("result", [])  # Retorna la lista de clientes

# ===== ENDPOINT PARA REACT =====
@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    clientes = obtener_clientes_desde_odoo()
    return jsonify(clientes)  # Se envía como JSON limpio a React

# ===== INICIO DEL SERVIDOR =====
if __name__ == '__main__':
    app.run(debug=True)
"""