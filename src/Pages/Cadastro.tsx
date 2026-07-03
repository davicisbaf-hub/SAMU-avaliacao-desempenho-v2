import Header from '../components/Header'
import Nav from '../components/Nav'
import { useUserSession } from "../contexts/UserSession";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import MultiSelectPar from '../components/select'

type Base = {
    id: number;
    nome: string;
    cor: string;
};

type ParItem = { id: number; nome: string; funcao: string };

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

type InfoUsuario = {
  usuarioId: number;
  nome: string;
  nivel: string;
  dias_desde_criacao: number;
  frequencia: {
    id: number;
    nivel: string;
    dias_minimos: number;
    dias_maximos: number;
    dias: number;
    semanas: number;
    meses: number;
    anos: number;
    ativo: boolean;
  } | null;
  ultima_avaliacao?: Date;
  proxima_liberacao?: Date;
  pode_avaliar?: boolean;
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
    const [par, setPar] = useState<ParItem[]>([]);
    const [parEdicao, setParEdicao] = useState<ParItem[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);   
    const [busca, setBusca] = useState("");
    const [modalInfoAberto, setModalInfoAberto] = useState(false);
    const [infoUsuario, setInfoUsuario] = useState<InfoUsuario | null>(null);
    const [carregandoInfo, setCarregandoInfo] = useState(false);

    const isAdminGlobal = user?.perfil === "🔑 Administrador - Todas as bases"; 
    
    const usuariosFiltrados = (isAdminGlobal ? usuarios : usuarios.filter((u) => u.base === user?.base))
    .filter((u) =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        String(u.id).includes(busca)
    );
    const basesVisiveis = isAdminGlobal ? bases : bases.filter((base) => base.nome === user?.base);
    const { authFetch } = useAuthFetch();

    async function salvarEdicao() {
        if (!usuarioEditando) return;

        await authFetch(`/api/usuarios/${usuarioEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, funcao, base, perfil, par: parEdicao }),
        });

        setModalAberto(false);
        setUsuarioEditando(null);
        carregarUsuarios();
    }

    useEffect(() => {
        carregarUsuarios();
        }, []);

        async function carregarUsuarios() {
        try {
            const res = await authFetch("/api/usuarios");
            const data = await res.json();

            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setUsuarios([]);
        }
        }

    useEffect(() => {
        async function carregarBases() {
            const res = await authFetch("/api/bases");
            const data = await res.json();

            setBases(data);
            setBaseSelecionada(data[0]);
        }
        carregarBases();
    }, []);

    const cadastrarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await authFetch(
                "/api/usuarios",
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
                        perfil,
                        par
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
            setPar([]);
            
            carregarUsuarios();
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar usuário");
        }
    };

    const [fichas, setFichas] = useState<Ficha[]>([]);
  
    const carregar = async (url: string, setter: Function) => {
        try {
          const res = await authFetch(url);
          const data = await res.json();
          setter(data);
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        carregar("/api/fichas", setFichas);
    }, []);

    async function removerUsuario(id: number) {
        if (!confirm("Deseja inativar este usuário?")) {
            return;
        }

        await authFetch(
            `/api/usuarios/${id}/inativar`,
            {
            method: "PUT",
            }
        );

        carregarUsuarios();
    }

    function editarUsuario(usuario: any) {
        setUsuarioEditando(usuario);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setFuncao(usuario.funcao);
        setPerfil(usuario.perfil);
        setBase(usuario.base);
        setSenha(usuario.senha);
        setParEdicao(Array.isArray(usuario.par) ? usuario.par : (usuario.par ? JSON.parse(usuario.par) : []));
        setModalAberto(true);
    }

    // NOVA FUNÇÃO: Buscar informações do usuário
    async function verInfoUsuario(usuarioId: number) {
        setCarregandoInfo(true);
        setModalInfoAberto(true);
        setInfoUsuario(null);
        
        try {
            const res = await authFetch(`/api/avaliacoes/info?usuarioId=${usuarioId}`);
            const data = await res.json();
            setInfoUsuario(data);
        } catch (error) {
            console.error("Erro ao buscar informações do usuário:", error);
            alert("Erro ao carregar informações do usuário");
        } finally {
            setCarregandoInfo(false);
        }
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
                                <h1 className="text-2xl font-bold text-foreground text-left">
                                    Cadastro de Profissionais
                                </h1>
                                <p className="[text-#555f69] mt-1 text-sm text-left">
                                    Registre os profissionais e líderes de cada base. Os nomes cadastrados ficam disponíveis como opções nas fichas de avaliação, facilitando o preenchimento.
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
                            <div className="bg-card border border-border rounded-xl overflow-visible">

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
                                                <option value="Condutor">Condutor</option>
                                                <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                                                <option value="Enfermeiro">Enfermeiro</option>
                                                <option value="Médico">Médico</option>
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
                                                        value={base.nome}
                                                        className="text-black"
                                                    >
                                                        {base.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Par</label>
                                           <MultiSelectPar
                                                usuarios={usuarios.map(({ id, nome, funcao }) => ({ id, nome, funcao }))}
                                                value={par}
                                                onChange={setPar}
                                            />
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

                                <div className="px-5 py-3 border-b border-border bg-[#e5ecf1]/30 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold">
                                        Profissionais Cadastrados
                                    </h2>
                                    <input
                                    type="text"
                                    placeholder="Buscar por nome ou ID..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="border rounded-lg px-3 py-1.5 text-sm w-56"
                                    />
                                </div>

                                <div className="divide-y divide-border">

                                    {usuariosFiltrados.map((user: any) => (
                                        <div className="flex items-center justify-between px-5 py-3">
                                            <div className="text-left gap-3">
                                                <p className="text-sm font-semibold">{user.nome}</p>
                                                
                                                <p className="text-xs [text-#555f69]">
                                                    Matrícula: {user.matricula || '-'}
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
                                                    onClick={() => verInfoUsuario(user.id)}
                                                    className="text-sm px-2 py-1 border rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                                                    title="Ver informações de frequência"
                                                >
                                                    !
                                                </button>
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

            {/* MODAL DE EDIÇÃO */}
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
                        <label className="text-xs font-semibold">Base</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                            disabled={!isAdminGlobal}
                            required
                            >
                            {basesVisiveis.map((b) => (
                                <option
                                    key={b.id}
                                    value={b.nome}
                                    className="text-black"
                                >
                                    {b.nome}
                                </option>
                                ))}
                        </select>
                        
                        <label className="text-xs font-semibold">Função</label>
                        <select
                            value={funcao}
                            onChange={(e) => setFuncao(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Condutor">Condutor</option>
                            <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                            <option value="Enfermeiro">Enfermeiro</option>
                            <option value="Médico">Médico</option>
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
                    <label className="text-xs font-semibold">Par</label>
                    
                    <MultiSelectPar
                        usuarios={usuarios.map(({ id, nome, funcao }) => ({ id, nome, funcao }))}
                        value={parEdicao}
                        onChange={setParEdicao}
                        dropUp
                    />
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

            {/* MODAL DE INFORMAÇÕES DO USUÁRIO */}
            {modalInfoAberto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                Informações do Profissional
                            </h2>
                            <button
                                onClick={() => setModalInfoAberto(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {carregandoInfo ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Carregando informações...</p>
                            </div>
                        ) : infoUsuario ? (
                            <div className="space-y-4">
                                {/* Nível */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className='text-center w-full'>
                                            <p className="text-sm text-gray-500">Nível de Experiência</p>
                                            <p className="text-lg font-semibold">{infoUsuario.nome} - {infoUsuario.nivel}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Dias desde o cadastro: <strong>{infoUsuario.dias_desde_criacao} dias</strong>
                                    </p>
                                </div>

                                {/* Frequência configurada */}
                                {infoUsuario.frequencia && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-blue-800 mb-2">Configuração de Frequência</p>
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            <div className="bg-white rounded p-2">
                                                <p className="text-xs text-gray-500">Dias</p>
                                                <p className="font-bold">{infoUsuario.frequencia.dias}</p>
                                            </div>
                                            <div className="bg-white rounded p-2">
                                                <p className="text-xs text-gray-500">Semanas</p>
                                                <p className="font-bold">{infoUsuario.frequencia.semanas}</p>
                                            </div>
                                            <div className="bg-white rounded p-2">
                                                <p className="text-xs text-gray-500">Meses</p>
                                                <p className="font-bold">{infoUsuario.frequencia.meses}</p>
                                            </div>
                                            <div className="bg-white rounded p-2">
                                                <p className="text-xs text-gray-500">Anos</p>
                                                <p className="font-bold">{infoUsuario.frequencia.anos}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Intervalo mínimo: {infoUsuario.frequencia.dias_minimos} - {infoUsuario.frequencia.dias_maximos} dias
                                            {!infoUsuario.frequencia.ativo && ' (Inativo)'}
                                        </p>
                                    </div>
                                )}

                                {/* Status da última avaliação */}
                                {infoUsuario.ultima_avaliacao && (
                                    <div className={`rounded-lg p-4 ${infoUsuario.pode_avaliar ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                        <p className="text-sm font-semibold mb-1">Status da Avaliação</p>
                                        <p className="text-sm">
                                            Última avaliação: {new Date(infoUsuario.ultima_avaliacao).toLocaleDateString('pt-BR')}
                                        </p>
                                        {infoUsuario.proxima_liberacao && (
                                            <p className="text-sm">
                                                Próxima liberação: {new Date(infoUsuario.proxima_liberacao).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                        <p className="text-sm font-semibold mt-2">
                                            {infoUsuario.pode_avaliar ? '✅ Pode ser avaliado' : '⏳ Aguardando liberação'}
                                        </p>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Erro ao carregar informações</p>
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setModalInfoAberto(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}