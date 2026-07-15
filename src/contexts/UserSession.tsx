import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

type ParItem = { id: number; nome: string; funcao: string };

type User = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  funcao: string;
  perfil: string;
  base: string;
  ativo: boolean;
  par?: ParItem[] | string;
  criadoEm: string;
};

type UserSessionType = {
  user: User | null;
  token?: string | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const UserSession = createContext<UserSessionType | null>(null);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // token is kept server-side as HttpOnly cookie
  const [isLoading, setIsLoading] = useState(true);

  // On init, try to restore session by calling /api/me with credentials
  useEffect(() => {
    async function inicializar() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar sessão:", error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    inicializar();
  }, []);

  const login = (userData: User) => {
    // server sets HttpOnly cookie; just store user in context
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // request server to clear cookie
    fetch("/api/logout", { method: "POST", credentials: "include" }).catch(() => {});
  };

  return (
    <UserSession.Provider value={{ user, token, login, logout, isLoading }}>
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
