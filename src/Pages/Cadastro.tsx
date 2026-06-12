import Header from '../components/Header'
import Nav from '../components/Nav'
import { useUserSession } from "../contexts/UserSession";


import { useEffect, useState } from "react";

type Base = {
    id: number;
    nome: string;
    cor: string;
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  funcao: string;
  base: string;
  perfil: string;
  quantidade: number;
};

type Ficha = {
  id: number;
  icon: string;
  nome: string;
  descricao: string;
  criterios: number;
  tags: string[];
  ordem: number;
  link: string;
  ativo: boolean;
  created_at: string;
};


export default function CadastroPage() {
    const { user } = useUserSession();

    const [bases, setBases] = useState<Base[]>([]);
    const [baseSelecionada, setBaseSelecionada] = useState<Base | null>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [base, setBase] = useState("");
    const [senha, setSenha] = useState("");
    const [funcao, setFuncao] = useState("");
    const [perfil, setPerfil] = useState("");
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);   
    
    const isAdminGlobal = user?.perfil === "🔑 Administrador — Todas as bases"; 

    const usuariosFiltrados = isAdminGlobal ? usuarios : usuarios.filter( (u) => u.base === user?.base );
    const basesVisiveis = isAdminGlobal ? bases : bases.filter((base) => base.nome === user?.base);

    async function salvarEdicao() {
        if (!usuarioEditando) return;

        await fetch(
            `http://localhost:46241/api/usuarios/${usuarioEditando.id}`,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome,
                email,
                senha,
                funcao,
                base,
                perfil,
            }),
            }
        );

        setModalAberto(false);
        setUsuarioEditando(null);

        carregarUsuarios();
    }

    useEffect(() => {
        carregarUsuarios();
        }, []);

        async function carregarUsuarios() {
        try {
            const res = await fetch("http://localhost:46241/api/usuarios");
            const data = await res.json();

            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setUsuarios([]);
        }
        }

    useEffect(() => {
        async function carregarBases() {
            const res = await fetch("http://localhost:46241/api/bases"); // sua rota backend
            const data = await res.json();

            setBases(data);
            setBaseSelecionada(data[0]); // seleciona a primeira automaticamente
        }
        carregarBases();
    }, []);

    console.log("User completo:", user);

    const cadastrarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:46241/api/usuarios",
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
                        base,
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
            setBase("");
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar usuário");
        }
    };

    
      const [fichas, setFichas] = useState<Ficha[]>([]);
    
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
        carregar("http://localhost:46241/api/fichas", setFichas);
      }, []);

      async function removerUsuario(id: number) {
        if (!confirm("Deseja inativar este usuário?")) {
            return;
        }

        await fetch(
            `http://localhost:46241/api/usuarios/${id}/inativar`,
            {
            method: "PUT",
            }
        );

        carregarUsuarios();
    }
    function editarUsuario(usuario: Usuario) {
        setUsuarioEditando(usuario);

        setNome(usuario.nome);
        setEmail(usuario.email);
        setFuncao(usuario.funcao);
        setPerfil(usuario.perfil);
        setBase(usuario.base);
        setSenha(usuario.senha);

        setModalAberto(true);
    }
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
                                <p className="[text-#555f69] mt-1 text-sm">
                                    Registre os profissionais e líderes de cada base.
                                </p>
                            </div>

                            {/* Base */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-semibold text-foreground">Base:</span>

                                <div className="flex flex-wrap gap-2">
                                    {basesVisiveis.map((base) => (
                                        <button
                                            key={base.id}
                                            onClick={() => setBaseSelecionada(base)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm transition
                                            ${baseSelecionada?.id === base.id
                                                    ? "bg-[#cd0048] text-[#fcfcfc]"
                                                    : "hover:bg-[#e5ecf1]"
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
                                {fichas.map((ficha) => (
                                    <button
                                        key={ficha.id}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl border"
                                    >
                                        <span >
                                        {ficha.icon}
                                        </span>

                                        <span className="text-[16px]">
                                        {ficha.nome}
                                        </span>

                                        <p className="font-black">
                                            {
                                                usuariosFiltrados.filter(
                                                (u) => u.funcao === ficha.nome
                                                ).length
                                            }
                                        </p>
                                    </button>
                                    ))}
                            </div>

                            {/* Formulário */}
                            <div className="bg-card border border-border rounded-xl overflow-hidden">

                                <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-[#e5ecf1]/30">
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
                                                <option value="Condutor Socorrista">Condutor Socorrista</option>
                                                <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                                                <option value="Enfermeiro">Enfermeiro</option>
                                                <option value="Médico Intervencionista">Médico Intervencionista</option>
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
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Base</label>
                                           <select
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                                value={base}
                                                onChange={(e) => setBase(e.target.value)}
                                                required
                                            >
                                                <option className="text-black" value="">
                                                    Selecione a base...
                                                </option>

                                                {basesVisiveis.map((base) => (
                                                    <option
                                                        key={base.id}
                                                        value={base.id}
                                                        className="text-black"
                                                    >
                                                        {base.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-[#cd0048] border text-black rounded-lg text-sm"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Lista */}
                            <div className="bg-card border border-border rounded-xl overflow-hidden">

                                <div className="px-5 py-3 border-b border-border bg-[#e5ecf1]/30">
                                    <h2 className="text-sm font-semibold">
                                        Profissionais Cadastrados
                                    </h2>
                                </div>

                                <div className="divide-y divide-border">

                                    {usuariosFiltrados.map((user: any) => (
                                        <div className="flex items-center justify-between px-5 py-3">
                                            <div className="text-left gap-3">
                                                <p className="text-sm font-semibold">{user.nome}</p>
                                                
                                                <p className="text-xs [text-#555f69]">
                                                    Matrícula: {user.matricula}
                                                </p>
                                                <p className="text-xs [text-#555f69]">
                                                    Função: {user.funcao}
                                                </p>
                                                <p className="text-xs [text-#555f69]">
                                                    Base: {user.base}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => editarUsuario(user)}
                                                    className="text-sm px-2 py-1 border rounded"
                                                    >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => removerUsuario(user.id)}
                                                    className="text-sm px-2 py-1 border rounded text-red-500"
                                                    >
                                                    Remover
                                                    </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-xl p-6">
                    <h2 className="text-lg font-bold mb-4">
                        Editar Profissional
                    </h2>

                    <div className="space-y-3 text-left">
                        <label className="text-xs font-semibold">Nome</label>
                        <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        />
                        <label className="text-xs font-semibold">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        <label className="text-xs font-semibold">Senha</label>  
                            <input
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        <label className="text-xs font-semibold">Função</label>
                        <select
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            required
                            >
                            <option value={base}>{base}</option>

                            {bases.map((base) => (
                                <option key={base.id} value={base.nome}>
                                {base.nome}
                                </option>
                            ))}
                        </select>
                        
                        <label className="text-xs font-semibold">Função</label>
                        <select
                        value={funcao}
                        onChange={(e) => setFuncao(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        >
                        {fichas.map((ficha) => (
                            <option key={ficha.id} value={ficha.nome}>
                            {ficha.nome}
                            </option>
                        ))}
                        </select>

                        <label className="text-xs font-semibold">Perfil</label>
                        <select
                                value={perfil}
                                onChange={(e) => setPerfil(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                            <option value="Administrador">Administrador</option>
                            <option value="Usuario">Usuário</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                        <button
                        onClick={() => setModalAberto(false)}
                        className="px-4 py-2 border rounded-lg"
                        >
                        Cancelar
                        </button>

                        <button
                        onClick={salvarEdicao}
                        className="px-4 py-2 bg-black text-white rounded-lg"
                        >
                        Salvar
                        </button>
                    </div>
                    </div>
                </div>
                )}
        </div>
    )
}