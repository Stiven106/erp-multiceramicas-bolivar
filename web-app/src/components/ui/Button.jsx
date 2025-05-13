// src/components/ui/Button.jsx
import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", className = "", size = "", margin = "2", ...props }) => {
  // Clases de Bootstrap según el variant
  const variantStyles = variant === "outline" 
    ? "btn btn-outline-primary"  // Outline estilo
    : variant === "secondary" 
    ? "btn btn-secondary"         // Variante secundaria
    : "btn btn-primary";          // Variante principal por defecto

  // Clases de tamaño del botón (Bootstrap soporta 'sm', 'lg', 'xl')
  const sizeStyles = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  // Clase para el margen (Bootstrap usa m-0, m-1, m-2, etc., para aplicar márgenes)
  const marginStyles = `m-${margin}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variantStyles} ${sizeStyles} ${marginStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
