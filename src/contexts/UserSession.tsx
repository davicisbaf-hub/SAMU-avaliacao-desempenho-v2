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
  isLoading: boolean;
};

const UserSession = createContext<UserSessionType | null>(null);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Na inicialização, tenta recuperar o token do localStorage
  // e valida ele no backend para trazer os dados atualizados do usuário
  useEffect(() => {
    async function inicializar() {
      try {
        const savedToken = localStorage.getItem("token");
        
        if (savedToken) {
          const res = await fetch("/api/me", {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(savedToken);
          } else {
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }
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

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
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