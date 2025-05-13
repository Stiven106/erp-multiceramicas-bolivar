import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/ventas/api/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error("Error al cargar ventas:", error));
  }, []);

  const cellStyle = {
    width: "25%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="text-white mb-4">Órdenes de Venta</h2>
        <div className="table-responsive">
          <table
            className="table table-dark table-striped table-bordered w-100"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th style={cellStyle}>ID</th>
                <th style={cellStyle}>Código</th>
                <th style={cellStyle}>Fecha</th>
                <th style={cellStyle}>Cliente</th>
                <th style={cellStyle}>Vendedor</th>
                <th style={cellStyle}>Total</th>
                <th style={cellStyle}>Estado</th>
                <th style={cellStyle}>Pago</th>
                <th style={cellStyle}>Estado Factura</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td style={cellStyle}>{venta.id}</td>
                  <td style={cellStyle}>{venta.name}</td>
                  <td style={cellStyle}>
                    {new Date(venta.date_order).toLocaleString()}
                  </td>
                  <td style={cellStyle}>
                    {venta.partner_id?.[1] || "Sin cliente"}
                  </td>
                  <td style={cellStyle}>
                    {venta.user_id?.[1] || "Sin vendedor"}
                  </td>
                  <td style={cellStyle}>${venta.amount_total.toFixed(2)}</td>
                  <td style={cellStyle}>{venta.state}</td>
                  <td style={cellStyle}>
                    {venta.payment_term_id?.[1] || "Sin plazo"}
                  </td>
                  <td style={cellStyle}>{venta.invoice_status}</td>
                </tr>
              ))}
            </tbody> 
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
