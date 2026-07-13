import * as React from "react"
import { NavLink } from "react-router";
import { Menu } from 'lucide-react';
import { useUserSession } from "../contexts/UserSession";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

import {
    CopyIcon,
    FileTextIcon,
    FolderIcon,
    FolderPlusIcon,
    HomeIcon,
    ChartPie ,
    PlusIcon,
    MonitorCog
} from "lucide-react"
import { Button } from "../components/ui/button"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../components/ui/command"


type Ficha = {
    nome: string;
    link: string;
    icon: string;
};

export default function MenuHamburguer() {
    const [open, setOpen] = React.useState(false)
    const { user } = useUserSession();
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const { authFetch } = useAuthFetch();

    
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

    useEffect(() => {
        authFetch("/api/fichas")
            .then((res) => res.json())
            .then((data) => setFichas(data));
    }, []);

    return (
        <div className="menu-div">
                <div className="flex flex-col gap-4">
                    <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
                        <Menu />
                    </Button>
                    <CommandDialog open={open} onOpenChange={setOpen}>
                        <Command>
                            <CommandInput placeholder="Presquisar..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading='Informações'>
                                    <CommandItem><span className="font-bold">Nome:</span>{user?.nome} - {user?.funcao}</CommandItem>
                                    <CommandItem><span className="font-bold">Base:</span>{user?.base}</CommandItem>
                                    <CommandItem><span className="font-bold">Perfil:</span>{user?.perfil}</CommandItem>
                                </CommandGroup>

                                <CommandGroup heading="Inicio">
                                    <CommandItem>
                                        <HomeIcon />
                                        <NavLink to="/" onClick={() => setOpen(false)}>
                                            <span>Inicio</span>
                                        </NavLink>
                                    </CommandItem>

                                    <CommandItem>
                                        <ChartPie  />
                                        <NavLink to="/painel-kpis" onClick={() => setOpen(false)}>
                                            <span>Painel de KPIs</span>
                                        </NavLink>
                                    </CommandItem>
                                    <CommandItem>
                                        <FileTextIcon />
                                        <NavLink to="/ajuda" onClick={() => setOpen(false)}>
                                            <span>Ajuda</span>
                                        </NavLink>
                                    </CommandItem>
                                    <CommandItem>
                                        <FolderIcon />
                                        <NavLink to="/instrucao" onClick={() => setOpen(false)}>
                                            <span>Como Avaliar</span>
                                        </NavLink>
                                    </CommandItem>
                                </CommandGroup>

                                <CommandSeparator />
                                
                                <CommandGroup heading="Ferramentas">
                                    <CommandItem>
                                        <PlusIcon />
                                        <NavLink to="/Autoavaliacao" onClick={() => setOpen(false)}>
                                            <span>Autoavaliação</span>
                                        </NavLink>
                                    </CommandItem>
                                    <CommandItem>
                                        <FolderPlusIcon />
                                        <NavLink to="/plano-desenvolvimento" onClick={() => setOpen(false)}>
                                            <span>Plano de Desenvolvimento</span>
                                        </NavLink>
                                    </CommandItem>
                                    <CommandItem>
                                        <CopyIcon />
                                        <NavLink to="/cadastro" onClick={() => setOpen(false)}>
                                            <span>Cadastro de Profissionais</span>
                                        </NavLink>
                                    </CommandItem>
                                    <CommandItem>
                                        <MonitorCog  />
                                        <NavLink to="/configuracoes" onClick={() => setOpen(false)}>
                                            <span>Configurações</span>
                                        </NavLink>
                                    </CommandItem>

                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Fichas">
                                    {fichasVisiveis.map((ficha) => (
                                        <CommandItem key={ficha.nome}>
                                            <NavLink to={ficha.link} onClick={() => setOpen(false)}>
                                                <span>{ficha.icon} {ficha.nome}</span>
                                            </NavLink>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </CommandDialog>
                </div>
            </div>
    );
}