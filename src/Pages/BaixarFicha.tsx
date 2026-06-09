import Header from '../components/Header'
import Nav from '../components/Nav'

import { useEffect, useState } from "react";


type Avaliacao = {
    id: number;
    nome: string;
    usuario_id: number;
    tipo_avaliacao: string;
    resultado: Record<string, number>;
    criado_em: string;
};

export default function BaixarFicha() {

    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

    useEffect(() => {
        fetch("http://192.168.1.10:8026/api/avaliacoes")
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
                                    className="border rounded-xl p-4 bg-white shadow-sm text-left"
                                >
                                    <div className="mb-3 pl-4">
                                        <p>
                                            <strong>Usuário:</strong>{" "}
                                            {avaliacao.nome}
                                        </p>

                                        <p>
                                            <strong>Ficha:</strong>{" "}
                                            {avaliacao.tipo_avaliacao}
                                        </p>

                                        <p>
                                            <strong>Data:</strong>{" "}
                                            {new Date(
                                                avaliacao.criado_em
                                            ).toLocaleString("pt-BR")}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded p-3">
                                        <strong>Respostas:</strong>

                                        {Object.entries(avaliacao.resultado).map(
                                            ([codigo, nota]) => (
                                                <div
                                                    key={codigo}
                                                    className="flex justify-between border-b py-1"
                                                >
                                                    <span>{codigo}</span>
                                                    <span>{nota}</span>
                                                </div>
                                            )
                                        )}
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