import { Navigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({
  children,
}: Props) {
  const { user } = useUserSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function PrivateGlobal({
  children,
}: Props) {
  const { user } = useUserSession();

  if (user?.perfil === "Usuario" || user?.perfil === "Administrador") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}