import React, { useState } from "react"; // Necesario para manejar el estado de inputs
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  // ✅ Se agregan estados para capturar los valores del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Esta función ahora hace un POST al backend
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
          {/* ✅ Conectar el input con el estado */}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
