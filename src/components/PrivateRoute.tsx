import { Navigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({
  children,
}: Props) {
  const { user } = useUserSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}