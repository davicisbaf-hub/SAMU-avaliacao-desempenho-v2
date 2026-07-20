import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
} from "lucide-react";

export default function Reset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { user, logout } = useUserSession();

  // Validação de força da senha
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!newPassword) {
      setError("Digite a nova senha.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/usuarios/resetSenha/${user?.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senha: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.erro || "Erro ao alterar senha");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");

      // Logout após 3 segundos para forçar login com nova senha
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error(error);
      setError("Erro ao conectar ao servidor");
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    return {
      label: labels[passwordStrength - 1] || "",
      color: colors[passwordStrength - 1] || "bg-gray-300",
      width: `${(passwordStrength / 5) * 100}%`,
    };
  };

  const strengthInfo = getPasswordStrengthLabel();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-[#061c31]">
      <div className="w-full max-w-md">      

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#cd0048] shadow-lg mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Alterar Senha</h1>
          <p className="text-slate-400 text-sm mt-1">
            Mantenha sua conta segura
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Info banner */}
          <div className="bg-[#cd0048] px-6 py-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-white" />
              <p className="text-white font-medium text-sm">
                {user?.nome || "Usuário"} - Alteração de senha
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nova senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  placeholder="Digite a nova senha"
                  className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Indicador de força da senha */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                      style={{ width: strengthInfo.width }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Força: {strengthInfo.label}
                  </p>
                  <ul className="text-xs text-slate-400 space-y-0.5 mt-1">
                    <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                      • {newPassword.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                    </li>
                    <li className={newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/) ? "text-green-600" : ""}>
                      • {newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/) ? "✓" : "○"} Letras maiúsculas e minúsculas
                    </li>
                    <li className={newPassword.match(/[0-9]/) ? "text-green-600" : ""}>
                      • {newPassword.match(/[0-9]/) ? "✓" : "○"} Números
                    </li>
                    <li className={newPassword.match(/[^a-zA-Z0-9]/) ? "text-green-600" : ""}>
                      • {newPassword.match(/[^a-zA-Z0-9]/) ? "✓" : "○"} Caracteres especiais
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a nova senha novamente"
                  className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cd0048]/60 ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  As senhas não coincidem
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Senhas coincidem
                </p>
              )}
            </div>

            {/* Mensagens de erro/sucesso */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Senha alterada com sucesso!
                  </p>
                  <p className="text-xs text-green-500 mt-0.5">
                    Você será redirecionado para o login em instantes...
                  </p>
                </div>
              </div>
            )}

            {/* Botão submit */}
            <button
              type="submit"
              disabled={submitting || success}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#cd0048] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Key size={16} />
              {submitting ? "Alterando..." : "Alterar Senha"}
            </button>

            {/* Informação adicional */}
            <p className="text-xs text-center text-slate-400 border-t border-slate-200 pt-3">
              Para sua segurança, você será desconectado após alterar a senha
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}