import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/clientes/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error al cargar clientes:", error));
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="text-white mb-4">Clientes</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered w-100">
            <thead>
              <tr>
                <th style={{ width: "1%" }}>ID</th>
                <th style={{ width: "5%" }}>Nombre</th>
                <th style={{ width: "5%" }}>Email</th>
                <th style={{ width: "5%" }}>Teléfono</th>
                
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td style={{ width: "1%" }}>{cliente.id}</td>
                  <td style={{ width: "10%" }}>{cliente.name}</td>
                  <td style={{ width: "10%" }}>{cliente.email}</td>
                  <td style={{ width: "10%" }}>{cliente.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
