import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash, Plus } from "lucide-react";

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    product_id: "",
    quantity: "",
    location_id: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  // Cargar inventario al montar el componente
  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = () => {
    fetch("http://127.0.0.1:5000/inventario/api/inventario")
      .then((res) => res.json())
      .then((data) => setInventario(data))
      .catch((error) => console.error("Error al cargar inventario:", error));
  };

  const guardarItem = (e) => {
    e.preventDefault();
    const metodo = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `http://127.0.0.1:5000/inventario/api/inventario/${editingItem.id}`
      : "http://127.0.0.1:5000/inventario/api/inventario";
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoItem),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          cargarInventario();
          setNuevoItem({ product_id: "", quantity: "", location_id: "" });
          setEditingItem(null);
          setModalVisible(false);
          alert(data.message);
        } else {
          alert(data.error || "Error al guardar inventario");
        }
      })
      .catch((error) => console.error("Error al guardar inventario:", error));
  };

  const eliminarItem = (id) => {
    if (confirm("¿Seguro que quieres eliminar este registro de inventario?")) {
      fetch(`http://127.0.0.1:5000/inventario/api/inventario/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            cargarInventario();
            alert(data.message);
          } else {
            alert(data.error || "Error al eliminar inventario");
          }
        })
        .catch((error) => console.error("Error al eliminar inventario:", error));
    }
  };

  const abrirModal = (item = null) => {
    setEditingItem(item);
    setNuevoItem(
      item || { product_id: "", quantity: "", location_id: "" }
    );
    setModalVisible(true);
  };

  return (
    <div className="bg-dark">
      <Header />
      <div className="container mt-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-white">Inventario</h2>
          <Button onClick={() => abrirModal()}>
            <Plus className="mr-2" /> Agregar Inventario
          </Button>
        </div>

        {/* Tabla de inventario */}
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-center col-1">ID</th>
                <th className="text-center col-4">Product DATA</th>
                <th className="text-center col-4">Cantidad</th>
                <th className="text-center col-4">ID Ubicación</th>
                <th className="text-center col-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr key={item.id}>
                  <td className="text-center align-middle col-1">{item.id}</td>
                  <td className="text-center align-middle col-4">{item.product_id}</td>
                  <td className="text-center align-middle col-4">{item.quantity}</td>
                  <td className="text-center align-middle col-4">{item.location_id}</td>
                  <td className="text-end d-flex justify-content-end align-items-center gap-2">
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => abrirModal(item)}
                    >
                      <Pencil className="me-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarItem(item.id)}
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

      {/* Modal para crear y editar inventario */}
      {modalVisible && (
        <Modal
          modalTitle={editingItem ? "Editar Inventario" : "Agregar Inventario"}
          onClose={() => setModalVisible(false)}
        >
          <form onSubmit={guardarItem} className="space-y-4">
            <input
              type="number"
              placeholder="ID Producto"
              value={nuevoItem.product_id}
              onChange={(e) =>
                setNuevoItem({ ...nuevoItem, product_id: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={nuevoItem.quantity}
              onChange={(e) =>
                setNuevoItem({ ...nuevoItem, quantity: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="ID Ubicación"
              value={nuevoItem.location_id}
              onChange={(e) =>
                setNuevoItem({ ...nuevoItem, location_id: e.target.value })
              }
              required
            />
            <Button type="submit">
              {editingItem ? "Actualizar" : "Agregar"} Inventario
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Inventario;