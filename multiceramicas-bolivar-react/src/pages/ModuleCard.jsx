import React from "react";
import { Link } from "react-router-dom";

const ModuleCard = ({ title, image, buttonText, link }) => {
  return (
    <div className="text-center">
      <Link to={link} className="btn btn-danger mb-2">{buttonText}</Link>
      <div className="shadow rounded overflow-hidden">
        <img src={image} alt={title} className="img-fluid rounded" />
      </div>
    </div>
  );
};

export default ModuleCard;
