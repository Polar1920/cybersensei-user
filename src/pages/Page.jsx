import React, { useEffect, useState } from 'react';
import { Divider, Radio, Button } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../components/Menu';
import '../styles/Page.css'; // Asegúrate de tener estilos adecuados en Page.css
import axios from 'axios';
import AvatarSpeech from "../components/AvatarSpeech";
import { API_URL } from './constants';
import { useParams } from 'react-router-dom';

const Page = () => {
  const { pageId } = useParams();
  const [pageData, setPageData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Estado para respuesta seleccionada
  const [quizResponses, setQuizResponses] = useState({}); // Estado para almacenar respuestas

  const initialMessages = [
    "Esta es una prueba de la senda, con información que ya aprendiste en el camino",
    "Demuestra que eres un ninja!",
    "Piensa sabiamente tu respuesta",
  ];

  const initialExpressions = [
    "informando",
    "feliz",
    "pensandoNube",
    "pensando",
    "pensando-nube",
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [avatarName, setAvatarName] = useState("Mayrax");
  const [expressions, setExpressions] = useState(initialExpressions);

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

    // Obtener userData desde localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Cargar datos de la página desde la API
    const fetchPageData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/paginas/${pageId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPageData(response.data);

        // Marcar la página como completada al cargar (si aún no está marcada)
        const storedProgress = JSON.parse(localStorage.getItem("progress")) || {};
        const moduleProgress = storedProgress[response.data.modulo_id]?.pages || {};
        if (!moduleProgress[pageId]?.checked) {
          // Mostrar notificación de experiencia ganada
          setTimeout(() => {
            toast.success("¡Felicidades! EXP + 100", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }, 1000); // Puedes ajustar el tiempo según sea necesario

          moduleProgress[pageId] = { checked: true };
          storedProgress[response.data.modulo_id] = { pages: moduleProgress };

          // Actualizar el exp
          if (!storedProgress.exp) {
            storedProgress.exp = 0;
          }
          storedProgress.exp += 100;

          localStorage.setItem("progress", JSON.stringify(storedProgress));
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, [pageId]); // Agregar pageId como dependencia para que se recargue al cambiar la página

  if (!pageData) {
    return <div>Cargando página...</div>;
  }

  const { nombre, tipo, contenido0, contenido1, contenido2 } = pageData;

  let contenidoMostrado;
  switch (userData?.tipo) {
    case 'niño':
      contenidoMostrado = contenido0;
      break;
    case 'joven':
      contenidoMostrado = contenido1;
      break;
    case 'adulto':
      contenidoMostrado = contenido2;
      break;
    default:
      contenidoMostrado = 'Contenido no disponible para este usuario.';
  }

  const handleAnswerSubmit = async () => {
    let pregunta = '';
    let respuestas = [];

    // Recorre las partes de contenidoMostrado para obtener la pregunta y todas las respuestas
    contenidoMostrado.split('|').forEach(preguntaRespuesta => {
      const [tipo, contenido] = preguntaRespuesta.split(':');
      if (tipo === 'q') {
        pregunta = contenido.trim(); // Obtén el texto de la pregunta
      } else if (tipo === 'a') {
        respuestas.push(contenido.trim()); // Obtén todas las respuestas
      }
    });

    // Guardar la respuesta seleccionada en localStorage
    localStorage.setItem(`quiz_${pageId}`, JSON.stringify({ selectedAnswer }));

    // Verificar si la respuesta seleccionada es correcta
    const respuestaSeleccionadaIndex = parseInt(selectedAnswer.split('a')[1]);
    const respuesta = contenidoMostrado.split('|');
    const esCorrecta = respuesta[selectedAnswer.split('a')[1]].split(',')[1] === "true";

    // Almacenar la respuesta seleccionada y su evaluación
    setQuizResponses({
      ...quizResponses,
      [pageId]: {
        selectedAnswer,
        esCorrecta
      }
    });

    // Mostrar notificación según si es correcta o incorrecta
    if (esCorrecta) {
      toast.success('Excelente! feedback en camino', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setMessages([
        "Respuesta correcta",
        "Al parecer al estudiado",
        "Mmm... quizas estas superando al maestro",
        "... (se pone triste)"
      ]);
      setAvatarName("Waoo!");
      setExpressions(["correcto", "informando", "pensandoNube", "triste"]);
    } else {
      toast.error('Ups! feedback atravesando la senda cibernetica', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setMessages([
        "Respuesta incorrecta",
        "No pasa nada, puedes seguir intentando",
        "Vuelva a responder"
      ]);
      setAvatarName("Ups! fallaste...");
      setExpressions(["incorrecto", "informando", "pensandoNube"]);
    }

    // Enviar la solicitud al modelo de Hugging Face para obtener feedback
    const message = `Por favor, proporciona un feedback breve (no mas de 10 palabras) y amable sobre la siguiente pregunta: "${pregunta}". Mi respuesta fue: "${respuestas[respuestaSeleccionadaIndex - 1]}". ¿Por qué fue ${esCorrecta ? 'correcta' : 'incorrecta'}?`;

    console.log(message);

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Ejemplo de un proxy CORS (no recomendado para producción)

    const formData = new FormData();
    formData.append('message', message);

    try {
      const response = await axios.post(
        `${proxyUrl}https://efriend-api.onrender.com/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Importante especificar el tipo de contenido como formData
            'x-requested-with': 'text/html'
          }
        }
      );

      const feedback = response.data.result.replace("</s>", "").trim();
      console.log('Feedback del modelo:', feedback);

      // Agrega un retraso de 10 segundos antes de mostrar el feedback
      setTimeout(() => {
        setMessages([feedback]);
        setAvatarName("Feedback");
        setExpressions(["informando"]);
      }, 10000); // 10000 milisegundos = 10 segundos
      // Puedes utilizar el feedback según tus necesidades aquí
    } catch (error) {
      console.error('Error al obtener feedback del modelo:', error);
    }
  };

  const contenido = (
    <div>
      <Button type="third" href={`/module/${pageData.modulo_id}`}>
        Regresar
      </Button>
      {/* Componente de Avatar con discurso */}
      <AvatarSpeech
        name={avatarName}
        messages={messages}
        expressions={expressions}
      />
      {tipo === 'informacion' && (
        <>
          <h2>{nombre}</h2>
          <Divider />
          <div className="lesson" dangerouslySetInnerHTML={{ __html: contenidoMostrado }} />
          <Divider />
        </>
      )}

      {tipo === 'quiz' && (
        <>
          <h2>{nombre}</h2>
          <Divider />
          <div className="quiz-content">
            {contenidoMostrado.split('|').map((preguntaRespuesta, index) => {
              const [tipo, contenido] = preguntaRespuesta.split(':');
              if (tipo === 'q') {
                return <h3 key={index}>{contenido}</h3>;
              } else if (tipo === 'a') {
                const [texto, esCorrecta] = contenido.split(',');
                const answerId = `a${index}`; // Generar un ID único para cada respuesta
                return (
                  <Radio
                    key={index}
                    style={{ display: 'block' }}
                    value={answerId}
                    checked={selectedAnswer === answerId}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  >
                    {texto}
                  </Radio>
                );
              }
              return null;
            })}
            {/* Botón para enviar respuesta */}
            <Button type="primary" onClick={handleAnswerSubmit}>Responder</Button>
          </div>
          <Divider />
        </>
      )}
    </div>
  );

  return (
    <>
      {contenido}
      <Menu />
      <ToastContainer /> {/* Agregar ToastContainer aquí */}
    </>
  );
};

export default Page;
