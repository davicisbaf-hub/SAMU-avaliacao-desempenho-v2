import { useUserSession } from "../contexts/UserSession";
import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import MenuHamburguer from "./menu-hamburguer";

type Base = {
    id: number;
    nome: string;
    cor: string;
}


export default function Header() {
    const [bases, setBases] = useState<Base[]>([]);
    const { user } = useUserSession();
    
    const { authFetch } = useAuthFetch();

    useEffect(() => {
        authFetch("/api/bases")
            .then(res => res.json())
            .then(setBases);
    }, []);


    const baseUsuario = bases.find(base => base.nome === user?.base);

    return (
        <header className='shrink-0 h-14 border-b border-border bg-[#fcfcfc]/95 flex items-center gap-4 px-4'>
            
            <MenuHamburguer />

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