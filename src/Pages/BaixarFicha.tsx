import Header from '../components/Header'
import Nav from '../components/Nav'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Eye, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useEffect, useState } from "react";

type Avaliacao = {
    id: number;

    avaliador_nome: string;
    avaliador_funcao: string;

    avaliado_nome: string;
    avaliado_funcao: string;

    funcao: string;

    tipo_avaliacao: string;

    resultado: Record<string, { nota: number; peso: number; }>;
    criado_em: string;
};

export default function BaixarFicha() {
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const [filtroFuncao, setFiltroFuncao] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/avaliacoes")
            .then((res) => res.json())
            .then(setAvaliacoes)
            .catch(console.error);
    }, []);

    const usuarios = [...new Set(avaliacoes.map(a => a.avaliado_nome))];
    const funcoes = [...new Set(avaliacoes.map(a => a.funcao))];
    const tipos = [...new Set(avaliacoes.map(a => a.tipo_avaliacao))];

    const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
        const dataAvaliacao = new Date(avaliacao.criado_em);

        const passouUsuario =
            !filtroUsuario || avaliacao.avaliado_nome === filtroUsuario;

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

    function gerarPdf(avaliacao: Avaliacao) {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Ficha de Avaliação", 14, 20);

        doc.setFontSize(11);

        doc.text(`Avaliado: ${avaliacao.avaliado_nome}`, 14, 35);
        doc.text(`Avaliador: ${avaliacao.avaliador_nome}`, 14, 45);
        doc.text(`Tipo: ${avaliacao.tipo_avaliacao}`, 14, 55);

        autoTable(doc, {
            startY: 70,
            head: [["Critério", "Peso", "Nota"]],
            body: Object.entries(avaliacao.resultado).map(
                ([criterio, valor]) => [
                    criterio
                        .replace(/≤/g, "<=")
                        .replace(/≥/g, ">=")
                        .replace(/[–—]/g, "-"),
                    String(valor.peso),
                    String(valor.nota),
                ]
            ),
            styles: {
                fontSize: 8,
                cellWidth: "wrap",
            },
            columnStyles: {
                0: { cellWidth: 120 },
            },
        });

        doc.save(`avaliacao-${avaliacao.avaliado_nome}.pdf`);
    }
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
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-100 border-b">
                                            <tr className="text-center">
                                                <th className="px-4 py-3">#</th>
                                                <th className="px-4 py-3">Avaliado</th>
                                                <th className="px-4 py-3">Avaliador</th>
                                                <th className="px-4 py-3">Tipo avaliação</th>
                                                <th className="px-4 py-3">Data</th>
                                                <th className="px-4 py-3">Ações</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {avaliacoesFiltradas.map((avaliacao) => (
                                                <tr
                                                    key={avaliacao.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        {avaliacao.id}
                                                    </td>

                                                    <td className="px-4 py-3 font-medium">
                                                        {avaliacao.avaliado_nome} - {avaliacao.avaliado_funcao}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {avaliacao.avaliador_nome} - {avaliacao.avaliador_funcao}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                                            {avaliacao.tipo_avaliacao}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {new Date(
                                                            avaliacao.criado_em
                                                        ).toLocaleDateString("pt-BR")}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setAvaliacaoSelecionada(avaliacao)
                                                                }
                                                                className="text-black px-3 py-2 rounded-lg"
                                                                title="Visualizar"
                                                            >
                                                                <Eye />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    gerarPdf(avaliacao)
                                                                }
                                                                className="text-black px-3 py-2 rounded-lg"
                                                                title="Baixar PDF"
                                                            >
                                                                <Download />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {avaliacaoSelecionada && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[90%] max-w-4xl max-h-[90vh] overflow-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                Detalhes da Avaliação
                            </h2>

                            <button
                                onClick={() => setAvaliacaoSelecionada(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <table className="w-full border">
                            <thead>
                                <tr>
                                    <th>Critério</th>
                                    <th>Peso</th>
                                    <th>Nota</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Object.entries(
                                    avaliacaoSelecionada.resultado
                                ).map(([criterio, valor]) => (
                                    <tr key={criterio}>
                                        <td>{criterio}</td>
                                        <td>{valor.peso}</td>
                                        <td>{valor.nota}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}