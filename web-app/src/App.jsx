import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/MainPage";
import Login from "./pages/Login";
import Contactos from "./pages/Contactos";
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Login />} />
        <Route path="/Ventas" element={<Ventas />} />
        <Route path="/Contactos" element={<Contactos />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/Inventario" element={<Inventario />} />
      </Routes>
    </Router>
  );
};

export default App;
