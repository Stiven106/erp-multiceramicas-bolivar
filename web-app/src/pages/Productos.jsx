import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "@/components/ui/Button";
import { Pencil, Trash, Plus } from "lucide-react";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    list_price: "",
    default_code: "",
    type: "",
    
  });
  const [editingProducto, setEditingProducto] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    fetch("http://127.0.0.1:5000/productos/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    const metodo = editingProducto ? "PUT" : "POST";
    const url = editingProducto
      ? `http://127.0.0.1:5000/productos/api/productos/${editingProducto.id}`
      : "http://127.0.0.1:5000/productos/api/productos";
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          cargarProductos();
          setNuevoProducto({ name: "", list_price: "", default_code: "", type: ""});
          setEditingProducto(null);
          setModalVisible(false);
          alert(data.message);
        } else {
          alert(data.error || "Error al guardar producto");
        }
      })
      .catch((error) => console.error("Error al guardar producto:", error));
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      fetch(`http://127.0.0.1:5000/productos/api/productos/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            cargarProductos();
            alert(data.message);
          } else {
            alert(data.error || "Error al eliminar producto");
          }
        })
        .catch((error) => console.error("Error al eliminar producto:", error));
    }
  };

  const abrirModal = (producto = null) => {
    setEditingProducto(producto);
    setNuevoProducto(producto || { name: "", list_price: "", default_code: "", type: "" });
    setModalVisible(true);
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-white">Productos</h2>
          <Button onClick={() => abrirModal()}>
            <Plus className="mr-2" /> Crear Producto
          </Button>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-center col-1">ID</th>
                <th className="text-center col-2">Nombre</th>
                <th className="text-center col-2">Precio</th>
                <th className="text-center col-2">Tipo</th>
                <th className="text-center col-2">Codigo Producto</th>
                <th className="text-center col-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="text-center align-middle col-1">{producto.id}</td>
                  <td className="text-center align-middle col-2">{producto.name}</td>
                  <td className="text-center align-middle col-2">${producto.list_price}</td>
                  <td className="text-center align-middle col-2">{producto.type || "-"}</td>
                  <td className="text-center align-middle col-2">{producto.default_code || "-"}</td>
                  <td className="text-end d-flex justify-content-end align-items-center gap-2">
                    <Button variant="outline" className="btn btn-sm btn-outline-primary" onClick={() => abrirModal(producto)}>
                      <Pencil className="me-1" /> Editar
                    </Button>
                    <Button variant="outline" className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(producto.id)}>
                      <Trash className="me-1" /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalVisible && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-light border-0 shadow-lg rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fs-4">{editingProducto ? "Editar Producto" : "Crear Producto"}</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={guardarProducto} className="space-y-4">
                  <input type="text" placeholder="Nombre" value={nuevoProducto.name} onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })} required />
                  <input type="text" placeholder="Precio" value={nuevoProducto.list_price} onChange={(e) => setNuevoProducto({ ...nuevoProducto, list_price: e.target.value })} required />
                  <input type="text" placeholder="Codigo" value={nuevoProducto.default_code} onChange={(e) => setNuevoProducto({ ...nuevoProducto, default_code: e.target.value })} required />
                  <input type="text" placeholder="Tipo" value={nuevoProducto.type} onChange={(e) => setNuevoProducto({ ...nuevoProducto, type: e.target.value })} required />
                  <Button type="submit">{editingProducto ? "Actualizar" : "Crear"} Producto</Button>
                </form>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;