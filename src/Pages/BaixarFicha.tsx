import Header from '../components/Header'
import Nav from '../components/Nav'

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

    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

    useEffect(() => {
        fetch("http://localhost:44331/api/avaliacoes")
            .then((res) => res.json())
            .then(setAvaliacoes)
            .catch(console.error);
    }, []);

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

                            {avaliacoes.map((avaliacao) => (
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