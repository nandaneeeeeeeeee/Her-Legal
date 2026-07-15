import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChatbotProvider } from "./ChatbotContext";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactHelp from "./pages/ContactHelp";
import Team from "./pages/Team";
import Campaigns from "./pages/Campaigns";
import News from "./pages/News";
import Confessions from "./pages/Confessions";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

function AppLayout() {
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const isChat = location.pathname === "/chat";

  return (
    <>
      <Navbar onLoginClick={() => setShowAuth(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactHelp />} />
        <Route path="/team" element={<Team />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/news" element={<News />} />
        <Route path="/confessions" element={<Confessions />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isChat && <Footer />}
      {!isChat && <ChatbotWidget />}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;
