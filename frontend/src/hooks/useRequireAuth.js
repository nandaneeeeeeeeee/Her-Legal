import { useState } from "react";
import { useAuth } from "../AuthContext";

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [showAuthReq, setShowAuthReq] = useState(false);
  const [authAction, setAuthAction] = useState("default");

  const requireAuth = (action = "default") => {
    if (!isAuthenticated) {
      setAuthAction(action);
      setShowAuthReq(true);
      return false;
    }
    return true;
  };

  return {
    requireAuth,
    showAuthReq,
    authAction,
    closeAuthReq: () => setShowAuthReq(false),
  };
}
