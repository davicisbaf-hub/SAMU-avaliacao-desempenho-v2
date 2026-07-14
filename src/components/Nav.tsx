import { NavLink, useNavigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";


import { 
    ChartPie, 
    Download,
    MonitorCog 
} 

from "lucide-react";
type Ficha = {
    nome: string;
    link: string;
    icon: string;
};

type Base = {
  id: number;
  nome: string;
  cor: string;
};


export default function Nav() {

    const navigate = useNavigate();
    const { logout } = useUserSession();
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const [baseSelecionada, setBaseSelecionada] = useState("");
    const [base, setBase] = useState<Base[]>([]);
    const { login, user, isLoading } = useUserSession();

    useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    const fichasVisiveis =
    user?.perfil === "Usuario"
        ? fichas.filter(
            (ficha) =>
                ficha.nome === user.funcao ||
                ficha.nome === "Liderado > Liderança" ||
                ficha.nome === "Simulação bp-TEAM" ||
                ficha.nome === "Avaliação dos Pares"

        )
        : user?.perfil === "Administrador"
        ? fichas.filter(
            (ficha) =>
            ficha.nome === user.funcao ||
            ficha.nome === "Simulação bp-TEAM" ||
            ficha.nome === "Avaliação dos Pares" ||
            ficha.nome === "Liderança > Liderado"
        )
        : fichas;

    

    // dentro do componente, antes do useEffect:
    const { authFetch } = useAuthFetch();

    useEffect(() => {
        authFetch("/api/fichas")
            .then((res) => res.json())
            .then((data) => setFichas(data));
    }, []);

    const handleLogin = async (baseNome?: string) => {
        const baseParaLogar = baseNome || baseSelecionada;

        if (!baseParaLogar) {
            console.log("Selecione uma base");
            return;
        }
        
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cpf: user?.cpf,
                    base: baseParaLogar
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro ao fazer login");
                return;
            }

            login(data, data.token);
            navigate("/");

        } catch (error) {
            console.error(error);
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
        
        <aside className="bg-[#0a1a30] lg:flex w-64 flex-col text-white shrink-0 border-r border-sidebar-border">
            <div className="flex flex-col h-full">

                <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
                    <div className="w-10 h-10 rounded-xl bg-[#cd0048] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">192</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-tight">SAMU 192</p>
                        <p className="60 text-xs">CRUR-BF / CISBAF</p>
                    </div>
                </div>

                <div className="px-4 py-3 border-b border-sidebar-border">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <select
                            value={baseSelecionada}
                            onChange={(e) => {
                                setBaseSelecionada(e.target.value);
                                // Login automático ao escolher
                                handleLogin(e.target.value);
                            }}
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
                    </div>
                </div>

                <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2 space-y-0.5 text-left">
                    <NavLink to="/" 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isActive
                                ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                : "70 hover:bg-[#cd0048]/20"
                        }`
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                        Inicio
                    </NavLink>
                    
                    {user?.perfil !== "Usuario" && (
                        <NavLink to="/painel-kpis" className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                    : "70 hover:bg-[#cd0048]/20"
                            }`
                        }>
                            <ChartPie />
                            Painel de KPIs
                        </NavLink>
                    )}

                    {user?.perfil !== "Usuario" && (
                        <NavLink to="/baixarFicha" className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                    : "70 hover:bg-[#cd0048]/20"
                            }`
                        }>
                            <Download /> Baixar Fichas (PDF)
                        </NavLink>
                    )}
                    <NavLink to="/instrucao" />
                    <NavLink to="/ajuda"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                            : "70 hover:bg-[#cd0048]/20"
                        }`
                      }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>
                      Ajuda
                    </NavLink>
                    <NavLink to="/instrucao"
                    
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isActive
                                ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                : "70 hover:bg-[#cd0048]/20"
                        }`
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                        Como Avaliar
                    </NavLink>
                    

                    <div className='pt-3 pb-1'>
                        <p className='px-3 text-[12px] font-semibold 40 uppercase tracking-wider mb-1'>
                            Fichas de Avaliação
                        </p>
                        {fichasVisiveis.map((ficha) => (
                            <NavLink
                                key={ficha.nome}
                                to={ficha.link}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 ${
                                        isActive
                                            ? "bg-[#cd0048]/20 text-[#cd0048]"
                                            : "70 hover:bg-[#cd0048]/20"
                                    }`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6"></path>
                                </svg>
                                {ficha.icon} {ficha.nome}
                            </NavLink>
                        ))}
                        
                    </div>

                    <div className='pt-3 pb-1'>
                        <p className='px-3 text-[12px] font-semibold 40 uppercase tracking-wider mb-1'>
                            Ferramentas
                        </p>
                        <NavLink to="/Autoavaliacao" 
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                    : "70 hover:bg-[#cd0048]/20"
                            }`
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                            Autoavaliação
                        </NavLink>

                        {user?.perfil !== "Usuario" && (
                            <NavLink to="/plano-desenvolvimento" 
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                            : "70 hover:bg-[#cd0048]/20"
                                    }`
                                }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
                                Plano de Desenvolvimento
                            </NavLink>
                        )}

                        {user?.perfil !== "Usuario" && (
                            <NavLink to="/cadastro" 
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                            : "70 hover:bg-[#cd0048]/20"
                                    }`
                                }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                Cadastro de Profissionais
                            </NavLink>
                        )}
                        
                        {user?.perfil !== "Usuario" && user?.perfil !== "Administrador" && (
                            <NavLink to="/configuracoes" 
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#cd0048]/20 text-[#cd0048] border-l-4 border-[#cd0048]"
                                            : "70 hover:bg-[#cd0048]/20"
                                    }`
                                }>
                                <MonitorCog />
                                Configurações
                            </NavLink>
                        )}
                    </div>
                </nav>
                <div className='px-4 py-3 border-t border-sidebar-border'>
                    <button onClick={handleLogout} className='w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium 60 hover:bg-destructive/20 hover:text-destructive transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                        Sair
                    </button>
                    <p className='30 text-[10px] mt-2 leading-relaxed px-1'>bp-TEAM · NTS · Portaria MS 2.048/2002</p>
                </div>
            </div>
        </aside>
    )
}