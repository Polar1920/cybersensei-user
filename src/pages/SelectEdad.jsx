import React from 'react';
import '../styles/SelectEdad.css';
import { Button } from 'antd';

function SelectEdad() {
  const setUserType = (userType) => {
    localStorage.setItem('userType', userType);
  };

  return (
    <>
      <Button type="third" href="/sign">
        Regresar al Login
      </Button>
      <div className="edad">
        <h3>Selecciona tu tipo de usuario </h3>
        <div className="buttons-edad">
          <Button type="primary" onClick={() => { setUserType('niño') }} href="/select-avatar">
            Niño
          </Button>
          <p>(Recomendado para menores de 11 años)</p>
          <Button type="primary" onClick={() => { setUserType('joven') }} href="/select-avatar">
            Joven-Adulto
          </Button>
          <p>(Recomendado para personas entre 12 a 40 años)</p>
          <Button type="primary" onClick={() => { setUserType('adulto') }} href="/select-avatar">
            Adulto-Mayor
          </Button>
          <p>(Recomendado para personas con 41 años en adelante)</p>
        </div>
      </div>
    </>
  );
}

export default SelectEdad;
