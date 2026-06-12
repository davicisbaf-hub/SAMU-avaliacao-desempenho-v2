import Header from '../components/Header'
import Nav from '../components/Nav'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";


type Avaliacao = {
    id: number;
    nome: string;
    usuario_id: number;
    tipo_avaliacao: string;
    resultado: Record<string, number>;
    funcao: string;    
    criado_em: string;
};

export default function BaixarFicha() {
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

    useEffect(() => {
        fetch("http://localhost:46241/api/avaliacoes")
            .then((res) => res.json())
            .then(setAvaliacoes)
            .catch(console.error);
    }, []);

    const usuarios = [...new Set(avaliacoes.map(a => a.nome))];
    const funcoes = [...new Set(avaliacoes.map(a => a.funcao))];
    const tipos = [...new Set(avaliacoes.map(a => a.tipo_avaliacao))];

    const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
    const dataAvaliacao = new Date(avaliacao.criado_em);

    const passouUsuario =
        !filtroUsuario || avaliacao.nome === filtroUsuario;

    const passouFuncao =
        !filtroFuncao || avaliacao.funcao === filtroFuncao;

    const passouTipo =
        !filtroTipo || avaliacao.tipo_avaliacao === filtroTipo;

    const passouDataInicio =
    !dataInicio ||
    dataAvaliacao >= dataInicio;

    const passouDataFim =
        !dataFim ||
        dataAvaliacao <= dataFim;

    return (
        passouUsuario &&
        passouFuncao &&
        passouTipo &&
        passouDataInicio &&
        passouDataFim
    );
});
    return (
        <div>
            <div className="flex h-screen w-screen bg-white text-black">
                <Nav />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />

                    {/* conteudo */}
                    <div className='custom-scrollbar p-[32px] overflow-y-auto'>
                        <div className="space-y-4">


                            <h1 className="text-2xl font-bold">
                                Avaliações Enviadas
                            </h1>

                            <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3">
                                <select
                                    value={filtroUsuario}
                                    onChange={(e) => setFiltroUsuario(e.target.value)}
                                    className="border rounded-lg px-3 py-2"
                                >
                                    <option value="">Todos os usuários</option>

                                    {usuarios.map(usuario => (
                                        <option key={usuario} value={usuario}>
                                            {usuario}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filtroFuncao}
                                    onChange={(e) => setFiltroFuncao(e.target.value)}
                                    className="border rounded-lg px-3 py-2"
                                >
                                    <option value="">Todas as funções</option>

                                    {funcoes.map(funcao => (
                                        <option key={funcao} value={funcao}>
                                            {funcao}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filtroTipo}
                                    onChange={(e) => setFiltroTipo(e.target.value)}
                                    className="border rounded-lg px-3 py-2"
                                >
                                    <option value="">Todos os tipos</option>

                                    {tipos.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <DatePicker
                                        selected={dataInicio}
                                        onChange={(date: Date | null) => setDataInicio(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Data inicial"
                                        className="border rounded-lg px-3 py-2 w-full react-datepicker"
                                    />
                                        
                                        

                                    <DatePicker
                                        selected={dataFim}
                                        onChange={(date: Date | null) => setDataFim(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Data final"
                                        className="border rounded-lg px-3 py-2 w-full react-datepicker"
                                    />
                                </div>
                                    
                                    
                                <button
                                    onClick={() => {
                                        setFiltroUsuario("");
                                        setFiltroFuncao("");
                                        setFiltroTipo("");
                                        setDataInicio(null);
                                        setDataFim(null);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                                >
                                    Limpar filtros
                                </button>
                                
                            </div>
                            {avaliacoesFiltradas.map((avaliacao) => (
                                <div
                                    key={avaliacao.id}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    {/* Cabeçalho */}
                                    <div className="bg-gray-50 border-b px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                        <div>

                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                <h2 className="font-semibold text-lg text-gray-900">
                                                    {avaliacao.nome}
                                                </h2>
                                                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                                    <span className="font-bold">Função:</span> {avaliacao.funcao}
                                                </span>

                                                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                                    <span className="font-bold">Tipo de Avaliação:</span> {avaliacao.tipo_avaliacao}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {new Date(avaliacao.criado_em).toLocaleString("pt-BR")}
                                        </div>
                                    </div>

                                    {/* Respostas */}
                                    <div className="p-6">
                                        <h3 className="font-medium text-gray-700 mb-3">
                                            Resultados da Avaliação
                                        </h3>

                                        <div className="overflow-hidden rounded-xl border">
                                            <table className="w-full">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="text-left px-4 py-3">
                                                            Critério
                                                        </th>

                                                        <th className="text-right px-4 py-3">
                                                            Nota
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {Object.entries(avaliacao.resultado).map(
                                                        ([codigo, nota]) => (
                                                            <tr
                                                                key={codigo}
                                                                className="border-t hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 font-medium">
                                                                    {codigo}
                                                                </td>

                                                                <td className="px-4 py-3 text-right">
                                                                    <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                                                        {nota}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}