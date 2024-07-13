import React from "react";
import PropTypes from "prop-types";
import "./../styles/SelectionCard.css";

const SelectionCard = ({
  title,
  subtitle,
  imageSrc,
  color,
  onClick, // Nuevo prop para manejar el clic
  children,
}) => {
  return (
    <div className={`selection-card ${color}`} onClick={onClick}>
      <div className="selection-card-header">
        <h2 className="selection-card-title">{title}</h2>
        {subtitle && <h3 className="selection-card-subtitle">{subtitle}</h3>}
      </div>
      <div className="selection-card-content">
        <img className="selection-card-image" src={imageSrc} alt={title} />
        {children}
      </div>
    </div>
  );
};

SelectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  imageSrc: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func, // Prop para manejar el clic
  children: PropTypes.node,
};

export default SelectionCard;
