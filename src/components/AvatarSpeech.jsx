import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/AvatarSpeech.css";

const AvatarSpeech = ({ name, messages, expressions }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);
    const [showBubble, setShowBubble] = useState(true);

    const avatarType = localStorage.getItem('avatarType'); // Obtener el tipo de avatar desde localStorage

    // Definir las imágenes según el tipo de avatar
    const chicaImages = {
        normal: "/avatar/chica/normal.png",
        pensando: "/avatar/chica/pensando.png",
        pensandoNube: "/avatar/chica/pensando-nube.png",
        informando: "/avatar/chica/informando.png",
        triste: "/avatar/chica/triste.png",
        feliz: "/avatar/chica/feliz.png",
        incorrecto: "/avatar/chica/incorrecto.png",
        correcto: "/avatar/chica/correcto.png",
        felicitando: "/avatar/chica/felicitando.png",
        confundido: "/avatar/chica/confundido.png"
    };

    const chicoImages = {
        normal: "/avatar/chico/normal.png",
        pensando: "/avatar/chico/pensando.png",
        pensandoNube: "/avatar/chico/pensando-nube.png",
        informando: "/avatar/chico/informando.png",
        triste: "/avatar/chico/triste.png",
        feliz: "/avatar/chico/feliz.png",
        incorrecto: "/avatar/chico/incorrecto.png",
        correcto: "/avatar/chico/correcto.png",
        felicitando: "/avatar/chico/felicitando.png",
        confundido: "/avatar/chico/confundido.png"
    };

    useEffect(() => {
        setCurrentMessageIndex(0);
        setCurrentExpressionIndex(0);
        setShowBubble(true);
    }, [messages]);

    const advanceMessage = () => {
        if (currentMessageIndex < messages.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1);
            setCurrentExpressionIndex((prevIndex) =>
                (prevIndex + 1) % expressions.length
            );
        } else {
            setShowBubble(false);
        }
    };

    const getExpression = () => {
        const expressionKey = expressions[currentExpressionIndex];
        if (avatarType === 'chica' && chicaImages.hasOwnProperty(expressionKey)) {
            return chicaImages[expressionKey];
        } else if (avatarType === 'chico' && chicoImages.hasOwnProperty(expressionKey)) {
            return chicoImages[expressionKey];
        }
        // Si no se encuentra la expresión o el tipo de avatar no es válido, retornar una imagen por defecto
        return `/avatar/${avatarType}/normal.png`; // Cambia esto por la imagen que quieras mostrar por defecto
    };

    return (
        <div className="avatar-speech-container" onClick={advanceMessage}>
            {showBubble && (
                <div className="speech-bubble">
                    <p className="avatar-name">{name}</p>
                    <p className="avatar-text">{messages[currentMessageIndex]}</p>
                </div>
            )}
            <img className="avatar-image" src={getExpression()} alt={name} />
        </div>
    );
};

AvatarSpeech.propTypes = {
    name: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.string).isRequired,
    expressions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AvatarSpeech;
