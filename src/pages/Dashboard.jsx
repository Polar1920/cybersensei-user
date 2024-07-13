import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { Progress, Flex } from 'antd';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Menucomp from '../components/Menu';
import { API_URL } from './constants';

function Dashboard() {
  const [modules, setModules] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/modulos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setModules(response.data);

        // Obtener o inicializar el progreso desde localStorage
        let progress = JSON.parse(localStorage.getItem('progress')) || {};

        // Actualizar el progreso con los IDs de los módulos obtenidos
        response.data.forEach(modulo => {
          if (!progress[modulo.id]) {
            progress[modulo.id] = { pages: {} };
          }
        });

        // Guardar el progreso actualizado en localStorage
        localStorage.setItem('progress', JSON.stringify(progress));
      } catch (error) {
        console.error('Error al obtener los módulos:', error);
      }
    };

    // Definir la función para obtener datos del usuario
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const correo = localStorage.getItem('correo');
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            correo: correo
          }
        });
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchModules();
    fetchUserData();
  }, []);

  return (
    <div className='dashboard-container'>
      <div className='dashboard'>
        <div className='circle-progress'>
          <h4>Avance Total</h4>
          <Flex wrap gap="middle">
            <Progress percent={20} steps={5} />
          </Flex>
        </div>
      </div>

      <div className="modulos">
        <h4>Módulos</h4>
        <div className='cards'>
          {modules.map((modulo) => (
            <NavLink key={modulo.id} to={`/module/${modulo.id}`} className='card'>
              <img src={modulo.imagen} alt={modulo.nombre} />
              <div className='card-content'>
                <h4>{modulo.nombre}</h4>
                <Flex gap="small" vertical>
                  <Progress percent={10} steps={5} />
                </Flex>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      <Menucomp />
    </div>
  );
}

export default Dashboard;
