import Header from '../components/Header'
import Nav from '../components/Nav'


export default function InstrucoesPage() {
  return (
    <div>
      <div className="flex h-screen w-screen bg-white text-black">
        <Nav />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />

          {/* conteudo */}
          <div className='custom-scrollbar p-[32px] overflow-y-auto text-left'>
            
            {/* titulo */}
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-foreground'>Como Aplicar o Instrumento</h1>
              <p className='[text-#555f69] mt-1 text-sm'>Guia completo para avaliadores, profissionais e coordenação</p>
            </div>

            {/* base teorica e legal */}
            <div className='bg-[#061c31] rounded-xl p-5 text-white space-y-3 mb-6'>
              <h2 className='font-semibold text-base'>Base Teórica e Legal</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-xs'>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
                <div className='bg-sidebar/40 rounded-lg p-3'>
                  <p className='font-semibold text-[#f8f8f8] mb-1'>bp-TEAM (Team Emergency Assessment Measure)</p>
                  <p className='text-[#f8f8f8]/70'>Ferramenta validada em português para avaliação de equipes de emergência. Três domínios: Liderança, Trabalho em Equipe e Gerenciamento de Tarefas.</p>
                </div>
              </div>
            </div>

            {/* fluxo de avaliação */}
            <div className='bg-card border border-border rounded-xl p-5 space-y-3 mb-6'>
              <h2 className='font-semibold text-[#0e1216]'>Fluxos da Avaliação 360°</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='flex items-start gap-3 bg-[#e5ecf1]/40 rounded-lg p-3'>
                  <div className='w-8 h-8 rounded-full bg-[#cd0048] flex items-center justify-center shrink-0'>
                    <span className='text-white text-xs font-bold'>360</span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Chefia → Equipe</p>
                    <p className='text-xs [text-#555f69] mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 bg-[#e5ecf1]/40 rounded-lg p-3'>
                  <div className='w-8 h-8 rounded-full bg-[#cd0048] flex items-center justify-center shrink-0'>
                    <span className='text-white text-xs font-bold'>360</span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Chefia → Equipe</p>
                    <p className='text-xs [text-#555f69] mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 bg-[#e5ecf1]/40 rounded-lg p-3'>
                  <div className='w-8 h-8 rounded-full bg-[#cd0048] flex items-center justify-center shrink-0'>
                    <span className='text-white text-xs font-bold'>360</span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Chefia → Equipe</p>
                    <p className='text-xs [text-#555f69] mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 bg-[#e5ecf1]/40 rounded-lg p-3'>
                  <div className='w-8 h-8 rounded-full bg-[#cd0048] flex items-center justify-center shrink-0'>
                    <span className='text-white text-xs font-bold'>360</span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Chefia → Equipe</p>
                    <p className='text-xs [text-#555f69] mt-0.5'>Avaliação da chefia/liderança para o profissional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* escala de pontuação */}
            <div className='bg-card border border-border rounded-xl p-5 space-y-3 mb-6'>
              <h2 className='font-semibold text-[#0e1216]'>Escala de Pontuação (Likert 1–5)</h2>
              <div className='space-y-2'>
                <div className='flex items-start gap-3'>
                  <span className='w-8 h-8 rounded-lg text-sm font-bold text-white flex items-center justify-center shrink-0 bg-[#cd0048]'>1</span>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Insatisfatório</p>
                    <p className='text-xs [text-#555f69]'>Não atende; requer intervenção imediata</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='w-8 h-8 rounded-lg text-sm font-bold text-white flex items-center justify-center shrink-0 bg-[#cd0048]'>1</span>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Insatisfatório</p>
                    <p className='text-xs [text-#555f69]'>Não atende; requer intervenção imediata</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='w-8 h-8 rounded-lg text-sm font-bold text-white flex items-center justify-center shrink-0 bg-[#cd0048]'>1</span>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Insatisfatório</p>
                    <p className='text-xs [text-#555f69]'>Não atende; requer intervenção imediata</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='w-8 h-8 rounded-lg text-sm font-bold text-white flex items-center justify-center shrink-0 bg-[#cd0048]'>1</span>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Insatisfatório</p>
                    <p className='text-xs [text-#555f69]'>Não atende; requer intervenção imediata</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='w-8 h-8 rounded-lg text-sm font-bold text-white flex items-center justify-center shrink-0 bg-[#cd0048]'>1</span>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Insatisfatório</p>
                    <p className='text-xs [text-#555f69]'>Não atende; requer intervenção imediata</p>
                  </div>
                </div>
              </div>
            </div>          
            
            {/* Classificação Final da Avaliação */}
            <div className='bg-card border border-border rounded-xl p-5 space-y-3 mb-6'>
              <h2 className='font-semibold text-[#0e1216]'>Classificação Final da Avaliação</h2>
              <div className='overflow-x-auto'>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#e5ecf1]/50 text-xs [text-#555f69]">
                      <th className="px-4 py-2 text-left">Pontuação Geral</th>
                      <th className="px-4 py-2 text-left">Classificação</th>
                      <th className="px-4 py-2 text-left">Ação Recomendada</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                        ≥ 80% (média ≥ 4,0)
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-emerald-700 bg-emerald-50">
                          BOM
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs [text-#555f69]">
                        Manutenção e aperfeiçoamento. Reconhecimento e incentivo.
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                        60% a 79% (média 3,0 a 3,9)
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-amber-700 bg-amber-50">
                          REGULAR
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs [text-#555f69]">
                        PDI com ações de melhoria. Acompanhamento mensal. Treinamentos específicos.
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                        &lt; 60% (média &lt; 3,0)
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-red-700 bg-red-50">
                          RUIM
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs [text-#555f69]">
                        Intervenção imediata. PDI urgente. Supervisão direta. Afastamento de funções críticas se necessário.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frequência e Responsabilidade de Aplicação */}
            <div className='bg-card border border-border rounded-xl p-5 space-y-3 mb-6'>
              <h2 className='font-semibold text-[#0e1216]'>Frequência e Responsabilidade de Aplicação</h2>
              <div className='space-y-3'>
                <div className="flex gap-3 items-start bg-[#e5ecf1]/30 rounded-lg p-3">
                  <span className="text-xl shrink-0">☀️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#cd0048]">
                        Diária
                      </p>

                      <span className="text-xs [text-#555f69]">
                        — Condutor + equipe
                      </span>
                    </div>

                    <p className="text-xs text-foreground mt-0.5">
                      Checklist de viatura, materiais e EPIs no início de cada plantão.
                      Registro em livro de ocorrências da base.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-[#e5ecf1]/30 rounded-lg p-3">
                  <span className="text-xl shrink-0">☀️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#cd0048]">
                        Diária
                      </p>

                      <span className="text-xs [text-#555f69]">
                        — Condutor + equipe
                      </span>
                    </div>

                    <p className="text-xs text-foreground mt-0.5">
                      Checklist de viatura, materiais e EPIs no início de cada plantão.
                      Registro em livro de ocorrências da base.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-[#e5ecf1]/30 rounded-lg p-3">
                  <span className="text-xl shrink-0">☀️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#cd0048]">
                        Diária
                      </p>

                      <span className="text-xs [text-#555f69]">
                        — Condutor + equipe
                      </span>
                    </div>

                    <p className="text-xs text-foreground mt-0.5">
                      Checklist de viatura, materiais e EPIs no início de cada plantão.
                      Registro em livro de ocorrências da base.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-[#e5ecf1]/30 rounded-lg p-3">
                  <span className="text-xl shrink-0">☀️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#cd0048]">
                        Diária
                      </p>

                      <span className="text-xs [text-#555f69]">
                        — Condutor + equipe
                      </span>
                    </div>

                    <p className="text-xs text-foreground mt-0.5">
                      Checklist de viatura, materiais e EPIs no início de cada plantão.
                      Registro em livro de ocorrências da base.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-[#e5ecf1]/30 rounded-lg p-3">
                  <span className="text-xl shrink-0">☀️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#cd0048]">
                        Diária
                      </p>

                      <span className="text-xs [text-#555f69]">
                        — Condutor + equipe
                      </span>
                    </div>

                    <p className="text-xs text-foreground mt-0.5">
                      Checklist de viatura, materiais e EPIs no início de cada plantão.
                      Registro em livro de ocorrências da base.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Princípio Norteador */}
            <div className="bg-[#cd0048]/5 border border-[#cd0048]/20 rounded-xl p-4 text-sm">
              <p className="font-semibold text-[#cd0048] mb-1">
                Princípio Norteador
              </p>

              <p className="text-foreground text-xs leading-relaxed">
                A avaliação de desempenho no SAMU-192 não tem caráter punitivo.
                Seu objetivo central é a melhoria contínua da qualidade do
                atendimento pré-hospitalar, a redução do tempo-resposta, a
                segurança do paciente e o desenvolvimento profissional sustentável
                das equipes da Baixada Fluminense.

                Os resultados devem ser compartilhados com os profissionais em
                ambiente seguro, respeitoso e orientado para soluções.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}