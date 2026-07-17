import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "./api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("herlegal_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore corrupt data */ }
    }
    setLoading(false);
  }, []);

  const saveUser = useCallback((userData) => {
    localStorage.setItem("herlegal_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem("herlegal_user");
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,

    login: async (email, password) => {
      const data = await authApi.login(email, password);
      const userData = {
        ...data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
      saveUser(userData);
      return data;
    },

    register: async (userData) => {
      const data = await authApi.register(userData);
      const userDataSaved = {
        ...data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
      saveUser(userDataSaved);
      return data;
    },

    googleLogin: async (idToken) => {
      const data = await authApi.googleAuth(idToken);
      const userData = {
        ...data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
      saveUser(userData);
      return { ...data, isNewUser: data.data.isNewUser };
    },

    sendMagicLink: async (email) => {
      return authApi.sendMagicLink(email);
    },

    verifyMagicLink: async (token) => {
      const data = await authApi.verifyMagicLink(token);
      const userData = {
        ...data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
      saveUser(userData);
      return { ...data, isNewUser: data.data.isNewUser };
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch { /* ignore server errors */ }
      clearUser();
    },

    updateUser: (updates) => {
      setUser(prev => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };
        localStorage.setItem("herlegal_user", JSON.stringify(updated));
        return updated;
      });
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
