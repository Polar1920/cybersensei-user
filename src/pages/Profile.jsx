import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import Menu from '../components/Menu';
import { Card, Avatar, Descriptions, Button } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from './constants';

function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
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

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Eliminar datos del localStorage y redirigir al usuario
        localStorage.removeItem('correo');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/sign';
    };

    // Función para determinar el título según el valor de exp
    const getExpTitle = (exp) => {
        if (exp <= 200) {
            return 'Aprendiz de Ninja';
        } else if (exp > 200 && exp <= 600) {
            return 'Cyber Ninja';
        } else {
            return 'Maestro Ninja';
        }
    };

    return (
        <>
            <div className='profile'>
                <div className="profile-container">
                    <Card
                        actions={[
                            <>
                                <Button icon={<EditOutlined />}>Editar</Button>
                                <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Cerrar Sesión</Button>
                            </>
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar size={64} icon={<UserOutlined />} />}
                            title={userData ? `${userData.nombre} ${userData.apellido}` : 'Cargando...'}
                            description={userData ? getExpTitle(userData.exp) : 'Cargando...'}
                        />

                        <Descriptions style={{ marginTop: 20 }}>
                            <Descriptions.Item label={<><UserOutlined style={{ marginRight: 10, marginLeft: 20 }} />Usuario </>}>
                                {userData ? userData.tipo : 'Cargando...'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><MailOutlined style={{ marginRight: 10, marginLeft: 20 }} /> Email</>}>
                                {userData ? userData.correo : 'Cargando...'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>
            </div>
            <Menu />
        </>
    );
}

export default Profile;
