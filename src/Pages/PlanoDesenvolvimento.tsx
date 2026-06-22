import { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import { useUserSession } from '../contexts/UserSession';

type Avaliacao = {
  id: number;
  avaliado_nome: string;
  avaliado_funcao: string;
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
  categorias: CategoriaProcessada[];
  temProblema: boolean;
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

  // acordeons abertos: profKey -> Set de tipos abertos
  const [tiposAbertos, setTiposAbertos] = useState<Record<string, Set<string>>>({});

  // filtros
  const [filtroFuncao, setFiltroFuncao] = useState('Todas');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroPendencia, setFiltroPendencia] = useState<'todos' | 'com' | 'sem'>('todos');
  const [filtroTipoComparativo, setFiltroTipoComparativo] = useState<string>('todos');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await fetch('https://avaliacao360.cisbaf.org.br/api/avaliacoes');
        const dados = await res.json();
        setAvaliacoes(dados);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

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
    }> = {};

    Object.entries(grupos).forEach(([chave, lista]) => {
      const ordenada = [...lista].sort(
        (a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
      );

      // histórico por (tipo + categoria) para evolução separada por tipo
      const historicoPorTipoCategoria: Record<string, Record<string, number[]>> = {};
      const fichas: FichaProcessada[] = [];

      for (const aval of ordenada) {
        const itensBrutos = extrairItens(aval.resultado);

        // detecta tipo da ficha (pega o primeiro avaliacao encontrado)
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

          if (!historicoCat[nomeCat]) historicoCat[nomeCat] = [];
          historicoCat[nomeCat].push(mediaPonderada);
          const mediaEvolucao = Number(
            (historicoCat[nomeCat].reduce((a, b) => a + b, 0) / historicoCat[nomeCat].length).toFixed(2)
          );

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
        fichas.push({ id: aval.id, criado_em: aval.criado_em, tipoAvaliacao, categorias, temProblema });
      }

      // agrupa por tipo
      const porTipo: Record<string, FichaProcessada[]> = {};
      fichas.forEach((f) => {
        if (!porTipo[f.tipoAvaliacao]) porTipo[f.tipoAvaliacao] = [];
        porTipo[f.tipoAvaliacao].push(f);
      });

      resultado[chave] = { nome: ordenada[0].avaliado_nome, funcao: ordenada[0].avaliado_funcao, fichas, porTipo };
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

  const badgeClasse = (classificacao: string) =>
    classificacao === 'BOM' ? 'bg-green-100 text-green-700'
    : classificacao === 'REGULAR' ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';

  const setaTendencia = (atual: number, anterior: number | null) => {
    if (anterior === null) return null;
    if (atual > anterior) return <span className="text-green-600">▲</span>;
    if (atual < anterior) return <span className="text-red-600">▼</span>;
    return <span className="text-gray-400">▬</span>;
  };

  const funcoesUnicas = useMemo(() => {
    const set = new Set(Object.values(porProfissional).map((p) => p.funcao).filter(Boolean));
    return Array.from(set).sort();
  }, [porProfissional]);

  const profissionaisFiltrados = useMemo(() => {
    return Object.entries(porProfissional).filter(([, prof]) => {
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
  }, [porProfissional, filtroFuncao, buscaTexto, filtroPendencia]);

  // modal
  const profModal = modalFicha ? porProfissional[modalFicha.profKey] : null;
  const modoComparativo = modalFicha?.fichaId === 'comparativo';

  // fichas do tipo selecionado (para comparativo filtrado por tipo)
  const fichasDoTipoModal = profModal && modalFicha?.tipoAvaliacao
    ? profModal.porTipo[modalFicha.tipoAvaliacao] ?? profModal.fichas
    : profModal?.fichas ?? [];

  const fichaModal = profModal && !modoComparativo
    ? fichasDoTipoModal.find((f) => f.id === modalFicha?.fichaId) ?? null
    : null;
  const idxFichaModal = fichaModal ? fichasDoTipoModal.findIndex((f) => f.id === fichaModal.id) : -1;

  const comparativoModal = montarComparativoCategorias(fichasDoTipoModal);
  const linhasComparativoTodas = Object.entries(comparativoModal);
  const linhasComparativoComProblema = linhasComparativoTodas.filter(([, valores]) =>
    valores.some((v) => v && v.classificacaoAtual !== 'BOM')
  );

  const fecharModal = () => setModalFicha(null);

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="custom-scrollbar p-[32px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Plano de Desenvolvimento</h2>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 border rounded-lg p-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Função</label>
              <select value={filtroFuncao} onChange={(e) => setFiltroFuncao(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
                <option value="Todas">Todas</option>
                {funcoesUnicas.map((f) => <option key={f} value={f}>{f}</option>)}
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
          </div>

          {carregando ? (
            <div className="text-center py-10 font-medium">Carregando avaliações...</div>
          ) : profissionaisFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum profissional encontrado com esses filtros.</div>
          ) : (
            <>
              {/* COMPARATIVO GERAL */}
              <div className="bg-white rounded-xl border p-4 mb-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Comparativo de Evolução</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr className="text-left">
                        <th className="p-3">Profissional</th>
                        <th className="p-3">Função</th>
                        <th className="p-3 w-16 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profissionaisFiltrados.map(([profKey, prof]) => (
                        <tr key={profKey} className="border-t">
                          <td className="p-3 font-medium">{prof.nome}</td>
                          <td className="p-3 text-gray-600">{prof.funcao}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => { setFiltroTipoComparativo('todos'); setModalFicha({ profKey, fichaId: 'comparativo' });}} className="text-xl p-1 hover:bg-gray-100 rounded" title="Ver comparativo">👁️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FICHAS POR PROFISSIONAL → TIPO → FICHAS */}
              {profissionaisFiltrados.map(([profKey, prof]) => (
                <div key={profKey} className="bg-white rounded-xl border p-4 mb-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">{prof.funcao} — {prof.nome}</h3>

                  <div className="space-y-2">
                    {Object.entries(prof.porTipo).map(([tipo, fichasTipo]) => {
                      const aberto = tiposAbertos[profKey]?.has(tipo) ?? false;
                      const temPendencia = fichasTipo[fichasTipo.length - 1]?.temProblema ?? false;
                      const totalFichas = fichasTipo.length;

                      return (
                        <div key={tipo} className="border rounded-lg overflow-hidden">
                          {/* Linha do tipo — clicável */}
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

                          {/* Fichas expandidas */}
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
                                    <td className="px-4 py-2 font-medium">Ficha {idx + 1}</td>
                                    <td className="px-4 py-2">{formatarData(ficha.criado_em)}</td>
                                    <td className="px-4 py-2">
                                      <span className={`px-2 py-1 rounded text-xs font-semibold ${ficha.temProblema ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                        {ficha.temProblema ? 'Com pendências' : 'Sem pendências'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                      <button
                                        onClick={() => setModalFicha({ profKey, fichaId: ficha.id, tipoAvaliacao: tipo })}
                                        className="text-xl p-1 hover:bg-gray-100 rounded"
                                        title="Ver ficha"
                                      >
                                        👁️
                                      </button>
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

      {/* MODAL */}
      {modalFicha && profModal && (modoComparativo || fichaModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={fecharModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-5 flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {modoComparativo ? 'Comparativo de Evolução' : `Ficha — ${tipoLabel(modalFicha.tipoAvaliacao ?? '')}`}
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
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2">×</button>
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

              {fichasDoTipoModal.length > 1 && (() => {
                const linhas = modoComparativo ? linhasComparativoTodas : linhasComparativoComProblema;
                if (linhas.length === 0) return modoComparativo ? <p className="text-sm text-gray-500">Nenhuma categoria registrada ainda.</p> : null;
                return (
                  <div className={!modoComparativo ? 'pt-4 border-t mt-4' : ''}>
                    <h4 className="font-semibold text-sm mb-3">
                      {modoComparativo ? 'Evolução por categoria (todas as fichas)' : 'Comparativo de evolução (fichas deste tipo)'}
                    </h4>
                    <div className="border rounded-lg overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-center">
                            <th className="p-2 text-left">Tipo</th>
                            <th className="p-2 text-left">Categoria</th>
                            {fichasDoTipoModal.map((f, idx) => (
                              <th key={f.id} className={`p-2 ${!modoComparativo && fichaModal && f.id === fichaModal.id ? 'bg-blue-50 text-blue-700' : ''}`}>
                                Ficha {idx + 1}
                                <div className="text-xs font-normal text-gray-500">{formatarData(f.criado_em)}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {linhas.map(([nomeCat, valores]) => (
                            <tr key={nomeCat} className="border-t">
                              <td className="p-2">{tipoLabel(modalFicha.tipoAvaliacao ?? '')}</td>
                              <td className="p-2">{nomeCat}</td>
                              {valores.map((valor, idx) => (
                                <td key={idx} className={`p-2 text-center ${!modoComparativo && fichaModal && fichasDoTipoModal[idx]?.id === fichaModal.id ? 'bg-blue-50' : ''}`}>
                                  {valor ? (
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badgeClasse(valor.classificacaoEvolucao)}`}>
                                      {valor.mediaEvolucao} • {valor.classificacaoEvolucao}
                                      {setaTendencia(valor.mediaEvolucao, valores[idx - 1]?.mediaEvolucao ?? null)}
                                    </span>
                                  ) : <span className="text-gray-300">—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}