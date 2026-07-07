import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";

import "../App.css";


function App() {



  const navigate = useNavigate();
  const { login } = useUserSession();

  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            cpf,
          }),
        }


      );

      const data = await response.json();


      if (!response.ok) {
        alert(data.erro);
        return;
      }

      login(data, data.token);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="login w-[100vw] h-[100vh] bg-[#061c31] text-center flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#cd0048] shadow-lg mb-4">
            <span className="text-white font-black text-2xl">192</span>
          </div>

          <h1 className="text-2xl font-bold text-white mt-4">SAMU 192</h1>

          <p className="text-[#f8f8f8]/70 text-sm mt-1">
            Sistema de Avaliação de Desempenho 360°
          </p>

          <p className="text-[#f8f8f8]/50 text-xs mt-0.5">
            CRUR-BF / CISBAF - Baixada Fluminense
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#cd0048] px-6 py-4">
            <div className="flex items-center gap-2 text-white font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>

              <p>Acesso Restrito por Perfil</p>
            </div>

            <p className="text-[#f8f8f8]/70 text-sm mt-1 text-left">
              Coordenação/Admin: acesso ao painel completo.
            </p>

            <p className="text-[#f8f8f8]/70 text-sm mt-1 text-left">
              Profissional: apenas autoavaliação.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4" >

            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-black">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail..."
                className="w-full border border-input bg-[#fcfcfc] rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-black">
                CPF
              </label>

              <input
                type="password"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite sua cpf..."
                className="w-full border border-input bg-[#fcfcfc] rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#cd0048] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>

              Entrar
            </button>
          </form>
        </div>

        <p className="text-[#f8f8f8]/70 text-sm mt-4">
          SAMU 192 · CRUR-BF · CISBAF · Baixada Fluminense – RJ
        </p>
      </div>
    </div>
  );
}

export default App;