import Header from '../components/Header'
import Nav from '../components/Nav'
import KPIAvaliacoesPorCategoria from '../components/KPIAvaliacoesPorCategoria'
import StatusCardsKPI from '../components/StatusCardsKPI'
import { useState } from 'react'
import type { StatusKPIContagem } from '../components/KPIAvaliacoesPorCategoria'

export default function Painel() {
    const [statusKPI, setStatusKPI] = useState<StatusKPIContagem>({
        categoriasBom: 0,
        categoriasAtenção: 0,
        categoriasRisco: 0,
    })

    return (
        <div>
            <div className="flex h-screen w-screen bg-white text-black">
                <Nav />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />

                    {/* conteudo */}
                    <div className='custom-scrollbar p-[32px] overflow-y-auto'>
                        <div className='space-y-8'>
                            {/* Título */}
                            <div>
                                <h1 className='text-3xl font-bold text-foreground mb-2'>Painel de Desempenho</h1>
                                <p className='text-sm text-gray-600'>Visualize KPIs de avaliações por categoria e tipo de função</p>
                            </div>

                            {/* Status Cards KPI */}
                            <StatusCardsKPI 
                                categoriasBom={statusKPI.categoriasBom}
                                categoriasAtenção={statusKPI.categoriasAtenção}
                                categoriasRisco={statusKPI.categoriasRisco}
                            />

                            {/* KPIs */}
                            <KPIAvaliacoesPorCategoria onStatusChange={setStatusKPI} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}