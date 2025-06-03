import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/MainPage";
import Login from "./pages/Login";
import Contactos from "./pages/Contactos";
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario"
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/main" element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        } />
        
        <Route path="/Ventas" element={
          <ProtectedRoute>
            <Ventas />
          </ProtectedRoute>
        } />
        
        <Route path="/Contactos" element={
          <ProtectedRoute>
            <Contactos />
          </ProtectedRoute>
        } />
        
        <Route path="/Productos" element={
          <ProtectedRoute>
            <Productos />
          </ProtectedRoute>
        } />
        
        <Route path="/Inventario" element={
          <ProtectedRoute>
            <Inventario />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
