import { useState } from 'react';
import './App.css';

// Configuración inicial del cliente de OpenAI (usa tu API KEY)
import OpenAI from 'openai';  // ✅ Forma correcta para Vite/React

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true, // Solo para desarrollo frontend
});

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Opciones que mostrará el bot inicialmente
  const options = [
    "Técnicas de concentración",
    "Técnicas para estudiar",
    "Ayuda diaria",
    "Organización",
    "Cartas de motivación",
    "Frases"
  ];

  // Función para manejar el envío de mensajes al bot
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Agrega el mensaje del usuario al chat
    const newUserMessage = { sender: 'user', text: userInput };
    setMessages([...messages, newUserMessage]);
    setUserInput('');

    // Configura el prompt para OpenAI según la opción seleccionada
    const prompt = `
      Eres un asistente psicológico llamado MindBot. 
      El usuario ha seleccionado la categoría: "${selectedOption}".
      Responde de manera profesional y empática a lo siguiente: "${userInput}".
      Limita tu respuesta a 100 palabras máximo.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const botMessage = {
        sender: 'bot',
        text: completion.choices[0].message.content
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al llamar a OpenAI:", error);
      const errorMessage = {
        sender: 'bot',
        text: "Lo siento, estoy teniendo problemas técnicos. Por favor intenta nuevamente más tarde."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="app-container">
      <h1>MindBot - Asistente Psicológico</h1>
      
      {!selectedOption ? (
        // Pantalla inicial con opciones
        <div className="options-container">
          <h2>¿En qué necesitas ayuda hoy?</h2>
          <div className="options-grid">
            {options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Pantalla de chat
        <div className="chat-container">
          <h2>{selectedOption}</h2>
          <button 
            className="back-btn"
            onClick={() => {
              setSelectedOption(null);
              setMessages([]);
            }}
          >
            Volver a opciones
          </button>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;