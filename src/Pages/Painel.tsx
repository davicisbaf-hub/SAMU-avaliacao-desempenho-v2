import Header from '../components/Header'
import Nav from '../components/Nav'
import KPIAvaliacoesPorCategoria from '../components/KPIAvaliacoesPorCategoria'
import StatusCardsKPI from '../components/StatusCardsKPI'
import { useState } from 'react'
import { useUserSession } from "../contexts/UserSession";
import type { StatusKPIContagem } from '../components/KPIAvaliacoesPorCategoria'

export default function Painel() {
    const [statusKPI, setStatusKPI] = useState<StatusKPIContagem>({
        categoriasBom: 0,
        categoriasAtenção: 0,
        categoriasRisco: 0,
    })
    const { user } = useUserSession();

    return (
        <div>
            <div className="flex h-screen w-screen bg-white text-black">
                <Nav />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />

                    {/* conteudo */}
                    <div className='custom-scrollbar p-[38px] overflow-y-auto'>
                        <div className='space-y-8'>
                            {/* Título */}
                            <div className='text-left'>
                                <h1 className='text-3xl font-bold text-foreground mb-2'>Painel de KPIs Operacionais</h1>
                                <p className='text-sm text-gray-600'>
                                    Indicadores baseados na Portaria MS 2.048/2002 e parâmetros internacionais ACLS/PHTLS
                                </p>
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