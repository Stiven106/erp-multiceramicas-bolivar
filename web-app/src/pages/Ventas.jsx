import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash, Plus } from "lucide-react";

// Utilidad para obtener el ID y nombre de cliente
const getClienteNombre = (partner_id) => Array.isArray(partner_id) ? partner_id[1] : partner_id;
const getClienteId = (partner_id) => Array.isArray(partner_id) ? partner_id[0] : partner_id;

// Utilidad para obtener la fecha actual en formato "YYYY-MM-DD HH:mm:ss"
const getTodayFullDatetime = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// Utilidad para mostrar la fecha legible en tabla/modal
const formatDatetime = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.length > 10 ? dateStr : dateStr + " 00:00:00";
};

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);

  // Estado de la venta a crear/editar
  const [nuevaVenta, setNuevaVenta] = useState({
    partner_id: "",
    date_order: getTodayFullDatetime(),
    order_lines: [],  // [{product_id, quantity}]
  });
  const [totalReal, setTotalReal] = useState(0);

  // Cargar ventas, clientes y productos al montar
  useEffect(() => {
    cargarVentas();
    fetch("http://127.0.0.1:5000/contactos/api/contactos")
      .then((res) => res.json())
      .then(setClientes);

    // CAMBIO CRÍTICO: traer variantes reales, no plantillas
    fetch("http://127.0.0.1:5000/productos/api/variantes")
      .then((res) => res.json())
      .then(setProductos);
  }, []);

  const cargarVentas = () => {
    fetch("http://127.0.0.1:5000/ventas/api/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error("Error al cargar ventas:", error));
  };

  // Consulta el total real cada vez que cambia la venta
  useEffect(() => {
    if (
      nuevaVenta.partner_id &&
      nuevaVenta.order_lines.length > 0 &&
      nuevaVenta.order_lines.every(line => line.product_id && line.quantity)
    ) {
      fetch("http://127.0.0.1:5000/ventas/api/ventas/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: Number(nuevaVenta.partner_id),
          date_order: nuevaVenta.date_order,
          order_lines: nuevaVenta.order_lines.map(l => ({
            product_id: Number(l.product_id),
            quantity: Number(l.quantity)
          })),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalReal(data.amount_total || 0)
        })
        .catch(() => setTotalReal(0));
    } else {
      setTotalReal(0)
    }
  }, [nuevaVenta.partner_id, nuevaVenta.order_lines, nuevaVenta.date_order]);

  // Al abrir el modal, si es para crear, pone la fecha actual
  const abrirModal = (venta = null) => {
    setEditingVenta(venta);
    if (venta) {
      setNuevaVenta({
        partner_id: getClienteId(venta.partner_id),
        date_order: venta.date_order ? formatDatetime(venta.date_order) : getTodayFullDatetime(),
        order_lines: venta.order_lines
          ? venta.order_lines.map((line) => ({
              product_id: Array.isArray(line.product_id) ? line.product_id[0] : line.product_id,
              quantity: line.quantity,
            }))
          : [],
      });
    } else {
      setNuevaVenta({
        partner_id: "",
        date_order: getTodayFullDatetime(),
        order_lines: [],
      });
    }
    setModalVisible(true);
  };

  const guardarVenta = (e) => {
    e.preventDefault();
    const metodo = editingVenta ? "PUT" : "POST";
    const url = editingVenta
      ? `http://127.0.0.1:5000/ventas/api/ventas/${editingVenta.id}`
      : "http://127.0.0.1:5000/ventas/api/ventas";
    const ventaData = {
      partner_id: Number(nuevaVenta.partner_id),
      date_order: nuevaVenta.date_order,
      order_lines: nuevaVenta.order_lines.map(l => ({
        product_id: Number(l.product_id),
        quantity: Number(l.quantity)
      })),
    };
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ventaData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          cargarVentas();
          setNuevaVenta({
            partner_id: "",
            date_order: getTodayFullDatetime(),
            order_lines: [],
          });
          setEditingVenta(null);
          setModalVisible(false);
          alert(data.message);
        } else {
          alert(data.error || "Error al guardar venta");
        }
      })
      .catch((error) => console.error("Error al guardar venta:", error));
  };

  const eliminarVenta = (id) => {
    if (confirm("¿Seguro que quieres eliminar esta venta?")) {
      fetch(`http://127.0.0.1:5000/ventas/api/ventas/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            cargarVentas();
            alert(data.message);
          } else {
            alert(data.error || "Error al eliminar venta");
          }
        })
        .catch((error) => console.error("Error al eliminar venta:", error));
    }
  };

  // Manejo de cambios en los productos agregados
  const handleProductoChange = (index, field, value) => {
    const updated = [...nuevaVenta.order_lines];
    updated[index][field] = value;
    setNuevaVenta((prev) => ({
      ...prev,
      order_lines: updated,
    }));
  };

  // Agregar un nuevo producto a la venta
  const agregarProducto = () => {
    setNuevaVenta((prev) => ({
      ...prev,
      order_lines: [
        ...prev.order_lines,
        { product_id: productos[0]?.id || "", quantity: 1 },
      ],
    }));
  };

  // Eliminar un producto de la venta
  const eliminarProducto = (index) => {
    const updated = [...nuevaVenta.order_lines];
    updated.splice(index, 1);
    setNuevaVenta((prev) => ({
      ...prev,
      order_lines: updated,
    }));
  };

  return (
    <div className="bg-dark">
      <Header />
      <div className="container mt-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-white">Ventas</h2>
          <Button onClick={() => abrirModal()}>
            <Plus className="mr-2" /> Crear Venta
          </Button>
        </div>

        {/* Tabla de ventas */}
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-center col-1">ID</th>
                <th className="text-center col-4">Cliente</th>
                <th className="text-center col-3">Fecha</th>
                <th className="text-center col-3">Total</th>
                <th className="text-center col-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td className="text-center align-middle col-1">{venta.id}</td>
                  <td className="text-center align-middle col-4">
                    {getClienteNombre(venta.partner_id)}
                  </td>
                  <td className="text-center align-middle col-3">
                    {formatDatetime(venta.date_order)}
                  </td>
                  <td className="text-center align-middle col-3">
                    {venta.amount_total}
                  </td>
                  <td className="text-end d-flex justify-content-end align-items-center gap-2">
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => abrirModal(venta)}
                    >
                      <Pencil className="me-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarVenta(venta.id)}
                    >
                      <Trash className="me-1" /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear y editar venta */}
      {modalVisible && (
        <Modal
          modalTitle={editingVenta ? "Editar Venta" : "Crear Venta"}
          onClose={() => setModalVisible(false)}
        >
          <form onSubmit={guardarVenta} className="space-y-4">
            {/* Cliente */}
            <label className="block mb-1">Cliente</label>
            <select
              value={nuevaVenta.partner_id}
              onChange={(e) =>
                setNuevaVenta((prev) => ({
                  ...prev,
                  partner_id: e.target.value,
                }))
              }
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Fecha - solo mostrarla, no editable */}
            <label className="block mb-1">Fecha</label>
            <input
              type="text"
              value={nuevaVenta.date_order}
              disabled
              readOnly
              className="w-full bg-gray-200 text-black"
            />

            {/* Productos */}
            <label className="block mb-1">Productos</label>
            {nuevaVenta.order_lines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select
                  value={line.product_id}
                  onChange={(e) =>
                    handleProductoChange(idx, "product_id", Number(e.target.value))
                  }
                  required
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Precio: {p.list_price})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) =>
                    handleProductoChange(idx, "quantity", Number(e.target.value))
                  }
                  required
                  style={{ width: "70px" }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => eliminarProducto(idx)}
                >
                  <Trash />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={agregarProducto}>
              <Plus className="mr-2" /> Agregar Producto
            </Button>

            {/* Total real de Odoo */}
            <div className="mt-2 font-bold">
              Total + IVA (19%): {totalReal}
            </div>

            <Button type="submit">
              {editingVenta ? "Actualizar" : "Crear"} Venta
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Ventas;