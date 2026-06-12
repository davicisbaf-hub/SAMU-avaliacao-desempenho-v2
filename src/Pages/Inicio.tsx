
import { useEffect, useState } from "react";
import FichasCard from "../components/fichas-card";
import Header from '../components/Header'
import Nav from '../components/Nav'
import FrequenciaTable from "../components/table";
import { useUserSession } from "../contexts/UserSession";

type Ficha = {
  id: number;
  icon: string;
  nome: string;
  descricao: string;
  criterios: number;
  tags: string[];
  ordem: number;
  link: string;
  ativo: boolean;
  created_at: string;
};

type FrequenciaAplicacao = {
  id: number;
  frequencia: string;
  instrumento_acao: string;
  responsavel: string;
};

type Fluxo = {
  id: number;
  titulo: string;
  descricao: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
};

export default function Inicio() {
  const { user } = useUserSession();

  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [frequencias, setFrequencias] = useState<FrequenciaAplicacao[]>([]);
  const [fluxos, setFluxos] = useState<Fluxo[]>([]);

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
    carregar("http://localhost:46241/api/fichas", setFichas);
    carregar("http://localhost:46241/api/frequencias", setFrequencias);
    carregar("http://localhost:46241/api/fluxos-avaliacao", setFluxos);
  }, []);

  return (
    <div>
      <div className="flex h-screen w-screen bg-white text-black">
        <Nav />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />

          {/* conteudo */}
          <div className='custom-scrollbar p-[32px] overflow-y-auto'>
            
            {/* instrumento desempenho */}
            <div className='p-6 md:p-8 bg-[#0a1a30] text-white rounded-lg mb-8'>
              
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-2xl bg-[#cd0048] flex items-center justify-center shrink-0'>
                  <span className='text-white font-black text-xl'>192</span>
                </div>

                <div className='text-left'>
                  
                  <div className='flex items-center gap-3 flex-wrap'>
                    <div className='flex items-center gap-2 flex-wrap mb-1'>
                      <h1 className='text-xl md:text-2xl font-bold text-[#f8f8f8]'>Instrumento de Avaliação de Desempenho</h1>
                      <span className='bg-[#cd0048] text-[#fcfcfc] text-xs px-2.5 py-1 rounded-full font-semibold'>360°</span>
                    </div>
                    <span className='inline-flex items-center gap-1.5 bg-[#cd0048]/30 text-[#fcfcfc] text-xs px-2.5 py-1 rounded-full font-medium'>{user?.perfil}</span>
                  </div>

                  <p className='text-[#f8f8f8]/70 text-sm'>Equipes de Intervenção SAMU 192 — CRUR-BF / CISBAF — Baixada Fluminense, RJ</p>
                  <p className='text-[#f8f8f8]/50 text-xs mt-1'>Baseado em bp-TEAM, NTS, Portaria MS 2.048/2002 e Processo de Enfermagem no SAMU (Pizzolato et al., 2023)</p>
                  
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-6'>
                    
                    {fluxos.map((fluxo) => (
                      <div key={fluxo.id} className='bg-sidebar/50 rounded-xl p-3'>
                        <p className='text-[#f8f8f8] text-xs font-semibold'>{fluxo.titulo}</p>
                        <p className='text-[#f8f8f8]/60 text-xs mt-0.5'>{fluxo.descricao}</p>
                      </div>
                    ))}
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
                <a href='/BaixarFicha' className='flex items-center gap-2 px-4 py-2 rounded-xl bg-[#cd0048] text-[#fcfcfc] text-sm font-semibold hover:opacity-90 transition-opacity'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  Baixar Todas as Fichas (PDF)
                </a>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {fichas.map((ficha) => (
                  <FichasCard
                    link={ficha.link}
                    key={ficha.id}
                    icon={ficha.icon}
                    cargo={ficha.nome}
                    criterios={ficha.criterios}
                    tags={ficha.tags}
                  />
                ))}
              </div>
            </div>

            {/* frequencia de aplicação */}
            <div className='mb-8'>
              <h2 className='text-left font-semibold text-foreground mb-3'>Frequência de Aplicação</h2>
              <div className='bg-card rounded-xl overflow-hidden'>
                <FrequenciaTable dados={frequencias} />
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