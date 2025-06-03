import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Verificar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Si el token no ha expirado, redirigir a main
        if (payload.exp > currentTime) {
          navigate('/main');
        } else {
          // Token expirado, eliminarlo
          localStorage.removeItem('token');
        }
      } catch (error) {
        // Token inválido, eliminarlo
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  //  Esta función ahora hace un POST al backend
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita recarga

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y redirigir
        localStorage.setItem("token", data.token);
        navigate("/main");
      } else {
        alert(data.response || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="formulario">
      <h1>BIENVENIDOS A MURCISOFT</h1>
      <h2>Inicio De Sesión:</h2>
      <form onSubmit={handleLogin}>
        <div className="username">
          <label>Usuario:</label>
          {/* ✅ Conectar el input con el estado */}
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="password">
          <label>Contraseña:</label>
          {/*  Conectar el input con el estado */}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <button type="submit">Ingresar</button>

        </div>
      </form>
    </div>
  );
};

export default Login;
