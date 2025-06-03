import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-black text-light py-3 fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/main" className="text-warning fw-bold fs-4 text-decoration-none">
          MURCISOFT
        </Link>
        <button 
          onClick={handleLogout}
          className="btn btn-outline-warning"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
