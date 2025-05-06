import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Contactos = () => {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/contactos/api/contactos")
      .then((res) => res.json())
      .then((data) => setContactos(data))
      .catch((error) => console.error("Error al cargar contactos:", error));
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="text-white mb-4">Contactos</h2>
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
              {contactos.map((contacto) => (
                <tr key={contacto.id}>
                  <td style={{ width: "1%" }}>{contacto.id}</td>
                  <td style={{ width: "10%" }}>{contacto.name}</td>
                  <td style={{ width: "10%" }}>{contacto.email}</td>
                  <td style={{ width: "10%" }}>{contacto.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contactos;
