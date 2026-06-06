import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type User = {
  id: number;
  nome: string;
  email: string;
  perfil: "admin" | "profissional";
};

type UserSessionType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const UserSession = createContext<UserSessionType | null>(null);

export function UserSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      return JSON.parse(saved);
    }

    return null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserSession.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </UserSession.Provider>
  );
}

export function useUserSession() {
  const context = useContext(UserSession);

  if (!context) {
    throw new Error(
      "useUserSession deve ser usado dentro de UserSessionProvider"
    );
  }

  return context;
}