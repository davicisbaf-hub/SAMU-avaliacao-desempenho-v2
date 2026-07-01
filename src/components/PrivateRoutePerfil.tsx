import { Navigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoutePerfil({ children }: Props) {
  const { user } = useUserSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const permitido = [
    "Administrador",
    "🔑 Administrador — Todas as bases",
  ].includes(user.perfil);

  if (!permitido) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
