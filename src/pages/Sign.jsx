import React from 'react';
import '../styles/Sign.css';
import { Button, Form, Input, Tabs } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './constants';

function Sign() {
  const { TabPane } = Tabs;
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        correo: values.email,
        password: values.password,
      });
      if (response.status === 200) {
        console.log(values.email);
        localStorage.setItem('correo', values.email); // Guarda el correo en el almacenamiento local para verificar
        navigate('/verify'); // Redirige al usuario a la página de verificación
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Manejar errores, mostrar mensajes al usuario, etc.
    }
  };

  return (
    <div className="sign-container">
      <Tabs defaultActiveKey="1" centered>
        <TabPane>
          <div className='home'>
            <h2>Bienvenido!!</h2>
            <p>Accede a tu cuenta para explorar nuestro contenido educativo sobre ciberseguridad.</p>
            <Form name="login-form" layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Correo"
                name="email"
                rules={[{ required: true, message: 'Por favor ingresa tu correo' }]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Iniciar Sesión</Button>
              </Form.Item>
              <Button type="second" href="/select-edad">
                Registro
              </Button>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Sign;
