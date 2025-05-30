// src/components/ui/Modal.jsx
import React from "react";

const Modal = ({ children, onClose, modalTitle }) => {
  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-light border-0 shadow-lg rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title fs-4" id="exampleModalLabel">
              {modalTitle} 
            </h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
