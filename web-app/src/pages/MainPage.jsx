import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const MainPage = () => {
  return (
    <div className="bg-dark text-light min-vh-100">
      <Header />

      <div className="container text-center py-4">
        <h2 className="mb-4">BIENVENID@, ¿Qué acción deseas realizar?</h2>

        <div className="row justify-content-center">
          {/* Módulo de Ventas */}
          <div className="col-md-5 m-3 p-3 border border-warning rounded text-center">
            <Link to="/Ventas" className="text-decoration-none text-light">
              <h4 className="bg-dark text-warning p-2 rounded">Módulo de Ventas</h4>
              <img 
                src="/img/compras.png" 
                alt="Módulo de Ventas" 
                className="img-fluid rounded"
              />
            </Link>
          </div>

          {/* Módulo de Productos */}
          <div className="col-md-5 m-3 p-3 border border-warning rounded text-center">
            <Link to="/productos" className="text-decoration-none text-light">
              <h4 className="bg-dark text-warning p-2 rounded">Módulo de Productos</h4>
              <img 
                src="/img/2024-10-30_16h58_02.png" 
                alt="Módulo de Productos" 
                className="img-fluid rounded"
              />
            </Link>
          </div>
          {/* Módulo de Contactos */}
          <div className="col-md-5 m-3 p-3 border border-warning rounded text-center">
            <Link to="/Contactos" className="text-decoration-none text-light">
              <h4 className="bg-dark text-warning p-2 rounded">Módulo de Contactos</h4>
              <img 
                src="/img/2024-10-30_16h58_02.png" 
                alt="Módulo de contactos" 
                className="img-fluid rounded"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
