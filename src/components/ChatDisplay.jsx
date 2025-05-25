import { useState } from "react";

export default function ChatDisplay({ topic }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;

    // Mensaje del usuario
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Respuesta del bot
    const prompt = `Eres un bot de apoyo psicológico. Responde sobre ${topic}: "${input}" en menos de 100 palabras.`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const botMessage = {
      sender: "bot",
      text: completion.choices[0].message.content,
    };
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <p key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pregúntame..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}