import React, { useState, useEffect } from "react";
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './constants';
import AvatarSpeech from "../components/AvatarSpeech";

function Verify() {
    const navigate = useNavigate();
    const [digit1, setDigit1] = useState('');
    const [digit2, setDigit2] = useState('');
    const [digit3, setDigit3] = useState('');
    const [digit4, setDigit4] = useState('');

    const initialMessages = [
        "Verifica el correo electrónico con el que te registraste!",
        "Debe llegarte un pin de 4 dígitos",
        "Suerte",
    ];

    const initialExpressions = [
        "normal",
        "pensando-nube",
        "felicitando",
        "triste",
        "informando",
        // Añade más nombres de expresiones según sea necesario
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [avatarName, setAvatarName] = useState("Mayrax");
    const [expressions, setExpressions] = useState(initialExpressions);
    const [form] = Form.useForm();

    console.log(API_URL);

    useEffect(() => {
        const avatarType = localStorage.getItem("avatarType");
        if (avatarType === "chico") {
            setAvatarName("Nell");
        } else if (avatarType === "chica") {
            setAvatarName("Mayrax");
        } else {
            setAvatarName("");
        }
    }, []);

    const handleVerify = async (values) => {
        try {
            const token_2FA = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`;
            const response = await axios.post(`${API_URL}/verify-2fa`, {
                correo: localStorage.getItem('correo'),
                token_2FA,
            });
            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                navigate('/dashboard');
            } else {
                console.error('Error en la verificación en dos pasos: Estado no esperado:', response.status);
                setMessages(["Código incorrecto. Intenta nuevamente."]);
                setAvatarName("Ups!");
                setExpressions(["confundido"]);
            }
        } catch (error) {
            console.error('Error en la verificación en dos pasos:', error);
            setMessages(["Código incorrecto o ha ocurrido un error. Intenta nuevamente."]);
            setAvatarName("Oh no!");
            setExpressions(["triste"]);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        const missingFields = errorInfo.errorFields.map(field => field.name[0]);
        const fieldMessages = missingFields.map(field => {
            switch (field) {
                case "digit1":
                case "digit2":
                case "digit3":
                case "digit4":
                    return `dígito ${field.charAt(field.length - 1)}`;
                default:
                    return field;
            }
        });
        setMessages([`Hacen falta algunos campos: ${fieldMessages.join(", ")}`]);
        setAvatarName("Oh no!");
        setExpressions(["pensando", "normal"]);
    };

    const handlePaste = (event) => {
        const pasteData = event.clipboardData.getData('text');
        if (pasteData.length === 4) {
            event.preventDefault();
            const digits = pasteData.split('');
            setDigit1(digits[0]);
            setDigit2(digits[1]);
            setDigit3(digits[2]);
            setDigit4(digits[3]);
            form.setFieldsValue({
                digit1: digits[0],
                digit2: digits[1],
                digit3: digits[2],
                digit4: digits[3],
            });
        }
    };

    return (
        <div className="verify-container">
            <h3>Verificación en dos pasos</h3>
            <p>Introduce el código de verificación que has recibido.</p>
            <Form name="verify-form" layout="vertical" onFinish={handleVerify} onFinishFailed={onFinishFailed} form={form}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Form.Item name="digit1" rules={[{ required: true, message: 'Ingresa el dígito' }]} style={{ flex: 1 }}>
                        <Input maxLength={1} value={digit1} onChange={(e) => setDigit1(e.target.value)} onPaste={handlePaste} />
                    </Form.Item>
                    <Form.Item name="digit2" rules={[{ required: true, message: 'Ingresa el dígito' }]} style={{ flex: 1 }}>
                        <Input maxLength={1} value={digit2} onChange={(e) => setDigit2(e.target.value)} />
                    </Form.Item>
                    <Form.Item name="digit3" rules={[{ required: true, message: 'Ingresa el dígito' }]} style={{ flex: 1 }}>
                        <Input maxLength={1} value={digit3} onChange={(e) => setDigit3(e.target.value)} />
                    </Form.Item>
                    <Form.Item name="digit4" rules={[{ required: true, message: 'Ingresa el dígito' }]} style={{ flex: 1 }}>
                        <Input maxLength={1} value={digit4} onChange={(e) => setDigit4(e.target.value)} />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Verificar</Button>
                </Form.Item>
            </Form>
            <AvatarSpeech
                name={avatarName}
                messages={messages}
                expressions={expressions}
            />
        </div>
    );
}

export default Verify;
