import { useState } from "react";
import { useChatbot } from "../ChatbotContext";
import "./ChatbotWidget.css";

function ChatbotWidget() {
  const { open, setOpen } = useChatbot();
  const [lang, setLang] = useState("en");

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>👩 Saathi — Here to help</span>
            <button onClick={() => setLang(lang === "en" ? "ne" : "en")}>
              {lang === "en" ? "नेपाली" : "English"}
            </button>
          </div>
          <div className="chatbot-messages">
            <p>{lang === "en"
              ? "Hi, I'm here to help with questions about your rights. Ask me anything."
              : "नमस्ते, म तपाईंको अधिकारसम्बन्धी प्रश्नमा सहयोग गर्न यहाँ छु।"}</p>
          </div>
          <input placeholder={lang === "en" ? "Type your question..." : "आफ्नो प्रश्न लेख्नुहोस्..."} />
        </div>
      )}
      <button className="chatbot-avatar" onClick={() => setOpen(!open)}>
        👋
      </button>
    </div>
  );
}

export default ChatbotWidget;