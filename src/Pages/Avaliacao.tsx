import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from "react";
import TableAvaliacao from '../components/table-avaliacao';

type Criterios = {
  categoria: string;
  codigo: string;
  criterio: string;
  peso: number;
  id: number;
};

export default function AvaliacaoPage() {

    const [criterios, setCriterios] = useState<Criterios[]>([]);
    
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
    carregar("http://localhost:3001/api/criterios-avaliacao/bp-team", setCriterios);
    }, []);

    const criteriosPorCategoria = criterios.reduce((acc, criterio) => {
        if (!acc[criterio.categoria]) {
            acc[criterio.categoria] = [];
        }

        acc[criterio.categoria].push(criterio);

        return acc;
    }, {} as Record<string, Criterios[]>);

  return (
    <div>
        <div className="flex h-screen w-screen bg-white text-black">
            <Nav />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                {/* conteudo */}
                <div className='custom-scrollbar p-[32px] overflow-y-auto text-left'>
                    <div className='space-y-6'>

                        {/* titulo */}
                        <h1 className='text-2xl font-bold text-foreground'>Autoavaliação & Simulação bp-TEAM</h1>
                        <p className='text-muted-foreground mt-1 text-sm'>O profissional avalia sua própria performance, ou aplique a ferramenta bp-TEAM validada em cenários de simulação realística</p>
                    
                        {/* acesso */}
                        <div className='flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3'>
                            <span className='text-2xl'>💉</span>
                            <div>
                                <p className='font-semibold text-sm text-foreground'>
                                    Acesso como: 
                                    <span className='text-primary'> Técnico de Enfermagem</span>
                                </p>
                                <p className='text-xs text-muted-foreground'>Você tem acesso à sua autoavaliação e à simulação bp-TEAM.</p>
                            </div>
                        </div>

                        {/* selecao ficha */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <button className='text-left p-4 rounded-xl border-2 transition-all border-primary bg-primary/5'>
                                <p className='font-semibold text-sm text-foreground'>Simulação bp-TEAM</p>
                                <p className='text-xs text-muted-foreground mt-1'>Avaliação em cenário simulado — Liderança, Trabalho em Equipe, Gerenciamento de Tarefas e NTS</p>
                            </button>
                            <button className='text-left p-4 rounded-xl border-2 transition-all border-primary bg-primary/5'>
                                <p className='font-semibold text-sm text-foreground'>Simulação bp-TEAM</p>
                                <p className='text-xs text-muted-foreground mt-1'>Avaliação em cenário simulado — Liderança, Trabalho em Equipe, Gerenciamento de Tarefas e NTS</p>
                            </button>
                        </div>

                        {/* header de avaliacao */}
                        <div className='bg-[#0a1a30] text-white rounded-lg mb-8'>
                            <div className='flex items-center gap-4 p-5'>
                                <div className='w-14 h-14 rounded-xl bg-[#cd0048] flex items-center justify-center shrink-0'>
                                    <span className='text-2xl'>🩺</span>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h1 className='text-lg font-bold text-secondary-foreground'>Ficha de Avaliação de Desempenho</h1>
                                        <span className='bg-[#cd0048]/20 text-white/80 text-xs px-2 py-0.5 rounded-full font-medium border border-[#cd0048]/30'>Autoavaliação: Enfermeiro</span>
                                    </div>
                                    <p className='text-secondary-foreground/70 text-sm mt-0.5'>Enfermeiro — SAMU 192 / CRUR-BF / CISBAF</p>
                                </div>
                                <div className='text-right hidden sm:block'>
                                    <p className='text-secondary-foreground/60 text-xs'>Data</p>
                                    <p className='text-secondary-foreground font-mono text-sm'>05/06/2026</p>
                                </div>
                            </div>
                            <div className='bg-secondary/50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4'>
                                <div>
                                    <label className='text-secondary-foreground/70 text-xs font-medium block mb-1'>Base de Lotação</label>
                                    <select className='w-full bg-background/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none'>
                                        <option>
                                            Selecione a base…
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className='text-secondary-foreground/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
                                    <input className='w-full bg-background/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-secondary-foreground placeholder:text-secondary-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary' placeholder="Ex: Dr. Roberto Alves"></input>
                                </div>
                                <div>
                                    <label className='text-secondary-foreground/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
                                    <input className='w-full bg-background/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-secondary-foreground placeholder:text-secondary-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary' placeholder="Ex: Dr. Roberto Alves"></input>
                                </div>
                                <div>
                                    <label className='text-secondary-foreground/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
                                    <input className='w-full bg-background/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-secondary-foreground placeholder:text-secondary-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary' placeholder="Ex: Dr. Roberto Alves"></input>
                                </div>
                            </div>
                        </div>

                        {/* escala de pontuacao */}
                        <div className='bg-muted/50 rounded-xl p-4'>
                            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>Escala de Pontuação Likert — 1 a 5</p>
                            <div className='flex flex-wrap gap-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center bg-[#cd0048]'>1</span>
                                    <span className='text-xs text-foreground'>
                                        <span className='font-medium'>Insatisfatório</span>
                                        <span className='text-muted-foreground hidden sm:inline'> Não atende; requer intervenção imediata</span>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center bg-[#cd0048]'>1</span>
                                    <span className='text-xs text-foreground'>
                                        <span className='font-medium'>Insatisfatório</span>
                                        <span className='text-muted-foreground hidden sm:inline'> Não atende; requer intervenção imediata</span>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center bg-[#cd0048]'>1</span>
                                    <span className='text-xs text-foreground'>
                                        <span className='font-medium'>Insatisfatório</span>
                                        <span className='text-muted-foreground hidden sm:inline'> Não atende; requer intervenção imediata</span>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center bg-[#cd0048]'>1</span>
                                    <span className='text-xs text-foreground'>
                                        <span className='font-medium'>Insatisfatório</span>
                                        <span className='text-muted-foreground hidden sm:inline'> Não atende; requer intervenção imediata</span>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center bg-[#cd0048]'>1</span>
                                    <span className='text-xs text-foreground'>
                                        <span className='font-medium'>Insatisfatório</span>
                                        <span className='text-muted-foreground hidden sm:inline'> Não atende; requer intervenção imediata</span>
                                    </span>
                                </div>
                            </div>
                            
                            <div className='class="flex gap-4 mt-3 text-xs text-muted-foreground border-t border-border pt-3'>
                                <span className='flex items-center gap-2'>
                                    <span className='inline-block w-4 h-4 rounded-full bg-[#cd0048] text-white text-[10px] font-bold text-center leading-4'>
                                        3 
                                    </span>
                                    Peso Alto (itens críticos)
                                    <span className='inline-block w-4 h-4 rounded-full bg-[#cd0048] text-white text-[10px] font-bold text-center leading-4'>
                                        2
                                    </span>
                                    Peso Médio
                                    <span className='inline-block w-4 h-4 rounded-full bg-[#cd0048] text-white text-[10px] font-bold text-center leading-4'>
                                        1 
                                    </span>
                                    Peso Baixo
                                </span>
                            </div>
                        </div>
                        
                        
                        {Object.entries(criteriosPorCategoria).map(
                            ([categoria, itens]) => (
                                <div key={categoria} className="bg-card border border-border rounded-xl overflow-hidden">
                                
                                    <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-5 rounded-full bg-[#cd0048]" />

                                            <h2 className="font-semibold text-card-foreground text-sm">{categoria}</h2>
                                            <span className="text-xs text-muted-foreground">0 / {itens.length} respondidos</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg"width="16"height="16"viewBox="0 0 24 24"fill="none" stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                    </button>
                                    <div>
                                        <div className="overflow-x-auto">
                                        
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-muted/50 text-xs text-muted-foreground border-b border-border">
                                                <th className="px-4 py-2 text-left w-28">Código</th>
                                                <th className="px-4 py-2 text-left">
                                                    Critério de Avaliação / Indicador
                                                </th>
                                                <th className="px-4 py-2 text-center w-16">Peso</th>
                                                <th className="px-4 py-2 text-left min-w-56">
                                                    Pontuação (1–5)
                                                </th>
                                                <th className="px-4 py-2 text-center w-32">
                                                    Classificação
                                                </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {itens.map((criterio) => (
                                                <TableAvaliacao
                                                    key={criterio.id}
                                                    codigo={criterio.codigo}
                                                    criterio={criterio.criterio}
                                                    peso={criterio.peso}
                                                />
                                                ))}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}