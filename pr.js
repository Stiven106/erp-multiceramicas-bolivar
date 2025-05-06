const axios = require('axios');

// Configuración
const ODOO_URL = 'http://localhost:8069/jsonrpc';
const DB_NAME = 'odoo_db';
const USERNAME = 'admin';
const PASSWORD = 'admin';

// Función de autenticación mejorada
async function authenticate() {
  try {
    const response = await axios.post(ODOO_URL, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "login",
        args: [DB_NAME, USERNAME, PASSWORD]
      },
      id: 1
    });

    if (response.data.result === false) {
      throw new Error('Autenticación fallida. Verifica: 1) Credenciales 2) Nombre de DB 3) Usuario activo');
    }
    
    return response.data.result;
  } catch (error) {
    console.error('❌ Error en autenticación:', error.response?.data || error.message);
    throw error;
  }
}

// Consultar stock.quant (Existencias)
async function getStockQuants(uid, filters = []) {
  try {
    const response = await axios.post(ODOO_URL, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          DB_NAME,
          uid,
          PASSWORD,
          "stock.quant",
          "search_read",
          [filters],
          {
            fields: [
              "id", 
              "product_id", 
              "location_id", 
              "quantity",
              "reserved_quantity",
              "lot_id",
              "package_id"
            ],
            limit: 20
          }
        ]
      },
      id: 2
    });

    return response.data.result;
  } catch (error) {
    console.error('❌ Error al consultar stock:', error.response?.data || error.message);
    throw error;
  }
}

// Consultar stock.picking (Albaranes/Transferencias)
async function getStockPickings(uid, pickingType = null) {
  try {
    const domain = [];
    
    // Filtro opcional por tipo de albarán
    if (pickingType) {
      domain.push(["picking_type_id.code", "=", pickingType]); // 'incoming', 'outgoing', 'internal'
    }

    const response = await axios.post(ODOO_URL, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          DB_NAME,
          uid,
          PASSWORD,
          "stock.picking",
          "search_read",
          [domain],
          {
            fields: [
              "name",
              "partner_id",
              "scheduled_date",
              "origin",
              "state",
              "picking_type_id",
              "move_ids",
              "move_line_ids"
            ],
            order: "scheduled_date desc",
            limit: 10
          }
        ]
      },
      id: 3
    });

    return response.data.result;
  } catch (error) {
    console.error('❌ Error al consultar albaranes:', error.response?.data || error.message);
    throw error;
  }
}

// Función para mostrar resultados en formato legible
function displayResults(data, title) {
  console.log(`\n📦 ${title} (${data.length} registros):`);
  console.log("-".repeat(50));
  
  data.forEach((item, index) => {
    console.log(`#${index + 1}`);
    Object.entries(item).forEach(([key, value]) => {
      // Formatear campos relacionales (ej: [id, name])
      const displayValue = Array.isArray(value) ? `${value[0]} (${value[1]})` : value;
      console.log(`  ${key.padEnd(20)}: ${displayValue}`);
    });
    console.log("-".repeat(30));
  });
}

// Ejecución principal
(async () => {
  try {
    console.log("🔐 Autenticando...");
    const uid = await authenticate();
    console.log("✅ UID obtenido:", uid);

    // 1. Consultar existencias de inventario
    const stockQuants = await getStockQuants(uid, [
      ["quantity", ">", 0]  // Solo items con stock positivo
    ]);
    displayResults(stockQuants, "EXISTENCIAS DE INVENTARIO (stock.quant)");

    // 2. Consultar albaranes de salida
    const outgoingPickings = await getStockPickings(uid, "outgoing");
    displayResults(outgoingPickings, "ALBARANES DE SALIDA (stock.picking)");

    // 3. Consultar todos los albaranes (sin filtro)
    const allPickings = await getStockPickings(uid);
    displayResults(allPickings, "TODOS LOS ALBARANES");

  } catch (error) {
    console.error("⚠️ Error en el proceso principal:", error.message);
    process.exit(1);
  }
})();