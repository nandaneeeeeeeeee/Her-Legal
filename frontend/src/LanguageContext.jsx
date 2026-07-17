import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    navbar: {
      home: "Home",
      aiChat: "AI Chat",
      solutions: "Solutions",
      resources: "Resources",
      news: "News",
      about: "About",
      contact: "Contact",
      startFree: "Start Free",
      login: "Login",
      logout: "Logout",
      search: "Search",
      selectLanguage: "Language",
    },
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create account",
      signInDesc: "Sign in to save your conversations.",
      joinDesc: "Join Her Legal anonymously.",
      username: "Username",
      email: "Email",
      phone: "Phone",
      password: "Password",
      pleaseWait: "Please wait...",
      signIn: "Sign In",
      createAccountBtn: "Create Account",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      signUp: "Sign up",
      signInAction: "Sign in",
    },
    footer: {
      platform: "Platform",
      company: "Company",
      support: "Support",
      aiAssistant: "AI Assistant",
      legalTopics: "Legal Topics",
      documents: "Documents",
      knowledgeHub: "Knowledge Hub",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      helpline: "Helpline",
      faq: "FAQ",
      safety: "Safety",
      rightsReserved: "All rights reserved.",
      builtWith: "Built with ❤️ for every woman in Nepal",
    },
  },
  ne: {
    navbar: {
      home: "गृह",
      aiChat: "एआई कुराकानी",
      solutions: "समाधान",
      resources: "स्रोतहरू",
      news: "समाचार",
      about: "हाम्रोबारे",
      contact: "सम्पर्क",
      startFree: "निशुल्क सुरु गर्नुहोस्",
      login: "लगइन",
      logout: "लगआउट",
      search: "खोज्नुहोस्",
      selectLanguage: "भाषा",
    },
    auth: {
      welcomeBack: "पुन: स्वागत",
      createAccount: "खाता सिर्जना गर्नुहोस्",
      signInDesc: "तपाईंका संवादहरू बचत गर्न साइन इन गर्नुहोस्।",
      joinDesc: "Her Legal मा अनाम रुपमा सामेल हुनुहोस्।",
      username: "प्रयोगकर्ता नाम",
      email: "इमेल",
      phone: "फोन",
      password: "पासवर्ड",
      pleaseWait: "कृपया पर्खनुहोस्...",
      signIn: "साइन इन",
      createAccountBtn: "खाता सिर्जना गर्नुहोस्",
      dontHaveAccount: "खाता छैन?",
      alreadyHaveAccount: "पहिले नै खाता छ?",
      signUp: "साइन अप",
      signInAction: "साइन इन",
    },
    footer: {
      platform: "प्लेटफर्म",
      company: "कम्पनी",
      support: "समर्थन",
      aiAssistant: "एआई सहायक",
      legalTopics: "कानुनी विषयहरू",
      documents: "कागजातहरू",
      knowledgeHub: "ज्ञान हब",
      about: "हाम्रोबारे",
      contact: "सम्पर्क",
      privacy: "गोपनीयता",
      terms: "सर्तहरू",
      helpline: "हेल्पलाइन",
      faq: "FAQ",
      safety: "सुरक्षा",
      rightsReserved: "सबै अधिकार सुरक्षित छन्।",
      builtWith: "नेपालका हरेक महिलाका लागि बनाइयो",
    },
  },
};

const STORAGE_KEY = "herlegal_language";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "ne" ? "ne" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLanguage: setLang,
    t: (key) => {
      const parts = key.split(".");
      return parts.reduce((obj, part) => obj?.[part], translations[lang]) ?? key;
    },
    translations: translations[lang],
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
