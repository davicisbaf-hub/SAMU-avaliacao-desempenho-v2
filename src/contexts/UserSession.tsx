import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";
type ParItem = { id: number; nome: string; funcao: string };
type User = {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  perfil: string;
  base: string;
  ativo: boolean;
  par?: ParItem[] | string;
  criadoEm: string;
};

type UserSessionType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const UserSession = createContext<UserSessionType | null>(null);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserSession.Provider value={{ user, token, login, logout }}>
      {children}
    </UserSession.Provider>
  );
}

export function useUserSession() {
  const context = useContext(UserSession);

  if (!context) {
    throw new Error("useUserSession deve ser usado dentro de UserSessionProvider");
  }

  return context;
}