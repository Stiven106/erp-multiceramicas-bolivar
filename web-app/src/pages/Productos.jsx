import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/productos/api/productos") // Cambia la URL para productos
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="text-white mb-4">Productos</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered w-100">
            <thead>
              <tr>
                <th style={{ width: "1%" }}>ID</th>
                <th style={{ width: "5%" }}>Nombre</th>
                <th style={{ width: "5%" }}>Precio</th>
                <th style={{ width: "5%" }}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td style={{ width: "1%" }}>{producto.id}</td>
                  <td style={{ width: "10%" }}>{producto.name}</td>
                  <td style={{ width: "10%" }}>${producto.list_price}</td>
                  <td style={{ width: "10%" }}>{producto.qty_available || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Productos;
