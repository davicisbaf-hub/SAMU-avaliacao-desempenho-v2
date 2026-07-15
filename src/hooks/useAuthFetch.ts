import { useUserSession } from "../contexts/UserSession";
import { useNavigate } from "react-router";

export function useAuthFetch() {
  const { logout } = useUserSession();
  const navigate = useNavigate();

  async function authFetch(
    input: string,
    init?: RequestInit
  ): Promise<Response> {
    // rely on HttpOnly cookie for auth; include credentials so cookie is sent
    const res = await fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
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
