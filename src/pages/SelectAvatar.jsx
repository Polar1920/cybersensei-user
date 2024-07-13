import React from "react";
import { Button } from 'antd';
import SelectionCard from "../components/SelectionCard";
import chica from "/avatar/chica/chica.gif";
import chico from "/avatar/chico/chico.gif";
import "./../styles/SelectAvatar.css";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de useHistory

const SelectAvatar = () => {
  const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory

  const selectAvatar = (avatarType) => {
    localStorage.setItem('avatarType', avatarType);
    // Redirige a la página de registro
    navigate("/register");
  };

  return (
    <div className="selection-screen">
      <Button type="third" href="/select-edad">
        Regresar
      </Button>
      <h1 className="selection-screen-title">Selecciona tu guia</h1>
      <div className="selection-screen-card-container">
        <SelectionCard
          title="Sere tu guia de confianza"
          imageSrc={chico}
          color="color1"
          onClick={() => selectAvatar('chico')} // Define la acción al clic
        />
        <SelectionCard
          title="Te ayudare con lo que necesites"
          imageSrc={chica}
          color="color2"
          onClick={() => selectAvatar('chica')} // Define la acción al clic
        />
        <Button type="primary" onClick={() => selectAvatar('ninguno')}>
          No quiero un Sensei
        </Button>
      </div>
    </div>
  );
};

export default SelectAvatar;
