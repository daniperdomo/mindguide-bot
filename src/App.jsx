import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Configuración de Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const options = [
    "Técnicas de concentración",
    "Técnicas para estudiar",
    "Ayuda diaria",
    "Organización",
    "Cartas de motivación",
    "Frases"
  ];

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    // Mensaje del usuario
    const newUserMessage = { sender: 'user', text: userInput };
    setMessages([...messages, newUserMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const prompt = `Eres un psicólogo experto llamado MindGuide. El usuario necesita ayuda con: "${selectedOption}". 
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

  return (
    <div className="app-container">
      <h1>MindGuide - Asistente Psicológico</h1>
      
      {!selectedOption ? (
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
        <div className="chat-container">
          <button 
            className="back-btn"
            onClick={() => {
              setSelectedOption(null);
              setMessages([]);
            }}
          >
            ←
          </button>
          
          <div className="chat-header">
            <h2>{selectedOption}</h2>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Pensando...</div>}
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
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;