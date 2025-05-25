import { useState } from "react";
import BotOptions from "../components/BotOptions";
import ChatDisplay from "../components/ChatDisplay";

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="app">
      <h1>MindGuide Bot 🤖</h1>
      {!selectedTopic ? (
        <BotOptions onSelect={setSelectedTopic} />
      ) : (
        <ChatDisplay topic={selectedTopic} />
      )}
    </div>
  );
}