import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChatbotProvider } from "./ChatbotContext";
import { AuthProvider } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactHelp from "./pages/ContactHelp";
import Team from "./pages/Team";
import Campaigns from "./pages/Campaigns";
import News from "./pages/News";
import Confessions from "./pages/Confessions";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MagicLinkVerify from "./pages/MagicLinkVerify";
import SessionExpired from "./pages/SessionExpired";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

import Community from "./pages/Community";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Documents from "./pages/Documents";
import LegalGlossary from "./pages/LegalGlossary";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsSecurity from "./pages/SettingsSecurity";
import SettingsNotifications from "./pages/SettingsNotifications";

function AppLayout() {
  const location = useLocation();
  const isChat = location.pathname === "/chat" || location.pathname.startsWith("/chat");
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isDashboard = location.pathname.startsWith("/dashboard")
    || location.pathname.startsWith("/onboarding")
    || location.pathname.startsWith("/auth/settings")
    || location.pathname.startsWith("/community")
    || location.pathname.startsWith("/documents")
    || location.pathname.startsWith("/glossary")
    || location.pathname.startsWith("/notifications");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactHelp />} />
        <Route path="/team" element={<Team />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/news" element={<News />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/confessions" element={<Confessions />} />

        {/* Community */}
        <Route path="/community" element={<Community />} />
        <Route path="/community/new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/community/:id" element={<PostDetail />} />

        {/* Documents & Glossary */}
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/glossary" element={<LegalGlossary />} />

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/magic" element={<MagicLinkVerify />} />
        <Route path="/auth/session-expired" element={<SessionExpired />} />

        {/* Settings */}
        <Route path="/auth/settings/profile" element={<ProtectedRoute><SettingsProfile /></ProtectedRoute>} />
        <Route path="/auth/settings/security" element={<ProtectedRoute><SettingsSecurity /></ProtectedRoute>} />
        <Route path="/auth/settings/notifications" element={<ProtectedRoute><SettingsNotifications /></ProtectedRoute>} />

        {/* Dashboard & Onboarding */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isChat && !isAuthPage && !isDashboard && <Footer />}
      {!isChat && !isAuthPage && !isDashboard && <ChatbotWidget />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </LanguageProvider>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;
