export default function BotOptions({ onSelect }) {
  const options = [
    "Técnicas de concentración",
    "Ayuda con Ansiedad y Depresión/Estrés",
    "Ayuda diaria",
    "Organización",
    "Cartas de motivación",
    "Ayuda de problemas Familiares (Desahogo en general)"
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