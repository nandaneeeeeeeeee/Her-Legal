import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotProvider } from "./ChatbotContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactHelp from "./pages/ContactHelp";
import Team from "./pages/Team";
import Campaigns from "./pages/Campaigns";
import News from "./pages/News";
import Confessions from "./pages/Confessions";

function App() {
  return (
    <ChatbotProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactHelp />} />
          <Route path="/team" element={<Team />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/news" element={<News />} />
          <Route path="/confessions" element={<Confessions />} />
        </Routes>
        <Footer />
        <ChatbotWidget />
      </BrowserRouter>
    </ChatbotProvider>
  );
}

export default App;