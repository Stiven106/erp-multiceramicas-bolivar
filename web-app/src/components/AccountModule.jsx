import React from "react";
import ModuleCard from "./ModuleCard";
import Header from "./Header";

const SalesModule = () => {
  return (
    
    <div className="bg-dark text-light min-vh-100">
      <Header />

    <div className="container text-center mt-4">
      <h2 className="text-light fw-bold">MÓDULO DE VENTAS</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <ModuleCard
            title="Nuevo Caso"
            image="/img/compras.png"
            buttonText="Nuevo Caso"
            link="/sales/new-case"
          />
        </div>
        <div className="col-md-4">
          <ModuleCard
            title="Editar Caso"
            image="/img/inventario.png"
            buttonText="Editar Caso"
            link="/sales/edit-case"
          />
        </div>
        <div className="col-md-4">
          <ModuleCard
            title="Reportes"
            image="/img/file_74529_main1.jpg"
            buttonText="Reportes"
            link="/sales/reports"
          />
        </div>
      </div>
    </div>
    </div>

  );
};

export default SalesModule;
