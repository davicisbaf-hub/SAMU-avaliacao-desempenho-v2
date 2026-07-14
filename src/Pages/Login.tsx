import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";


import {
  Shield,
  UserCircle2,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";


type Base = {
  id: number;
  nome: string;
  cor: string;
};


export default function App() {
  const [profile, setProfile] = useState("admin"); // "admin" | "profissional"
  const [base, setBase] = useState<Base[]>([]);
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [baseSelecionada, setBaseSelecionada] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, user, isLoading } = useUserSession();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (profile !== "admin" && !email) {
      setError("Informe seu email.");
      return;
    }
    if (!baseSelecionada) {
      setError("Selecione seu acesso / base de lotação.");
      return;
    }
    if (!cpf) {
      setError("Informe a senha de acesso.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/login/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          cpf,
          base: baseSelecionada
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.erro || "Erro ao fazer login");
        setSubmitting(false);
        return;
      }

      login(data, data.token);
      navigate("/");

    } catch (error) {
      console.error(error);
      setError("Erro ao conectar ao servidor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!baseSelecionada) {
      setError("Selecione seu acesso / base de lotação.");
      return;
    }
    if (!cpf) {
      setError("Informe a senha de acesso.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf,
          base: baseSelecionada
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.erro || "Erro ao fazer login");
        setSubmitting(false);
        return;
      }

      login(data, data.token);
      navigate("/");

    } catch (error) {
      console.error(error);
      setError("Erro ao conectar ao servidor");
    } finally {
      setSubmitting(false);
    }
  };


  const carregar = async (url: string, setter: Function) => {
      try {
          const res = await fetch(url);
          const data = await res.json();
          setter(data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    carregar("/api/bases", setBase);
  }, []);


  return (

    <div className="min-h-screen w-[98.2.9vw] flex items-center justify-center px-4 py-10 bg-[#061c31]">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#cd0048] shadow-lg mb-4">
            <span className="text-white font-black text-2xl">192</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SAMU 192</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sistema de Avaliação de Desempenho 360°
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            CRUR-BF / CISBAF - Baixada Fluminense
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Info banner */}
          <div className="bg-[#cd0048] px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#cd0048]-100" />
              <p className="text-blue-50 font-semibold text-sm">
                Acesso Restrito por Perfil
              </p>
            </div>
            <p className="text-blue-100/80 text-xs mt-1">
              Coordenação/Admin: acesso ao painel completo. Profissional:
              apenas autoavaliação.
            </p>
          </div>

          {/* Profile toggle */}
          <div className="grid grid-cols-2 gap-2 p-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setProfile("admin")}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                profile === "admin"
                  ? "border-[#cd0048] bg-[#cd0048]/5 text-[#cd0048]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#cd0048]/30"
              }`}
            >
              <Shield size={18} />
              <span>Coordenação</span>
              <span className="text-[10px] font-normal opacity-70">
                Painel completo
              </span>
            </button>

            <button
              type="button"
              onClick={() => setProfile("profissional")}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                profile === "profissional"
                  ? "border-[#cd0048] bg-[#cd0048]/5 text-[#cd0048]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#cd0048]/30"
              }`}
            >
              <UserCircle2 size={18} />
              <span>Administradores / Usuarios</span>
              <span className="text-[10px] font-normal opacity-70">
                Usuarios das bases
              </span>
            </button>
          </div>

          {/* Form */}
          {profile !== "admin" ? (
            <form onSubmit={handleLoginEmail} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Acesso / Base de Lotação
                </label>
                <select
                  value={baseSelecionada}
                  onChange={(e) => setBaseSelecionada(e.target.value)}
                  className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60 appearance-none"
                >
                  <option value="">Selecione seu acesso…</option>
                  <optgroup label="── Bases ──">
                    {base.map((base) => (
                      <option key={base.id} value={base.nome} className="text-black">
                        {base.nome}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  CPF
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite a senha…"
                    className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#cd0048] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LogIn size={16} />
                {submitting ? "Entrando…" : "Entrar"}
              </button>
            </form>
          ): (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Acesso / Base de Lotação
                </label>
                <select
                  value={baseSelecionada}
                  onChange={(e) => setBaseSelecionada(e.target.value)}
                  className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60 appearance-none"
                >
                  <option value="">Selecione seu acesso…</option>
                  <optgroup label="── Administração ──">
                    <option value="todas as bases">
                      🔑 Administrador CRUR-BF (todas as bases)
                    </option>
                  </optgroup>
                  <optgroup label="── Bases ──">
                    {base.map((base) => (
                      <option key={base.id} value={base.nome} className="text-black">
                        {base.nome}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite a senha…"
                    className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#cd0048] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LogIn size={16} />
                {submitting ? "Entrando…" : "Entrar"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          SAMU 192 · CRUR-BF · CISBAF · Baixada Fluminense – RJ
        </p>
      </div>
    </div>
  );
}