import Header from '../components/Header'
import Nav from '../components/Nav'
import KPIAvaliacoesPorCategoria from '../components/KPIAvaliacoesPorCategoria'

export default function Painel() {

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

                            {/* KPIs */}
                            <KPIAvaliacoesPorCategoria />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}