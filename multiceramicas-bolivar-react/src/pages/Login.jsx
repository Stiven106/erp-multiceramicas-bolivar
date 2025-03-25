// src/pages/Login.jsx
import React from "react";
import "../styles/Login.css";


const Login = () => {
  return (
    <div className="formulario">
      <h1>BIENVENIDOS A MURCISOFT</h1>
      <h2>Inicio De Sesion:</h2>
      <form method="post">
        <div className="username">
          <label>Usuario:</label>
          <input type="text" required />
        </div>
        <div className="password">
          <label>Contraseña:</label>
          <input type="password" required />
        </div>
        <a href="/usuario">Ingresar</a>
      </form>
    </div>
  );
};

export default Login;
