import Header from '../components/Header'
import Nav from '../components/Nav'

import { useEffect, useState } from "react";

type Base = {
    id: number;
    nome: string;
    cor: string;
};

export default function CadastroPage() {
    const [bases, setBases] = useState<Base[]>([]);
    const [baseSelecionada, setBaseSelecionada] = useState<Base | null>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [funcao, setFuncao] = useState("");
    const [perfil, setPerfil] = useState("");

    useEffect(() => {
        async function carregarBases() {
            const res = await fetch("http://localhost:3001/api/bases"); // sua rota backend
            const data = await res.json();

            setBases(data);
            setBaseSelecionada(data[0]); // seleciona a primeira automaticamente
        }
        carregarBases();
    }, []);


    const cadastrarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3001/api/usuarios",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                        funcao,
                        perfil
                    }),
                }
            );


            if (!response.ok) {
                return;
            }

            alert("Usuário cadastrado com sucesso!");

            setNome("");
            setEmail("");
            setSenha("");
            setFuncao("");
            setPerfil("");
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar usuário");
        }
    };
    return (
        <div>
            <div className="flex h-screen w-screen bg-white text-black">
                <Nav />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />

                    {/* conteudo */}
                    <div className='custom-scrollbar p-[32px] overflow-y-auto'>


                        <div className="space-y-6">

                            {/* Cabeçalho */}
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    Cadastro de Profissionais
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Registre os profissionais e líderes de cada base.
                                </p>
                            </div>

                            {/* Base */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-semibold text-foreground">Base:</span>

                                <div className="flex flex-wrap gap-2">
                                    {bases.map((base) => (
                                        <button
                                            key={base.id}
                                            onClick={() => setBaseSelecionada(base)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm transition
                            ${baseSelecionada?.id === base.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: base.cor }}
                                            />
                                            {base.nome}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                <button className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all border-border bg-card text-foreground hover:border-primary/30">
                                    <span className="text-xl">🚑</span>
                                    <span className="text-center leading-tight">Condutor</span>
                                    <p className="text-lg font-black text-muted-foreground">0</p>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all border-border bg-card text-foreground hover:border-primary/30">
                                    <span className="text-xl">🚑</span>
                                    <span className="text-center leading-tight">Condutor</span>
                                    <p className="text-lg font-black text-muted-foreground">0</p>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all border-border bg-card text-foreground hover:border-primary/30">
                                    <span className="text-xl">🚑</span>
                                    <span className="text-center leading-tight">Condutor</span>
                                    <p className="text-lg font-black text-muted-foreground">0</p>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all border-border bg-card text-foreground hover:border-primary/30">
                                    <span className="text-xl">🚑</span>
                                    <span className="text-center leading-tight">Condutor</span>
                                    <p className="text-lg font-black text-muted-foreground">0</p>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all border-border bg-card text-foreground hover:border-primary/30">
                                    <span className="text-xl">🚑</span>
                                    <span className="text-center leading-tight">Condutor</span>
                                    <p className="text-lg font-black text-muted-foreground">0</p>
                                </button>
                            </div>

                            {/* Formulário */}
                            <div className="bg-card border border-border rounded-xl overflow-hidden">

                                <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
                                    <h2 className="text-sm font-semibold">
                                        Adicionar Profissional
                                    </h2>
                                </div>

                                <form onSubmit={cadastrarUsuario} className="p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Nome</label>
                                            <input
                                                type="text"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                placeholder="Nome do profissional"
                                                required
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email do profissional"
                                                required
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Senha</label>
                                            <input
                                                type="password"
                                                value={senha}
                                                onChange={(e) => setSenha(e.target.value)}
                                                placeholder="Senha do profissional"
                                                required
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Função</label>
                                            <select
                                                value={funcao}
                                                onChange={(e) => setFuncao(e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                <option value="Administrador">Administrador</option>
                                                <option value="Usuario">Usuário</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Perfil</label>
                                            <select
                                                value={perfil}
                                                onChange={(e) => setPerfil(e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                <option value="Administrador">Administrador</option>
                                                <option value="Usuario">Usuário</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Matrícula</label>
                                            <input
                                                type="text"
                                                placeholder="Opcional"
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>

                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-primary border text-black rounded-lg text-sm"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Lista */}
                            <div className="bg-card border border-border rounded-xl overflow-hidden">

                                <div className="px-5 py-3 border-b border-border bg-muted/30">
                                    <h2 className="text-sm font-semibold">
                                        Profissionais Cadastrados
                                    </h2>
                                </div>

                                <div className="divide-y divide-border">

                                    {/* Item fake */}
                                    <div className="flex items-center justify-between px-5 py-3">
                                        <div>
                                            <p className="text-sm font-semibold">João Silva</p>
                                            <p className="text-xs text-muted-foreground">
                                                Matrícula: 001
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="text-sm px-2 py-1 border rounded">
                                                Editar
                                            </button>
                                            <button className="text-sm px-2 py-1 border rounded text-red-500">
                                                Remover
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Aviso */}
                            <div className="bg-muted/40 rounded-xl p-4 text-xs text-muted-foreground">
                                Os nomes cadastrados aparecem nas fichas de avaliação.
                            </div>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}