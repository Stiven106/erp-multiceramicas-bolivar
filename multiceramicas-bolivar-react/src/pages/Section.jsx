import React from "react";
import "../styles/Section.css";

const Section = ({ title, link, imgSrc }) => {
  return (
    <div className="titulo_seccion">
      <a href={link}>{title}</a>
      <img src={imgSrc} alt={title} />
    </div>
  );
};