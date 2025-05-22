import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash, Plus } from "lucide-react";

const Contactos = () => {
  const [contactos, setContactos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoContacto, setNuevoContacto] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingContacto, setEditingContacto] = useState(null);

  // Cargar contactos al montar el componente
  useEffect(() => {
    cargarContactos();
  }, []);

  const cargarContactos = () => {
    fetch("http://127.0.0.1:5000/contactos/api/contactos")
      .then((res) => res.json())
      .then((data) => setContactos(data))
      .catch((error) => console.error("Error al cargar contactos:", error));
  };

  const guardarContacto = (e) => {
    e.preventDefault();
    const metodo = editingContacto ? "PUT" : "POST";
    const url = editingContacto
      ? `http://127.0.0.1:5000/contactos/api/contactos/${editingContacto.id}`
      : "http://127.0.0.1:5000/contactos/api/contactos";
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoContacto),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          cargarContactos();
          setNuevoContacto({ name: "", email: "", phone: "" });
          setEditingContacto(null);
          setModalVisible(false);
          alert(data.message);
        } else {
          alert(data.error || "Error al guardar contacto");
        }
      })
      .catch((error) => console.error("Error al guardar contacto:", error));
  };

  const eliminarContacto = (id) => {
    if (confirm("¿Seguro que quieres eliminar este contacto?")) {
      fetch(`http://127.0.0.1:5000/contactos/api/contactos/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            cargarContactos();
            alert(data.message);
          } else {
            alert(data.error || "Error al eliminar contacto");
          }
        })
        .catch((error) => console.error("Error al eliminar contacto:", error));
    }
  };

  const abrirModal = (contacto = null) => {
    setEditingContacto(contacto);
    setNuevoContacto(contacto || { name: "", email: "", phone: "" });
    setModalVisible(true);
  };

  return (
    <div className="bg-dark">
      <Header />
      <div className="container mt-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-white">Contactos</h2>
          <Button onClick={() => abrirModal()}>
            <Plus className="mr-2" /> Crear Contacto
          </Button>
        </div>

        {/* Tabla de contactos */}
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-center col-1">ID</th>
                <th className="text-center col-4">Nombre</th>
                <th className="text-center col-4">Email</th>
                <th className="text-center col-4">Teléfono</th>
                <th className="text-center col-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto) => (
                <tr key={contacto.id}>
                  <td className="text-center align-middle col-1">
                    {contacto.id}
                  </td>
                  <td className="text-center align-middle col-4">
                    {contacto.name}
                  </td>
                  <td className="text-center align-middle col-4">
                    {contacto.email}
                  </td>
                  <td className="text-center align-middle col-4">
                    {contacto.phone || "-"}
                  </td>
                  <td className="text-end d-flex justify-content-end align-items-center gap-2">
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => abrirModal(contacto)}
                    >
                      <Pencil className="me-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarContacto(contacto.id)}
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

      {/* Modal para crear y editar contacto */}
      {modalVisible && (
        <Modal
          modalTitle={editingContacto ? "Editar Contacto" : "Crear Contacto"}
          onClose={() => setModalVisible(false)}
        >
          <form onSubmit={guardarContacto} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoContacto.name}
              onChange={(e) =>
                setNuevoContacto({ ...nuevoContacto, name: e.target.value })
              }
              required
            />
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={nuevoContacto.email}
              onChange={(e) =>
                setNuevoContacto({ ...nuevoContacto, email: e.target.value })
              }
              required
            />
            {/* Telefono */}
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoContacto.phone}
              onChange={(e) =>
                setNuevoContacto({ ...nuevoContacto, phone: e.target.value })
              }
              required
            />
            {/* Telefono */}
            <Button type="submit">
              {editingContacto ? "Actualizar" : "Crear"} Contacto
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Contactos;
