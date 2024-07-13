import React, { useEffect, useState } from 'react';
import '../styles/Module.css'; // Asegúrate de tener los estilos adecuados para Module
import { Progress } from 'antd';
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu';
import { API_URL } from './constants';

function Module() {
    const { moduleId } = useParams();
    const [module, setModule] = useState(null);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const token = localStorage.getItem('token');
                const moduleResponse = await axios.get(`${API_URL}/modulos/${moduleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setModule(moduleResponse.data);

                const pagesResponse = await axios.get(`${API_URL}/modulos/${moduleId}/paginas`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPages(pagesResponse.data);

                // Obtener el progreso almacenado en localStorage
                let storedProgress = JSON.parse(localStorage.getItem('progress')) || {};

                // Verificar y actualizar el progreso para este módulo
                if (!storedProgress[moduleId]) {
                    storedProgress[moduleId] = { pages: {} };
                }

                // Verificar cada página y agregarla si no existe en el progreso
                pagesResponse.data.forEach(pagina => {
                    if (!storedProgress[moduleId].pages[pagina.id]) {
                        storedProgress[moduleId].pages[pagina.id] = { checked: false };
                    }
                });

                // Guardar el progreso actualizado en localStorage
                localStorage.setItem('progress', JSON.stringify(storedProgress));
            } catch (error) {
                console.error('Error al obtener el módulo y las páginas:', error);
            }
        };

        fetchModule();
    }, [moduleId]);

    if (!module) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <div className="info-modulo">
                <div className="info-header">
                    <img className="module-image" src={module.imagen} alt={module.nombre} />
                </div>

                <div className="dashboard">
                    <div>
                        <h2 className="module-title">{module.nombre}</h2>
                        <h4>Avance</h4>
                        <Progress percent={30} steps={5} />
                        <p>{module.descripcion}</p>
                    </div>
                </div>

                <div className="modulos">
                    <h4>Páginas del Módulo</h4>
                    <div className="cards">
                        {pages.map((pagina) => (
                            <NavLink key={pagina.id} to={`/page/${pagina.id}`} className="card">
                                <div className="card-content">
                                    <div className="card-title-container">
                                        <h4>{pagina.nombre}</h4>
                                    </div>
                                    <div className="card-check">
                                        {localStorage.getItem('progress') &&
                                            JSON.parse(localStorage.getItem('progress'))[moduleId]?.pages?.[pagina.id]?.checked ? (
                                                <img src="/icons/ninja-weapon.svg" alt="Ninja Weapon" />
                                        ) : (
                                            <p></p>
                                        )}
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
            <Menu />
        </>
    );
}

export default Module;
