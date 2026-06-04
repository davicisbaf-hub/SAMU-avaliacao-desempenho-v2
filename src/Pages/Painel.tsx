
import FichasCard from '../components/fichas-card'
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
          <div className='p-[32px] overflow-y-auto'>
            
            {/* instrumento dedenpanho */}
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
          
            {/* painel KPI */}
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='font-semibold text-foreground'>Painel de KPIs — Situação Atual</h2>
                <a className='text-xs text-[#c1314a] hover:underline'>Ver todos →</a>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                
                <div className='rounded-xl border p-4 text-center bg-emerald-50 border-emerald-200'>
                  <p className='text-2xl font-bold text-[#10b981]'>0</p>
                  <p className='text-xs font-semibold mt-0.5 text-[#10b981]'>Bom</p>
                </div>

                <div className='rounded-xl border p-4 text-center bg-emerald-50 border-emerald-200'>
                  <p className='text-2xl font-bold text-[#10b981]'>0</p>
                  <p className='text-xs font-semibold mt-0.5 text-[#10b981]'>Bom</p>
                </div>

                <div className='rounded-xl border p-4 text-center bg-emerald-50 border-emerald-200'>
                  <p className='text-2xl font-bold text-[#10b981]'>0</p>
                  <p className='text-xs font-semibold mt-0.5 text-[#10b981]'>Bom</p>
                </div>
              </div>
            </div>
            
            {/* ficha avaliação */}
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
                <h2 className='font-semibold text-foreground'>Fichas de Avaliação por Função</h2>
                <a href='#' className='flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  Baixar Todas as Fichas (PDF)
                </a>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                { FichasCard("Condutor Socorrista", 15) }
                { FichasCard("Condutor Socorrista", 15) }
                { FichasCard("Condutor Socorrista", 15) }
                { FichasCard("Condutor Socorrista", 15) }
                { FichasCard("Condutor Socorrista", 15) }
                { FichasCard("Condutor Socorrista", 15) }
              </div>
            </div>

            {/* frequencia de aplicação */}
            <div className='mb-8'>
              <h2 className='text-left font-semibold text-foreground mb-3'>Frequência de Aplicação</h2>
              <div className='bg-card border border-border rounded-xl overflow-hidden'>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 text-left">Frequência</th>
                      <th className="px-4 py-2.5 text-left">Instrumento / Ação</th>
                      <th className="px-4 py-2.5 text-left">Responsável</th>
                    </tr>
                  </thead>

                  <tbody className='text-left'>
                    <tr className="border-b border-border bg-background">
                      <td className="px-4 py-2.5 font-semibold text-primary text-xs">
                        Diária
                      </td>
                      <td className="px-4 py-2.5 text-foreground text-sm">
                        Checklist de viatura e EPIs (início do plantão)
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        Condutor + equipe
                      </td>
                    </tr>

                    <tr className="border-b border-border bg-muted/20">
                      <td className="px-4 py-2.5 font-semibold text-primary text-xs">
                        Semanal
                      </td>
                      <td className="px-4 py-2.5 text-foreground text-sm">
                        Análise de prontuários e KPIs operacionais
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        Enfermeiro supervisor / coord.
                      </td>
                    </tr>

                    <tr className="border-b border-border bg-background">
                      <td className="px-4 py-2.5 font-semibold text-primary text-xs">
                        Mensal
                      </td>
                      <td className="px-4 py-2.5 text-foreground text-sm">
                        Avaliação 360° por competências + feedback individual
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        Chefia imediata
                      </td>
                    </tr>

                    <tr className="border-b border-border bg-muted/20">
                      <td className="px-4 py-2.5 font-semibold text-primary text-xs">
                        Semestral
                      </td>
                      <td className="px-4 py-2.5 text-foreground text-sm">
                        Simulação realística bp-TEAM/NTS + debriefing em vídeo
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        NEP / Coord. médica
                      </td>
                    </tr>

                    <tr className="bg-background">
                      <td className="px-4 py-2.5 font-semibold text-primary text-xs">
                        Anual
                      </td>
                      <td className="px-4 py-2.5 text-foreground text-sm">
                        PDI — revisão de metas e certificações (ACLS/PHTLS/BLS)
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        Direção Técnica / CISBAF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* aviso */}
            <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 text-left'>
              <p className='font-semibold mb-1'>⚠️ Princípio Fundamental — Avaliação Não Punitiva</p>
              <p className='text-xs leading-relaxed'>Este instrumento tem caráter exclusivamente educativo e de melhoria da qualidade assistencial. Os resultados devem orientar o Plano de Desenvolvimento Individual (PDI) e as ações de Educação Permanente. A meta é a redução do tempo-resposta, a melhoria da segurança do paciente e o fortalecimento das equipes de intervenção do SAMU 192 — CRUR-BF.</p>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}