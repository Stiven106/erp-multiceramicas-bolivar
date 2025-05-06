import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Clientes from "./pages/Contactos";
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/Ventas" element={<Ventas />} />
        <Route path="/Contactos" element={<Clientes />} />
        <Route path="/Productos" element={<Productos />} />
      </Routes>
    </Router>
  );
};

export default App;
