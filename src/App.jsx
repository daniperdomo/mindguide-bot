import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaArrowLeft, FaBookOpen, FaBrain, FaCalendarCheck, FaEnvelope, FaQuoteRight } from 'react-icons/fa';
import './App.css';
import { FaHome } from 'react-icons/fa';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Referencia para el final del contenedor de mensajes

  // Configuración de Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const options = [
    { label: "Técnicas de concentración ", icon: <FaBrain /> },
    { label: "Ayuda con Ansiedad y Depresión/Estrés", icon: <FaBookOpen /> },
    { label: "Ayuda diaria", icon: <FaCalendarCheck /> },
    { label: "Organización", icon: <FaCalendarCheck /> },
    { label: "Cartas de motivación", icon: <FaEnvelope /> },
    { label: "Ayuda de problemas Familiares (Desahogo en general)", icon: <FaHome /> }
  ];

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    // Mensaje del usuario
    const newUserMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const prompt = `Eres un psicólogo experto llamado MindGuide. El usuario necesita ayuda con: "${selectedOption.label}". 
      Responde de manera profesional y empática a: "${userInput}". Máximo 100 palabras.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = {
        sender: 'bot',
        text: text
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error con Gemini:", error);
      const errorMessage = {
        sender: 'bot',
        text: "Disculpa, estoy teniendo dificultades. ¿Podrías reformular tu pregunta?"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Desplazar hacia abajo cuando se agreguen nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      <header className="header-container">
        {selectedOption && (
          <button 
            className="back-to-menu-btn"
            onClick={() => {
              setSelectedOption(null);
              setMessages([]);
            }}
            aria-label="Volver al menú"
          >
            <FaArrowLeft /> Volver
          </button>
        )}
        <h1 className="app-title">MindGuide</h1>
      </header>
      
      {!selectedOption ? (
        <main className="options-container">
          <h2>¿En qué necesitas ayuda hoy?</h2>
          <div className="options-grid">
            {options.map((option, index) => (
              <button
                key={index}
                className="option-card"
                onClick={() => setSelectedOption(option)}
              >
                <div className="option-icon">{option.icon}</div>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </main>
      ) : (
        <main className="chat-container">
          <div className="chat-header">
            <h2>{selectedOption.label}</h2>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Pensando...</div>}
            <div ref={messagesEndRef} /> {/* Referencia para el final del contenedor de mensajes */}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading}
              className="send-button"
              aria-label="Enviar mensaje"
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
