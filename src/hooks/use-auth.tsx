import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  validateCredentials,
  createSession,
  getSession,
  clearSession,
  type AuthSession,
} from "@/lib/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  session: AuthSession | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  const login = (username: string, password: string) => {
    if (!validateCredentials(username, password)) {
      return { success: false, error: "Invalid username or password" };
    }
    const newSession = createSession(username);
    setSession(newSession);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  if (!hydrated) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: false, session: null, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: session !== null, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
