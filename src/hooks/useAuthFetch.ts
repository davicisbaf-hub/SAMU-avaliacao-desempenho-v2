import { useUserSession } from "../contexts/UserSession";
import { useNavigate } from "react-router";

export function useAuthFetch() {
  const { token, logout } = useUserSession();
  const navigate = useNavigate();

  async function authFetch(input: string, init?: RequestInit): Promise<Response> {
    const res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    if (res.status === 401) {
      logout();
      navigate("/login");
    }

    return res;
  }

  return { authFetch };
}