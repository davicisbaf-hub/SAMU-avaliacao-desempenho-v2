import { useState } from "react";
import {
  Shield,
  UserCircle2,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  ChevronDown,
  MapPin,
} from "lucide-react";

const BASES = [
  { value: "u_sede", label: "Nova Iguaçu" },
  { value: "u_duque", label: "Duque de Caxias" },
  { value: "u_saojoao", label: "S. J. de Meriti" },
  { value: "u_belford", label: "Belford Roxo" },
  { value: "u_queimados", label: "Queimados" },
  { value: "u_nilopolis", label: "Nilópolis" },
  { value: "u_mesquita", label: "Mesquita" },
  { value: "u_seropedica", label: "Seropédica" },
  { value: "u_japeri", label: "Japeri" },
  { value: "u_paracambi", label: "Paracambi" },
  { value: "u_mage", label: "Magé" },
  { value: "u_itaguai", label: "Itaguaí" },
];

export default function Login() {
  const [profile, setProfile] = useState("admin"); // "admin" | "profissional"
  const [base, setBase] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordList, setShowPasswordList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!base) {
      setError("Selecione seu acesso / base de lotação.");
      return;
    }
    if (!password) {
      setError("Informe a senha de acesso.");
      return;
    }

    setSubmitting(true);
    // Placeholder for real authentication call.
    setTimeout(() => {
      setSubmitting(false);
    }, 900);
  };

  return (
    <div className="min-h-screen w-[99vw] flex items-center justify-center px-4 py-10 bg-[#061c31]">
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
            CRUR-BF / CISBAF — Baixada Fluminense
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
              <span>Admin / Coordenação</span>
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
              <span>Profissional</span>
              <span className="text-[10px] font-normal opacity-70">
                Autoavaliação / bp-TEAM
              </span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Acesso / Base de Lotação
              </label>
              <select
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60 appearance-none"
              >
                <option value="">Selecione seu acesso…</option>
                <optgroup label="── Administração ──">
                  <option value="admin">
                    🔑 Administrador CRUR-BF (todas as bases)
                  </option>
                </optgroup>
                <optgroup label="── Coordenações de Base ──">
                  {BASES.map((b) => (
                    <option key={b.value} value={b.value}>
                      📍 {b.label}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

          {/* Collapsible password reference */}
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => setShowPasswordList((v) => !v)}
              className="w-full flex items-center justify-between gap-2 border border-amber-400/60 bg-amber-50 rounded-xl px-4 py-3 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <KeyRound size={15} />
                <span className="font-semibold text-sm">
                  Senhas de Acesso — Todas as Bases
                </span>
              </div>
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  showPasswordList ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPasswordList && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-1.5">
                <p className="text-xs text-amber-800/80 leading-relaxed">
                  Por segurança, as senhas de acesso de cada base não ficam
                  expostas no front-end. Substitua este bloco por uma
                  chamada ao seu serviço de autenticação (ex.: verificação
                  de credenciais no backend) para listar ou validar os
                  acessos por base.
                </p>
                <ul className="text-xs text-amber-700 space-y-1 pt-1">
                  {BASES.map((b) => (
                    <li key={b.value} className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      <span>{b.label}</span>
                      <span className="text-amber-400">— senha sob consulta ao admin</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          SAMU 192 · CRUR-BF · CISBAF · Baixada Fluminense – RJ
        </p>
      </div>
    </div>
  );
}