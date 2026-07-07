import { useUserSession } from "../contexts/UserSession";
import { useNavigate } from "react-router";

export function useAuthFetch() {
  const { token, logout } = useUserSession();
  const navigate = useNavigate();

  async function authFetch(
    input: string,
    init?: RequestInit
  ): Promise<Response> {
    if (!token) {
      navigate("/login");
      throw new Error("Token não disponível");
    }

    const res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    // Se o token expirou ou é inválido
    if (res.status === 401) {
      logout();
      navigate("/login");
      throw new Error("Token inválido ou expirado");
    }

    return res;
  }

  return { authFetch };
}