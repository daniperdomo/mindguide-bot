export default function BotOptions({ onSelect }) {
  const options = [
    "Técnicas de concentración",
    "Técnicas para estudiar",
    "Ayuda diaria",
    "Organización",
    "Cartas de motivación",
    "Frases"
  ];

  return (
    <div className="options-grid">
      {options.map((option) => (
        <button 
          key={option} 
          onClick={() => onSelect(option)}
          className="option-btn"
        >
          {option}
        </button>
      ))}
    </div>
  );
}