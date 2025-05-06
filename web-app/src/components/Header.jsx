import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black text-light py-3 fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/main" className="text-warning fw-bold fs-4 text-decoration-none">
          MURCISOFT
        </Link>
        <Link to="/" className="btn btn-outline-warning">
          Cerrar Sesión
        </Link>
      </div>
    </header>
  );
};

export default Header;
