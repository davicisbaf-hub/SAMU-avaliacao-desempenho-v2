
import Header from '../components/Header'
import Nav from '../components/Nav'

export default function Painel() {
  return (
    <div>
      <div className="flex h-screen w-screen bg-white text-black">
        <Nav />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />

          {/* conteudo */}
          <div className='p-[32px]'>
          
            <div className='p-6 md:p-8 bg-[#0a1a30] text-white rounded-lg mb-8'>
              
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-2xl bg-[#cd0048] flex items-center justify-center shrink-0'>
                  <span className='text-white font-black text-xl'>192</span>
                </div>

                <div className='text-left'>
                  
                  <div className='flex items-center gap-3 flex-wrap'>
                    <div className='flex items-center gap-2 flex-wrap mb-1'>
                      <h1 className='text-xl md:text-2xl font-bold text-secondary-foreground'>Instrumento de Avaliação de Desempenho</h1>
                      <span className='bg-[#cd0048] text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold'>360°</span>
                    </div>
                    <span className='inline-flex items-center gap-1.5 bg-[#cd0048]/30 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium'>🔑 Administrador — Todas as bases</span>
                  </div>

                  <p className='text-secondary-foreground/70 text-sm'>Equipes de Intervenção SAMU 192 — CRUR-BF / CISBAF — Baixada Fluminense, RJ</p>
                  <p className='text-secondary-foreground/50 text-xs mt-1'>Baseado em bp-TEAM, NTS, Portaria MS 2.048/2002 e Processo de Enfermagem no SAMU (Pizzolato et al., 2023)</p>
                  
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-6'>
                    
                    <div className='bg-sidebar/50 rounded-xl p-3'>
                      <p className='text-secondary-foreground text-xs font-semibold'>Chefia → Equipe</p>
                      <p className='text-secondary-foreground/60 text-xs mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                    </div>

                    <div className='bg-sidebar/50 rounded-xl p-3'>
                      <p className='text-secondary-foreground text-xs font-semibold'>Chefia → Equipe</p>
                      <p className='text-secondary-foreground/60 text-xs mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                    </div>

                    <div className='bg-sidebar/50 rounded-xl p-3'>
                      <p className='text-secondary-foreground text-xs font-semibold'>Chefia → Equipe</p>
                      <p className='text-secondary-foreground/60 text-xs mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                    </div>

                    <div className='bg-sidebar/50 rounded-xl p-3'>
                      <p className='text-secondary-foreground text-xs font-semibold'>Chefia → Equipe</p>
                      <p className='text-secondary-foreground/60 text-xs mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                    </div>
                  
                  </div>
                
                </div>             


              </div>
            </div>
          
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='font-semibold text-foreground'>Painel de KPIs — Situação Atual</h2>
                <a className='text-xs text-[#c1314a] hover:underline'>Ver todos →</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}