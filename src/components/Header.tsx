import { useUserSession } from "../contexts/UserSession";
import { useState, useEffect } from "react";
import { Menu } from 'lucide-react';
import { NavLink, useNavigate } from "react-router";
import { useAuthFetch } from "../hooks/useAuthFetch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

type Base = {
    id: number;
    nome: string;
    cor: string;
}

type Ficha = {
    nome: string;
    link: string;
    icon: string;
};

export default function Header() {
    const navigate = useNavigate();
    const [bases, setBases] = useState<Base[]>([]);
    const { user, logout } = useUserSession();
    const [fichas, setFichas] = useState<Ficha[]>([]);

   


    const { authFetch } = useAuthFetch();

    useEffect(() => {
        authFetch("/api/bases")
            .then(res => res.json())
            .then(setBases);
    }, []);

    useEffect(() => {
        authFetch("/api/fichas")
            .then((res) => res.json())
            .then((data) => setFichas(data));
    }, []);

    const baseUsuario = bases.find(base => base.nome === user?.base);

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
                    ficha.nome === "Simulação bp-TEAM"
            )
            : user?.perfil === "Administrador"
                ? fichas.filter(
                    (ficha) =>
                        ficha.nome === user.funcao ||
                        ficha.nome === "Simulação bp-TEAM" ||
                        ficha.nome === "Liderança > Liderado"
                )
                : fichas;

    return (
        <header className='shrink-0 h-14 border-b border-border bg-[#fcfcfc]/95 flex items-center gap-4 px-4'>
            <div className="menu-div">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2">
                            <Menu />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">

                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <NavLink to="/">🏠 Início</NavLink>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <NavLink to="/instrucao">📖 Como Avaliar</NavLink>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Fichas de Avaliação</DropdownMenuLabel>

                        <DropdownMenuSub>
                            <DropdownMenuGroup>
                                {fichasVisiveis.map((ficha) => (
                                    <DropdownMenuItem key={ficha.nome} asChild>
                                        <NavLink to={ficha.link}>
                                            {ficha.icon} {ficha.nome}
                                        </NavLink>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuSub>

                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <NavLink to="/Autoavaliacao">
                                    ⭐ Autoavaliação / bp-TEAM
                                </NavLink>

                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {user?.perfil !== "Usuario" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Ferramentas</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <NavLink to="/painel-kpis">
                                            📊 KPIs
                                        </NavLink>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <NavLink to="/plano-desenvolvimento">
                                            📋 Plano de Desenvolvimento
                                        </NavLink>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <NavLink to="/cadastro">
                                            👥 Cadastro
                                        </NavLink>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <NavLink to="/configuracoes">
                                            ⚙️ Configurações
                                        </NavLink>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={handleLogout}
                            >
                                🚪 Sair
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='flex items-center gap-2 text-sm [text-#555f69] truncate'>
                <span className='font-semibold text-[#080c0f]'>Avaliação de Desempenho</span>
                <span className='hidden sm:inline'>·</span>
                <span className='hidden sm:inline'>Equipe SAMU 192</span>
            </div>

            <div className='ml-auto flex items-center gap-2'>
                {user?.base && (
                    <span
                        className="base-header hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                        style={{ backgroundColor: `${baseUsuario?.cor}20`, color: baseUsuario?.cor }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: `${baseUsuario?.cor}` }}></span>
                        {user?.base}
                    </span>
                )}

                <span className='nome-header hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/10 text-black text-xs font-medium'>
                    {user?.nome} - {user?.funcao}
                </span>
                <span className='perfil-header hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cd0048]/10 text-[#cd0048] text-xs font-medium'>
                    {user?.perfil}
                </span>
                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cd0048]/10 text-[#cd0048] text-xs font-medium'>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cd0048] animate-pulse"></span>
                    360°
                </span>
            </div>
        </header>
    )
}