import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash, Plus } from "lucide-react";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaVenta, setNuevaVenta] = useState({
    name: "",
    partner_id: "",
    date_order: "",
    amount_total: "",
  });
  const [editingVenta, setEditingVenta] = useState(null);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = () => {
    fetch("http://127.0.0.1:5000/ventas/api/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error("Error al cargar ventas:", error));
  };

  const guardarVenta = (e) => {
    e.preventDefault();
    const metodo = editingVenta ? "PUT" : "POST";
    const url = editingVenta
      ? `http://127.0.0.1:5000/ventas/api/ventas/${editingVenta.id}`
      : "http://127.0.0.1:5000/ventas/api/ventas";
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaVenta),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          cargarVentas();
          setNuevaVenta({
            name: "",
            partner_id: "",
            date_order: "",
            amount_total: "",
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

  const abrirModal = (venta = null) => {
    setEditingVenta(venta);
    setNuevaVenta(
      venta || { name: "", partner_id: "", date_order: "", amount_total: "" }
    );
    setModalVisible(true);
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
                <th className="text-center col-3">Nombre</th>
                <th className="text-center col-3">ID Cliente</th>
                <th className="text-center col-3">Fecha</th>
                <th className="text-center col-3">Total</th>
                <th className="text-center col-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td className="text-center align-middle col-1">{venta.id}</td>
                  <td className="text-center align-middle col-3">{venta.name}</td>
                  <td className="text-center align-middle col-3">{venta.partner_id}</td>
                  <td className="text-center align-middle col-3">{venta.date_order}</td>
                  <td className="text-center align-middle col-3">{venta.amount_total}</td>
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
            <input
              type="text"
              placeholder="Nombre"
              value={nuevaVenta.name}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="ID Cliente"
              value={nuevaVenta.partner_id}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, partner_id: e.target.value })
              }
              required
            />
            <input
              type="date"
              placeholder="Fecha"
              value={nuevaVenta.date_order}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, date_order: e.target.value })
              }
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Total"
              value={nuevaVenta.amount_total}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, amount_total: e.target.value })
              }
              required
            />
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