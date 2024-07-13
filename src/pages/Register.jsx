import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import { Button, Form, Input } from "antd";
import axios from 'axios';
import AvatarSpeech from "../components/AvatarSpeech";
import { API_URL } from './constants';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const initialMessages = [
    "Hola! soy tu Sensei",
    "Estaré aquí para ayudarte",
    "¿Necesitas algún consejo?",
  ];

  const initialExpressions = [
    "normal",
    "pensando",
    "feliz",
    "triste",
    "informando",
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [avatarName, setAvatarName] = useState("Mayrax");
  const [expressions, setExpressions] = useState(initialExpressions);
  const [passChecked, setPassChecked] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el tipo de avatar desde el almacenamiento local
    const avatarType = localStorage.getItem("avatarType");
    if (avatarType === "chico") {
      setAvatarName("Nell");
    } else if (avatarType === "chica") {
      setAvatarName("Mayrax");
    } else {
      setAvatarName("");
    }
  }, []);

  // Función para verificar la fortaleza de la contraseña
  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasNoWhitespace = /^\S*$/.test(password);

    // Retornar un objeto con el resultado de cada criterio
    return {
      passed: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength && hasNoWhitespace,
      messages: [
        !hasUpperCase && "Debe incluir letras mayúsculas.",
        !hasLowerCase && "Debe incluir letras minúsculas.",
        !hasNumber && "Debe incluir números.",
        !hasSpecialChar && "Debe incluir caracteres especiales.",
        !hasMinLength && "La longitud de la contraseña debe ser igual o mayor a 8 caracteres.",
        !hasNoWhitespace && "No debe tener espacios en blanco."
      ].filter(Boolean) // Filtrar los mensajes para eliminar los valores nulos o indefinidos
    };
  };

  // Función para manejar el envío del formulario de registro
  const onFinish = async (values) => {

    try {
      const userType = localStorage.getItem("userType");

      const passwordStrength = checkPasswordStrength(values.password);

      if (!passwordStrength.passed) {
        // Mostrar mensajes de error si la contraseña no es válida
        setMessages([
          "Una buena contraseña debe cumplir con:",
          ...passwordStrength.messages
        ]);
        setAvatarName("Debes mejorar tu contraseña");
        setExpressions(["pensando", "informando", "normal"]);
        setPassChecked(false);
        return;
      }

      // Enviar la solicitud de registro al servidor
      const response = await axios.post(`${API_URL}/register`, {
        nombre: values.name,
        apellido: values.lastname,
        correo: values.email,
        password: values.password,
        tipo: userType,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Registro exitoso:', response.data);
        navigate('/sign');
      } else {
        console.error('Error en el registro: Estado no esperado:', response.status);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  // Función para manejar errores en el formulario
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    const missingFields = errorInfo.errorFields.map(field => field.name[0]);
    const fieldMessages = missingFields.map(field => {
      switch (field) {
        case "name":
          return "nombre";
        case "lastname":
          return "apellido";
        case "email":
          return "correo";
        case "password":
          return "contraseña";
        case "password2":
          return "confirmación de contraseña";
        default:
          return field;
      }
    });

    // Verificar si las contraseñas no coinciden
    const passwords = form.getFieldsValue(["password", "password2"]);
    if (passwords.password && passwords.password2 && passwords.password !== passwords.password2) {
      setMessages(["Parece que las contraseñas no coinciden, revisalas."]);
      setAvatarName("Ups!");
      setExpressions(["confundido"]);
    } else {
      // Verificar si algún campo requerido está faltando
      if (passwords.password) {
        const passwordStrengthPassed = checkPasswordStrength(passwords.password);
        if (!passwordStrengthPassed) {
          // Mostrar mensajes de error de contraseña inválida
          setMessages([
            "Una buena contraseña debe cumplir con:",
            "1. Debe incluir letras y números.",
            "2. Debe combinar letras mayúsculas y minúsculas.",
            "3. La contraseña debe incluir caracteres especiales.",
            "4. La longitud de la contraseña debe ser igual o mayor a 8 caracteres.",
            "5. No debe tener espacios en blanco."
          ]);
          setAvatarName("Debes mejorar tu contraseña");
          setExpressions(["pensando", "informando", "normal"]);
          setPassChecked(false);
        } else {
          setPassChecked(true);
        }
      } else {
        // Mostrar mensajes de campos faltantes
        setMessages([`Hacen falta algunos campos: ${fieldMessages.join(", ")}`]);
        setAvatarName("Oh no!");
        setExpressions(["pensando", "normal"]);
      }
    }
  };

  return (
    <>
      {/* Botón para regresar */}
      <Button type="third" href="/select-avatar">
        Regresar
      </Button>
      <div className="home">
        {/* Título del formulario */}
        <h4>Únete a la senda ninja de la ciberseguridad.</h4>
        {/* Componente de Avatar con discurso */}
        <AvatarSpeech
          name={avatarName}
          messages={messages}
          expressions={expressions}
        />
        {/* Formulario de registro */}
        <Form
          form={form}
          name="register-form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="lastname"
            rules={[{ required: true, message: "Por favor ingresa tu apellido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo"
            name="email"
            rules={[{ required: true, message: "Por favor ingresa tu correo" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmar Contraseña"
            name="password2"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: "Por favor confirma tu contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {/* Botón de envío */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Registrarse
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;
