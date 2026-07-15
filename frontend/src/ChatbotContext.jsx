import { createContext, useContext, useState } from "react";

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <ChatbotContext.Provider value={{ open, setOpen }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  return useContext(ChatbotContext);
}