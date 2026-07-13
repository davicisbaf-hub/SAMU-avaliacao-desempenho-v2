import { useRef, useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import { useUserSession } from '../contexts/UserSession';
import { Download, FileDown } from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import { useAuthFetch } from "../hooks/useAuthFetch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Avaliacao = {
  id: number;
  avaliado_nome: string;
  avaliado_funcao: string;
  tipo_avaliacao: string;
  resultado: any;
  criado_em: string;
};

type ItemCriterio = {
  criterio: string;
  codigo?: string;
  nota: number;
  peso: number;
};

type CategoriaProcessada = {
  nome: string;
  itens: ItemCriterio[];
  mediaPonderada: number;
  mediaEvolucao: number;
  classificacaoAtual: 'BOM' | 'REGULAR' | 'RUIM';
  classificacaoEvolucao: 'BOM' | 'REGULAR' | 'RUIM';
  orientacao: string;
};

type FichaProcessada = {
  id: number;
  criado_em: string;
  tipoAvaliacao: string;
  tipoFicha: string;
  categorias: CategoriaProcessada[];
  temProblema: boolean;
};

type EvolucaoConsolidadaItem = {
  categoria: string;
  media: number;
  classificacao: 'BOM' | 'REGULAR' | 'RUIM';
  orientacao: string;
};

type ModalState = { profKey: string; fichaId: number | 'comparativo'; tipoAvaliacao?: string } | null;

const TIPO_LABEL: Record<string, string> = {
  autoavaliacao: 'Autoavaliação',
  'lider_liderado': 'Líder → Liderado',
  'liderado_lider': 'Liderado → Líder',
  'par_par': 'Par → Par',
};

function tipoLabel(tipo: string) {
  return TIPO_LABEL[tipo] ?? tipo.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanoDesenvolvimento() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalFicha, setModalFicha] = useState<ModalState>(null);
  const [categoriaAberta, setCategoriaAberta] = useState<Record<string, boolean>>({});

  const [tiposAbertos, setTiposAbertos] = useState<Record<string, Set<string>>>({});

  const [filtroFuncao, setFiltroFuncao] = useState('Todas');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroPendencia, setFiltroPendencia] = useState<'todos' | 'com' | 'sem'>('todos');
  const [filtroTipoComparativo, setFiltroTipoComparativo] = useState<string>('todos');

  const [filtroTipoFichaModal, setFiltroTipoFichaModal] = useState<string>('todos');

  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const { user } = useUserSession();


  // Refs para impressão
  const fichaPrintRef = useRef<HTMLDivElement>(null);
  const comparativoPrintRef = useRef<HTMLDivElement>(null);
  
  const { authFetch } = useAuthFetch();

  
  const [filtroBase, setFiltroBase] = useState(user?.perfil === '🔑 Administrador - Todas as bases' ? '' : user?.base);


  const [bases, setBases] = useState<string[]>([]);
  
  useEffect(() => {
    async function carregarBases() {
      try {
        const res = await authFetch("/api/bases");
        const dados = await res.json();

        setBases(dados.map((b: any) => b.nome));
      } catch (err) {
        console.error(err);
      }
    }

    carregarBases();
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);

        const url = filtroBase
          ? `/api/avaliacoes?base=${encodeURIComponent(filtroBase)}`
          : "/api/avaliacoes";

        const res = await authFetch(url);
        const dados = await res.json();
        setAvaliacoes(dados);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [filtroBase]);

  const extrairItens = (
    obj: any,
    path = ''
  ): { path: string; nota: number; categoria?: string; codigo?: string; criterioText?: string; peso?: number; avaliacao?: string }[] => {
    const res: any[] = [];
    if (!obj || typeof obj !== 'object') return res;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const p = path ? `${path}.${key}` : key;
      if (val && typeof val === 'object') {
        if ('nota' in val && typeof val.nota === 'number') {
          res.push({
            path: p,
            nota: val.nota,
            categoria: val.categoria,
            codigo: val.codigo,
            criterioText: val.criterio || key,
            peso: typeof val.peso === 'number' ? val.peso : undefined,
            avaliacao: val.avaliacao,
          });
        }
        res.push(...extrairItens(val, p));
      }
    }
    return res;
  };

  const classificar = (media: number): { classificacao: 'BOM' | 'REGULAR' | 'RUIM'; orientacao: string } => {
    if (media >= 4) return { classificacao: 'BOM', orientacao: 'Manutenção e aperfeiçoamento. Reconhecimento e incentivo.' };
    if (media >= 3) return { classificacao: 'REGULAR', orientacao: 'PDI com ações de melhoria. Acompanhamento mensal. Treinamentos específicos.' };
    return { classificacao: 'RUIM', orientacao: 'Intervenção imediata. PDI urgente. Supervisão direta. Afastamento de funções críticas se necessário.' };
  };

  const formatarData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const porProfissional = useMemo(() => {
    const grupos: Record<string, Avaliacao[]> = {};
    avaliacoes.forEach((aval) => {
      const chave = `${aval.avaliado_nome}|${aval.avaliado_funcao}`;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(aval);
    });

    const resultado: Record<string, {
      nome: string;
      funcao: string;
      fichas: FichaProcessada[];
      porTipo: Record<string, FichaProcessada[]>;
      porTipoFicha: Record<string, FichaProcessada[]>;
    }> = {};

    Object.entries(grupos).forEach(([chave, lista]) => {
      const ordenada = [...lista].sort(
        (a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
      );

      const historicoPorTipoCategoria: Record<string, Record<string, { somaNotaPeso: number; somaPeso: number }>> = {};
      const fichas: FichaProcessada[] = [];

      for (const aval of ordenada) {
        const itensBrutos = extrairItens(aval.resultado);
        const tipoAvaliacao = itensBrutos.find((i) => i.avaliacao)?.avaliacao ?? 'desconhecido';

        if (!historicoPorTipoCategoria[tipoAvaliacao]) historicoPorTipoCategoria[tipoAvaliacao] = {};
        const historicoCat = historicoPorTipoCategoria[tipoAvaliacao];

        const porCategoria: Record<string, typeof itensBrutos> = {};
        itensBrutos.forEach((item) => {
          const cat = item.categoria || 'Sem categoria';
          if (!porCategoria[cat]) porCategoria[cat] = [];
          porCategoria[cat].push(item);
        });

        const categorias: CategoriaProcessada[] = Object.entries(porCategoria).map(([nomeCat, itens]) => {
          let somaNotaPeso = 0;
          let somaPeso = 0;

          const itensProcessados: ItemCriterio[] = itens.map((item) => {
            const peso = typeof item.peso === 'number' && item.peso > 0 ? item.peso : 1;
            somaNotaPeso += item.nota * peso;
            somaPeso += peso;
            return { criterio: item.criterioText || item.path, codigo: item.codigo, nota: item.nota, peso };
          });

          const mediaPonderada = somaPeso > 0 ? Number((somaNotaPeso / somaPeso).toFixed(2)) : 0;

          if (!historicoCat[nomeCat]) historicoCat[nomeCat] = { somaNotaPeso: 0, somaPeso: 0 };
          historicoCat[nomeCat].somaNotaPeso += somaNotaPeso;
          historicoCat[nomeCat].somaPeso += somaPeso;
          const mediaEvolucao = historicoCat[nomeCat].somaPeso > 0
            ? Number((historicoCat[nomeCat].somaNotaPeso / historicoCat[nomeCat].somaPeso).toFixed(2))
            : 0;

          const atual = classificar(mediaPonderada);
          const evolucao = classificar(mediaEvolucao);

          return {
            nome: nomeCat,
            itens: itensProcessados,
            mediaPonderada,
            mediaEvolucao,
            classificacaoAtual: atual.classificacao,
            classificacaoEvolucao: evolucao.classificacao,
            orientacao: evolucao.orientacao,
          };
        });

        const temProblema = categorias.some((c) => c.classificacaoAtual !== 'BOM');
        fichas.push({
          id: aval.id,
          criado_em: aval.criado_em,
          tipoAvaliacao,
          tipoFicha: aval.tipo_avaliacao,
          categorias,
          temProblema,
        });
      }

      const porTipo: Record<string, FichaProcessada[]> = {};
      const porTipoFicha: Record<string, FichaProcessada[]> = {};
      
      fichas.forEach((f) => {
        if (!porTipo[f.tipoAvaliacao]) porTipo[f.tipoAvaliacao] = [];
        porTipo[f.tipoAvaliacao].push(f);
        
        if (!porTipoFicha[f.tipoFicha]) porTipoFicha[f.tipoFicha] = [];
        porTipoFicha[f.tipoFicha].push(f);
      });

      resultado[chave] = { 
        nome: ordenada[0].avaliado_nome, 
        funcao: ordenada[0].avaliado_funcao, 
        fichas, 
        porTipo,
        porTipoFicha
      };
    });

    return resultado;
  }, [avaliacoes]);

  const toggleTipo = (profKey: string, tipo: string) => {
    setTiposAbertos((prev) => {
      const atual = new Set(prev[profKey] ?? []);
      if (atual.has(tipo)) atual.delete(tipo); else atual.add(tipo);
      return { ...prev, [profKey]: atual };
    });
  };

  const toggleCategoria = (chave: string) => {
    setCategoriaAberta((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  const montarComparativoCategorias = (fichas: FichaProcessada[]) => {
    const linhas: Record<string, (CategoriaProcessada | null)[]> = {};
    fichas.forEach((ficha, idx) => {
      ficha.categorias.forEach((cat) => {
        if (!linhas[cat.nome]) linhas[cat.nome] = Array(fichas.length).fill(null);
        linhas[cat.nome][idx] = cat;
      });
    });
    return linhas;
  };

  const calcularEvolucaoConsolidada = (fichas: FichaProcessada[]): EvolucaoConsolidadaItem[] => {
    const agrupado: Record<string, { somaNotaPeso: number; somaPeso: number }> = {};

    fichas.forEach((ficha) => {
      ficha.categorias.forEach((cat) => {
        if (!agrupado[cat.nome]) agrupado[cat.nome] = { somaNotaPeso: 0, somaPeso: 0 };
        cat.itens.forEach((item) => {
          agrupado[cat.nome].somaNotaPeso += item.nota * item.peso;
          agrupado[cat.nome].somaPeso += item.peso;
        });
      });
    });

    return Object.entries(agrupado).map(([categoria, dados]) => {
      const media = dados.somaPeso > 0 ? Number((dados.somaNotaPeso / dados.somaPeso).toFixed(2)) : 0;
      const { classificacao, orientacao } = classificar(media);
      return { categoria, media, classificacao, orientacao };
    });
  };

  const badgeClasse = (classificacao: string) =>
    classificacao === 'BOM' ? 'bg-green-100 text-green-700'
      : classificacao === 'REGULAR' ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';

  const funcoesUnicas = useMemo(() => {
    const set = new Set(Object.values(porProfissional).map((p) => p.funcao).filter(Boolean));
    return Array.from(set).sort();
  }, [porProfissional]);

  // Função para verificar se uma ficha está no período selecionado
  const fichaNoPeriodo = (ficha: FichaProcessada) => {
    if (!dataInicio && !dataFim) return true;
    
    const dataFicha = new Date(ficha.criado_em);
    // Normaliza a data da ficha para comparar apenas a data (sem hora)
    const dataFichaNormalizada = new Date(dataFicha.getFullYear(), dataFicha.getMonth(), dataFicha.getDate());
    
    if (dataInicio) {
      const dataInicioNormalizada = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
      if (dataFichaNormalizada < dataInicioNormalizada) return false;
    }
    
    if (dataFim) {
      const dataFimNormalizada = new Date(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate());
      if (dataFichaNormalizada > dataFimNormalizada) return false;
    }
    
    return true;
  };

  // Função para filtrar fichas por período
  const filtrarFichasPorPeriodo = (fichas: FichaProcessada[]) => {
    return fichas.filter(ficha => fichaNoPeriodo(ficha));
  };

  const profissionaisFiltrados = useMemo(() => {
    return Object.entries(porProfissional)
      .map(([key, prof]) => {
        // Filtra as fichas do profissional pelo período
        const fichasFiltradas = filtrarFichasPorPeriodo(prof.fichas);
        
        // Se não houver fichas no período, não mostra o profissional
        if (fichasFiltradas.length === 0) return null;
        
        // Recria as estruturas porTipo e porTipoFicha com as fichas filtradas
        const porTipo: Record<string, FichaProcessada[]> = {};
        const porTipoFicha: Record<string, FichaProcessada[]> = {};
        
        fichasFiltradas.forEach((f) => {
          if (!porTipo[f.tipoAvaliacao]) porTipo[f.tipoAvaliacao] = [];
          porTipo[f.tipoAvaliacao].push(f);
          
          if (!porTipoFicha[f.tipoFicha]) porTipoFicha[f.tipoFicha] = [];
          porTipoFicha[f.tipoFicha].push(f);
        });

        return {
          key,
          prof: {
            ...prof,
            fichas: fichasFiltradas,
            porTipo,
            porTipoFicha
          }
        };
      })
      .filter((item): item is { key: string; prof: any } => item !== null)
      .filter(({ prof }) => {
        // Aplica os outros filtros
        if (filtroFuncao !== 'Todas' && prof.funcao !== filtroFuncao) return false;

        if (buscaTexto.trim()) {
          const termo = buscaTexto.trim().toLowerCase();
          if (!prof.nome.toLowerCase().includes(termo)) return false;
        }

        if (filtroPendencia !== 'todos') {
          const ultimaFicha = prof.fichas[prof.fichas.length - 1];
          const temPendenciaAtual = ultimaFicha ? ultimaFicha.temProblema : false;
          if (filtroPendencia === 'com' && !temPendenciaAtual) return false;
          if (filtroPendencia === 'sem' && temPendenciaAtual) return false;
        }

        return true;
      });
  }, [porProfissional, filtroFuncao, buscaTexto, filtroPendencia, dataInicio, dataFim]);

  const profModal = modalFicha ? porProfissional[modalFicha.profKey] : null;
  const modoComparativo = modalFicha?.fichaId === 'comparativo';

  const fichasDoTipoModal = profModal && modalFicha?.tipoAvaliacao
    ? profModal.porTipo[modalFicha.tipoAvaliacao] ?? profModal.fichas
    : profModal?.fichas ?? [];

  const fichaModal = profModal && !modoComparativo
    ? fichasDoTipoModal.find((f) => f.id === modalFicha?.fichaId) ?? null
    : null;
  const idxFichaModal = fichaModal ? fichasDoTipoModal.findIndex((f) => f.id === fichaModal.id) : -1;

  const fecharModal = () => {
    setModalFicha(null);
    setFiltroTipoFichaModal('todos');
  };

  const imprimirFicha = useReactToPrint({
    contentRef: fichaPrintRef,
    documentTitle: `Ficha-${profModal?.nome}-${fichaModal?.id}`,
  });

  const imprimirComparativo = useReactToPrint({
    contentRef: comparativoPrintRef,
    documentTitle: `Comparativo-${profModal?.nome}`,
  });

  const profissionalTemPendencia = (prof: any) => {
    const ultimaFicha = prof.fichas[prof.fichas.length - 1];
    return ultimaFicha ? ultimaFicha.temProblema : false;
  };

  const obterFichasComparativoFiltradas = (prof: { fichas: FichaProcessada[]; porTipoFicha: Record<string, FichaProcessada[]> }) => {
    let fichasParaComparativo = filtroTipoFichaModal === 'todos'
      ? prof.fichas
      : (prof.porTipoFicha[filtroTipoFichaModal] ?? []);

    // As fichas já estão filtradas pelo período, mas aplicamos novamente por segurança
    if (dataInicio || dataFim) {
      fichasParaComparativo = fichasParaComparativo.filter(ficha => fichaNoPeriodo(ficha));
    }

    return fichasParaComparativo;
  };

  const prepararDadosGrafico = (fichas: FichaProcessada[]) => {
    if (fichas.length === 0) return { dadosGrafico: [], categorias: [] };
    
    const categoriasMap: Record<string, { nome: string; notas: number[] }> = {};
    
    fichas.forEach((ficha) => {
      ficha.categorias.forEach((cat) => {
        if (!categoriasMap[cat.nome]) {
          categoriasMap[cat.nome] = { 
            nome: cat.nome, 
            notas: []
          };
        }
        categoriasMap[cat.nome].notas.push(cat.mediaPonderada);
      });
    });

    const dadosGrafico = fichas.map((ficha, idx) => {
      const ponto: any = { 
        nome: `Ficha ${idx + 1}`,
        data: formatarData(ficha.criado_em),
        tipo: ficha.tipoFicha
      };
      
      Object.entries(categoriasMap).forEach(([nomeCat]) => {
        ponto[nomeCat] = categoriasMap[nomeCat].notas[idx] || 0;
      });
      
      return ponto;
    });

    return { dadosGrafico, categorias: Object.keys(categoriasMap) };
  };

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="custom-scrollbar p-[32px] overflow-y-auto">
          <h2 className="text-2xl font-bold text-left">Plano de Desenvolvimento Individual (PDI)</h2>
          <p className="mb-4 text-left text-[16px] text-gray-700">Planos de ação baseados nas lacunas identificadas nas avaliações 360° e simulações bp-TEAM. Cada PDI deve ser elaborado conjuntamente com o profissional e acompanhado mensalmente.</p>

          <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 border rounded-lg p-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Função</label>
              <select value={filtroFuncao} onChange={(e) => setFiltroFuncao(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
                <option value="Todas">Todas</option>
                {funcoesUnicas.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Base</label>
              <select
                disabled={user?.perfil !== '🔑 Administrador - Todas as bases'}
                value={filtroBase}
                onChange={(e) => setFiltroBase(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="">Todas</option>

                {bases.map((base) => (
                  <option key={base} value={base}>
                    {base}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-xs text-gray-500 mb-1">Buscar profissional</label>
              <input type="text" value={buscaTexto} onChange={(e) => setBuscaTexto(e.target.value)} placeholder="Digite o nome..." className="border rounded-md px-3 py-2 text-sm bg-white" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Pendência (última ficha)</label>
              <select value={filtroPendencia} onChange={(e) => setFiltroPendencia(e.target.value as any)} className="border rounded-md px-3 py-2 text-sm bg-white">
                <option value="todos">Todos</option>
                <option value="com">Com pendências</option>
                <option value="sem">Sem pendências</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Data Início</label>
              <DatePicker
                selected={dataInicio}
                onChange={(date: any) => setDataInicio(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione..."
                className="border rounded-md px-3 py-2 text-sm bg-white w-[140px]"
                locale={ptBR}
                isClearable
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Data Fim</label>
              <DatePicker
                selected={dataFim}
                onChange={(date: any) => setDataFim(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione..."
                className="border rounded-md px-3 py-2 text-sm bg-white w-[140px]"
                locale={ptBR}
                isClearable
              />
            </div>

            {(dataInicio || dataFim) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setDataInicio(null);
                    setDataFim(null);
                  }}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Limpar datas
                </button>
              </div>
            )}
          </div>

          {carregando ? (
            <div className="text-center py-10 font-medium">Carregando avaliações...</div>
          ) : profissionaisFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {dataInicio || dataFim ? 'Nenhum profissional encontrado no período selecionado.' : 'Nenhum profissional encontrado com esses filtros.'}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border p-4 mb-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Comparativo de Evolução</h3>
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr className="text-center">
                        <th className="p-3">Profissional</th>
                        <th className="p-3">Função</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 w-16">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profissionaisFiltrados.map(({ key: profKey, prof }) => {
                        const temPendencia = profissionalTemPendencia(prof);
                        return (
                          <tr key={profKey} className="border-t">
                            <td className="p-3 font-medium">{prof.nome}</td>
                            <td className="p-3 text-gray-600">{prof.funcao}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${temPendencia ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {temPendencia ? 'Com pendências' : 'Sem pendências'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setFiltroTipoComparativo('todos');
                                  setFiltroTipoFichaModal('todos');
                                  setModalFicha({ profKey, fichaId: 'comparativo' });
                                }}
                                className="text-xl p-1 hover:bg-gray-100 rounded"
                                title="Ver comparativo"
                              >
                                👁️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {profissionaisFiltrados.map(({ key: profKey, prof }) => (
                <div key={profKey} className="bg-white rounded-xl border p-4 mb-6 shadow-sm">
                  <h3 className="font-bold text-lg text-left mb-4">{prof.funcao} - {prof.nome}</h3>

                  <div className="space-y-2">
                    {Object.entries(prof.porTipo).map(([tipo, fichasTipo]) => {
                      const aberto = tiposAbertos[profKey]?.has(tipo) ?? false;
                      const temPendencia = fichasTipo[fichasTipo.length - 1]?.temProblema ?? false;
                      const totalFichas = fichasTipo.length;

                      return (
                        <div key={tipo} className="border rounded-lg overflow-x-auto">
                          <button
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            onClick={() => toggleTipo(profKey, tipo)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-800">{tipoLabel(tipo)}</span>
                              <span className="text-xs text-gray-400">{totalFichas} ficha{totalFichas !== 1 ? 's' : ''}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${temPendencia ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {temPendencia ? 'Com pendências' : 'Sem pendências'}
                              </span>
                            </div>
                            <span className="text-gray-400 text-sm">{aberto ? '▲' : '▼'}</span>
                          </button>

                          {aberto && (
                            <table className="w-full text-sm">
                              <thead className="bg-white border-t">
                                <tr className="text-left text-gray-500">
                                  <th className="px-4 py-2">Ficha</th>
                                  <th className="px-4 py-2">Data</th>
                                  <th className="px-4 py-2">Status</th>
                                  <th className="px-4 py-2 w-16 text-center">Ação</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fichasTipo.map((ficha, idx) => (
                                  <tr key={ficha.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">Ficha {idx + 1} - {ficha.tipoFicha}</td>
                                    <td className="px-4 py-2">{formatarData(ficha.criado_em)}</td>
                                    <td className="px-4 py-2">
                                      <span className={`px-2 py-1 rounded text-xs font-semibold ${ficha.temProblema ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                        {ficha.temProblema ? 'Com pendências' : 'Sem pendências'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          onClick={() =>
                                            setModalFicha({
                                              profKey,
                                              fichaId: ficha.id,
                                              tipoAvaliacao: tipo,
                                            })
                                          }
                                          className="text-xl p-1 hover:bg-gray-100 rounded"
                                          title="Ver ficha"
                                        >
                                          👁️
                                        </button>

                                        <button
                                          onClick={() => {
                                            setModalFicha({
                                              profKey,
                                              fichaId: ficha.id,
                                              tipoAvaliacao: tipo,
                                            });
                                            setTimeout(() => {
                                              imprimirFicha();
                                            }, 200);
                                          }}
                                          className="text-xl p-1 hover:bg-gray-100 rounded"
                                          title="Imprimir"
                                        >
                                          🖨️
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {modalFicha && profModal && (modoComparativo || fichaModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={fecharModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-5 flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {modoComparativo
                    ? 'Comparativo de Evolução'
                    : `Ficha - ${tipoLabel(fichaModal?.tipoAvaliacao ?? '')} - ${fichaModal?.tipoFicha ?? ''}`}
                </p>
                <h3 className="font-bold text-xl">{profModal.nome}</h3>
                <p className="text-sm text-gray-600">{profModal.funcao}</p>
                {!modoComparativo && fichaModal && (
                  <p className="text-sm text-gray-500 mt-1">
                    Ficha {idxFichaModal + 1} • {formatarData(fichaModal.criado_em)}
                  </p>
                )}
                {modoComparativo && (
                  <p className="text-sm text-gray-500 mt-1">{profModal.fichas.length} ficha(s) registradas</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {modoComparativo && (
                  <button
                    onClick={() => {
                      imprimirComparativo();
                    }}
                    className="px-3 py-2 hover:bg-gray-100 rounded"
                    title="Imprimir"
                  >
                    🖨️
                  </button>
                )}

                {!modoComparativo && fichaModal && (
                  <button
                    onClick={() => {
                      imprimirFicha();
                    }}
                    className="px-3 py-2 hover:bg-gray-100 rounded"
                    title="Imprimir"
                  >
                    🖨️
                  </button>
                )}

                <button
                  onClick={fecharModal}
                  className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {!modoComparativo && fichaModal && (
                <>
                  {!fichaModal.temProblema ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-700">Desempenho satisfatório em todas as categorias nesta ficha.</p>
                    </div>
                  ) : (
                    fichaModal.categorias.filter((c) => c.classificacaoAtual !== 'BOM').map((cat) => {
                      const chaveCat = `${modalFicha.profKey}-${fichaModal.id}-${cat.nome}`;
                      return (
                        <div key={cat.nome} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <strong className="text-gray-800">{cat.nome}</strong>
                              <div className="text-xs text-gray-500 flex gap-3 mt-0.5">
                                <span>Nota desta ficha: <span className="font-semibold text-gray-700">{cat.mediaPonderada}</span></span>
                                <span>Média de evolução: <span className="font-semibold text-gray-700">{cat.mediaEvolucao}</span></span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClasse(cat.classificacaoAtual)}`}>{cat.classificacaoAtual}</span>
                              <button onClick={() => toggleCategoria(chaveCat)} className="text-xl p-1 hover:bg-gray-100 rounded">
                                {categoriaAberta[chaveCat] ? '👁️‍🗨️' : '👁️'}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">{cat.orientacao}</p>
                          {categoriaAberta[chaveCat] && (
                            <div className="mt-3 border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                  <tr className="text-center">
                                    <th className="p-2 text-left">Critério</th>
                                    <th className="p-2 w-20">Nota</th>
                                    <th className="p-2 w-20">Peso</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cat.itens.map((item) => (
                                    <tr key={`${cat.nome}-${item.codigo || item.criterio}`} className="border-t">
                                      <td className="p-2 text-left">{item.criterio}</td>
                                      <td className="p-2 text-center font-semibold">{item.nota}</td>
                                      <td className="p-2 text-center text-gray-600">{item.peso}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {modoComparativo && (() => {
                const tiposFichaDisponiveis = Object.keys(profModal.porTipoFicha);
                const fichasParaComparativo = obterFichasComparativoFiltradas(profModal);
                const comparativoFiltrado = montarComparativoCategorias(fichasParaComparativo);
                const linhas = Object.entries(comparativoFiltrado);
                
                const { dadosGrafico, categorias } = prepararDadosGrafico(fichasParaComparativo);
                
                const CORES = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#4b5563'];

                return (
                  <div>
                    <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg border">
                      <label className="text-sm font-medium text-gray-700">Filtrar por tipo de ficha:</label>
                      <select
                        value={filtroTipoFichaModal}
                        onChange={(e) => setFiltroTipoFichaModal(e.target.value)}
                        className="border rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="todos">Todas as fichas</option>
                        {tiposFichaDisponiveis.map((tipoFicha) => (
                          <option key={tipoFicha} value={tipoFicha}>
                            {tipoFicha}
                          </option>
                        ))}
                      </select>
                      
                      <span className="text-sm text-gray-500 ml-auto">
                        {fichasParaComparativo.length} ficha(s) {filtroTipoFichaModal !== 'todos' && `do tipo ${filtroTipoFichaModal}`}
                        {(dataInicio || dataFim) && ' no período selecionado'}
                      </span>
                    </div>

                    {fichasParaComparativo.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Nenhuma ficha encontrada com os filtros aplicados.</p>
                        {(dataInicio || dataFim) && (
                          <button
                            onClick={() => {
                              setDataInicio(null);
                              setDataFim(null);
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Limpar filtros de data
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {filtroTipoFichaModal !== 'todos' && fichasParaComparativo.length > 1 && dadosGrafico.length > 0 && categorias.length > 0 && (
                          <div className="mb-6 p-4 bg-white border rounded-lg">
                            <h4 className="font-semibold text-sm text-gray-700 mb-4">
                              Evolução por Categoria - {filtroTipoFichaModal}
                            </h4>
                            <div className="h-[300px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={dadosGrafico}
                                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                    dataKey="nome" 
                                    label={{ value: 'Fichas', position: 'insideBottom', offset: -5 }}
                                  />
                                  <YAxis 
                                    domain={[0, 5]} 
                                    label={{ value: 'Nota', angle: -90, position: 'insideLeft' }}
                                  />
                                  <Tooltip 
                                    formatter={(value: number) => value.toFixed(2)}
                                    labelFormatter={(label) => {
                                      const item = dadosGrafico.find(d => d.nome === label);
                                      return `${label}${item?.data ? ` (${item.data})` : ''}`;
                                    }}
                                  />
                                  <Legend />
                                  {categorias.map((categoria, index) => (
                                    <Line
                                      key={categoria}
                                      type="monotone"
                                      dataKey={categoria}
                                      stroke={CORES[index % CORES.length]}
                                      strokeWidth={2}
                                      dot={{ r: 4 }}
                                      activeDot={{ r: 6 }}
                                    />
                                  ))}
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="mt-2 text-xs text-gray-500 text-center">
                              Mostrando {fichasParaComparativo.length} ficha(s) do tipo {filtroTipoFichaModal}
                            </div>
                          </div>
                        )}

                        <div className="border rounded-lg overflow-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr className="text-center">
                                <th className="p-2 text-center">Categoria</th>
                                {fichasParaComparativo.map((f, idx) => (
                                  <th key={f.id} className="p-2 min-w-[100px]">
                                    <div className="font-semibold">Ficha {idx + 1}</div>
                                    <div className="text-xs font-normal text-gray-500">{f.tipoFicha}</div>
                                    <div className="text-xs font-normal text-gray-500">{formatarData(f.criado_em)}</div>
                                    {f.temProblema && (
                                      <div className="text-xs font-semibold text-amber-600">⚠️ Pendência</div>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {linhas.map(([nomeCat, valores]) => (
                                <tr key={nomeCat} className="border-t">
                                  <td className="p-2 whitespace-nowrap font-medium">{nomeCat}</td>
                                  {valores.map((valor, idx) => (
                                    <td key={idx} className="p-2 text-center">
                                      {valor ? (
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badgeClasse(valor.classificacaoAtual)}`}>
                                          {valor.mediaPonderada} • {valor.classificacaoAtual}
                                        </span>
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Elemento oculto para impressão - Ficha */}
      <div style={{ display: 'none' }}>
        <div ref={fichaPrintRef}>
          {fichaModal && profModal && (
            <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                Ficha de Avaliação
              </h1>

              <div style={{ marginBottom: '20px' }}>
                <p><strong>Profissional:</strong> {profModal.nome}</p>
                <p><strong>Função:</strong> {profModal.funcao}</p>
                <p><strong>Tipo de Avaliação:</strong> {tipoLabel(fichaModal.tipoAvaliacao)}</p>
                <p><strong>Ficha:</strong> {fichaModal.tipoFicha}</p>
                <p><strong>Data:</strong> {formatarData(fichaModal.criado_em)}</p>
                <p><strong>Status:</strong> {fichaModal.temProblema ? '⚠️ Com pendências' : '✅ Sem pendências'}</p>
              </div>

              <hr style={{ marginBottom: '20px' }} />

              {fichaModal.categorias.map((cat) => (
                <div key={cat.nome} style={{ marginBottom: '25px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{cat.nome}</h3>

                  <div style={{ marginBottom: '10px' }}>
                    <p><strong>Nota:</strong> {cat.mediaPonderada}</p>
                    <p><strong>Classificação:</strong> {cat.classificacaoAtual}</p>
                    <p><strong>Orientação:</strong> {cat.orientacao}</p>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Critério</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', width: '80px' }}>Nota</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', width: '80px' }}>Peso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.itens.map((item) => (
                        <tr key={item.criterio}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.criterio}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.nota}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.peso}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ccc', fontSize: '12px', color: '#666' }}>
                <p>Documento gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Elemento oculto para impressão - Comparativo */}
      <div style={{ display: 'none' }} >
        <div ref={comparativoPrintRef}>
          {profModal && modoComparativo && (
            <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                Comparativo de Evolução
              </h1>

              <div style={{ marginBottom: '20px' }} p-4>
                <p><strong>Profissional:</strong> {profModal.nome}</p>
                <p><strong>Função:</strong> {profModal.funcao}</p>
                <p><strong>Status atual:</strong> {profissionalTemPendencia(profModal) ? '⚠️ Com pendências' : '✅ Sem pendências'}</p>
                <p><strong>Total de fichas:</strong> {profModal.fichas.length}</p>
              </div>

              <hr style={{ marginBottom: '20px' }} />

              {(() => {
                const fichasParaComparativo = obterFichasComparativoFiltradas(profModal);
                const comparativoFiltrado = montarComparativoCategorias(fichasParaComparativo);
                const linhas = Object.entries(comparativoFiltrado);
                const evolucaoConsolidada = calcularEvolucaoConsolidada(fichasParaComparativo);
                const { dadosGrafico, categorias } = prepararDadosGrafico(fichasParaComparativo);
                const CORES = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#4b5563'];

                return (
                  <div>
                    {fichasParaComparativo.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666' }}>Nenhuma ficha encontrada com os filtros aplicados.</p>
                    ) : (
                      <>
                        {/* GRÁFICO na impressão */}
                        {filtroTipoFichaModal !== 'todos' && fichasParaComparativo.length > 1 && dadosGrafico.length > 0 && categorias.length > 0 && (
                          <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                              Evolução por Categoria - {filtroTipoFichaModal}
                            </h4>
                            <div style={{ width: '100%', height: '300px' }}>
                              <LineChart
                                width={900}
                                height={300}
                                data={dadosGrafico}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nome" label={{ value: 'Fichas', position: 'insideBottom', offset: -5 }} />
                                <YAxis domain={[0, 5]} label={{ value: 'Nota', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                {categorias.map((categoria, index) => (
                                  <Line
                                    key={categoria}
                                    type="monotone"
                                    dataKey={categoria}
                                    stroke={CORES[index % CORES.length]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                  />
                                ))}
                              </LineChart>
                            </div>
                          </div>
                        )}

                        {/* Tabela comparativa */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f0f0f0' }}>
                              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', minWidth: '150px' }}>Categoria</th>
                              {fichasParaComparativo.map((f, idx) => (
                                <th key={f.id} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                  Ficha {idx + 1} - {f.tipoFicha}
                                  <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>
                                    {formatarData(f.criado_em)}
                                  </div>
                                  {f.temProblema && (
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#d97706', marginTop: '2px' }}>
                                      ⚠️ Com pendência
                                    </div>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {linhas.map(([nomeCat, valores]) => (
                              <tr key={nomeCat} style={{ borderTop: '1px solid #ddd' }}>
                                <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>{nomeCat}</td>
                                {valores.map((valor, idx) => (
                                  <td key={idx} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                    {valor ? (
                                      <div>
                                        <div style={{ fontWeight: 'bold' }}>{valor.mediaPonderada}</div>
                                        <div style={{ fontSize: '12px' }}>{valor.classificacaoAtual}</div>
                                      </div>
                                    ) : (
                                      <span style={{ color: '#999' }}>-</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Evolução Consolidada */}
                        {evolucaoConsolidada.length > 0 && (
                          <div style={{ marginTop: '25px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Evolução Consolidada</h2>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                              Soma de todas as notas das fichas acima, dividida pela quantidade total de critérios avaliados por categoria.
                            </p>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                  <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Categoria</th>
                                  <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', width: '120px' }}>Média Consolidada</th>
                                  <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', width: '100px' }}>Classificação</th>
                                </tr>
                              </thead>
                              <tbody>
                                {evolucaoConsolidada.map((item) => (
                                  <tr key={item.categoria}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.categoria}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{item.media}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.classificacao}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <p><strong>Legenda:</strong></p>
                <p>• BOM: Manutenção e aperfeiçoamento</p>
                <p>• REGULAR: PDI com ações de melhoria</p>
                <p>• RUIM: Intervenção imediata</p>
              </div>

              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ccc', fontSize: '12px', color: '#666' }}>
                <p>Documento gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}