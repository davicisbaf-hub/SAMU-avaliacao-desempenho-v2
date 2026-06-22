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
  mediaPonderada: number; // nota desta ficha, só dessa categoria
  mediaEvolucao: number; // média acumulada (esta ficha + anteriores) - a "justa"
  classificacao: 'BOM' | 'REGULAR' | 'RUIM'; // baseada na média de evolução
  orientacao: string;
};

type FichaProcessada = {
  id: number;
  criado_em: string;
  categorias: CategoriaProcessada[];
  temProblema: boolean; // baseado na média de evolução
};

type ModalState = { profKey: string; fichaId: number | 'comparativo' } | null;

export default function PlanoDesenvolvimento() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalFicha, setModalFicha] = useState<ModalState>(null);
  const [categoriaAberta, setCategoriaAberta] = useState<Record<string, boolean>>({});

  // filtros
  const [filtroFuncao, setFiltroFuncao] = useState('Todas');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroPendencia, setFiltroPendencia] = useState<'todos' | 'com' | 'sem'>('todos');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await fetch('http://192.168.1.10:8026/api/avaliacoes');
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

  // Extrai itens recursivamente do resultado
  const extrairItens = (
    obj: any,
    path = ''
  ): { path: string; nota: number; categoria?: string; codigo?: string; criterioText?: string; peso?: number }[] => {
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
          });
        }
        res.push(...extrairItens(val, p));
      }
    }
    return res;
  };

  const classificar = (media: number): { classificacao: CategoriaProcessada['classificacao']; orientacao: string } => {
    if (media >= 4) {
      return { classificacao: 'BOM', orientacao: 'Manutenção e aperfeiçoamento. Reconhecimento e incentivo.' };
    }
    if (media >= 3) {
      return {
        classificacao: 'REGULAR',
        orientacao: 'PDI com ações de melhoria. Acompanhamento mensal. Treinamentos específicos.',
      };
    }
    return {
      classificacao: 'RUIM',
      orientacao: 'Intervenção imediata. PDI urgente. Supervisão direta. Afastamento de funções críticas se necessário.',
    };
  };

  const formatarData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Agrupa por profissional e processa cada ficha em ordem cronológica,
  // calculando a média de evolução (acumulada) por categoria
  const porProfissional = useMemo(() => {
    const grupos: Record<string, Avaliacao[]> = {};
    avaliacoes.forEach((aval) => {
      const chave = `${aval.avaliado_nome}|${aval.avaliado_funcao}`;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(aval);
    });

    const resultado: Record<string, { nome: string; funcao: string; fichas: FichaProcessada[] }> = {};

    Object.entries(grupos).forEach(([chave, lista]) => {
      const ordenada = [...lista].sort(
        (a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
      );

      const historicoPorCategoria: Record<string, number[]> = {};
      const fichas: FichaProcessada[] = [];

      for (const aval of ordenada) {
        const itensBrutos = extrairItens(aval.resultado);

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
            return {
              criterio: item.criterioText || item.path,
              codigo: item.codigo,
              nota: item.nota,
              peso,
            };
          });

          const mediaPonderada = somaPeso > 0 ? Number((somaNotaPeso / somaPeso).toFixed(2)) : 0;

          // acumula no histórico dessa categoria pra calcular a média de evolução
          if (!historicoPorCategoria[nomeCat]) historicoPorCategoria[nomeCat] = [];
          historicoPorCategoria[nomeCat].push(mediaPonderada);
          const valoresAcumulados = historicoPorCategoria[nomeCat];
          const mediaEvolucao = Number(
            (valoresAcumulados.reduce((a, b) => a + b, 0) / valoresAcumulados.length).toFixed(2)
          );

          const { classificacao, orientacao } = classificar(mediaEvolucao);

          return {
            nome: nomeCat,
            itens: itensProcessados,
            mediaPonderada,
            mediaEvolucao,
            classificacao,
            orientacao,
          };
        });

        const temProblema = categorias.some((c) => c.classificacao !== 'BOM');

        fichas.push({ id: aval.id, criado_em: aval.criado_em, categorias, temProblema });
      }

      resultado[chave] = {
        nome: ordenada[0].avaliado_nome,
        funcao: ordenada[0].avaliado_funcao,
        fichas,
      };
    });

    return resultado;
  }, [avaliacoes]);

  const toggleCategoria = (chave: string) => {
    setCategoriaAberta((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  // Comparativo por categoria: média de evolução de cada categoria ao longo das fichas
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
    classificacao === 'BOM'
      ? 'bg-green-100 text-green-700'
      : classificacao === 'REGULAR'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  const setaTendencia = (atual: number, anterior: number | null) => {
    if (anterior === null) return null;
    if (atual > anterior) return <span className="text-green-600">▲</span>;
    if (atual < anterior) return <span className="text-red-600">▼</span>;
    return <span className="text-gray-400">▬</span>;
  };

  // ----- Filtros -----
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

  // ----- Modal -----
  const profModal = modalFicha ? porProfissional[modalFicha.profKey] : null;
  const modoComparativo = modalFicha?.fichaId === 'comparativo';
  const fichaModal =
    profModal && !modoComparativo ? profModal.fichas.find((f) => f.id === modalFicha?.fichaId) ?? null : null;
  const idxFichaModal = profModal && fichaModal ? profModal.fichas.findIndex((f) => f.id === fichaModal.id) : -1;

  const comparativoModal = profModal ? montarComparativoCategorias(profModal.fichas) : {};
  const linhasComparativoTodas = Object.entries(comparativoModal);
  const linhasComparativoComProblema = linhasComparativoTodas.filter(([, valores]) =>
    valores.some((v) => v && v.classificacao !== 'BOM')
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
              <select
                value={filtroFuncao}
                onChange={(e) => setFiltroFuncao(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="Todas">Todas</option>
                {funcoesUnicas.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-xs text-gray-500 mb-1">Buscar profissional</label>
              <input
                type="text"
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
                placeholder="Digite o nome..."
                className="border rounded-md px-3 py-2 text-sm bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Pendência (última ficha)</label>
              <select
                value={filtroPendencia}
                onChange={(e) => setFiltroPendencia(e.target.value as 'todos' | 'com' | 'sem')}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
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
              {/* FICHA SÓ COM O COMPARATIVO DE EVOLUÇÃO */}
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
                            <button
                              onClick={() => setModalFicha({ profKey, fichaId: 'comparativo' })}
                              className="text-xl p-1 hover:bg-gray-100 rounded"
                              title="Ver comparativo de evolução"
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FICHAS POR PROFISSIONAL */}
              {profissionaisFiltrados.map(([profKey, prof]) => (
                <div key={profKey} className="bg-white rounded-xl border p-4 mb-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">
                    {prof.funcao} - {prof.nome}
                  </h3>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr className="text-left">
                          <th className="p-3">Ficha</th>
                          <th className="p-3">Data</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 w-16 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prof.fichas.map((ficha, idx) => (
                          <tr key={ficha.id} className="border-t ">
                            <td className="p-3 font-medium">Ficha {idx + 1}</td>
                            <td className="p-3">{formatarData(ficha.criado_em)}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  ficha.temProblema ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {ficha.temProblema ? 'Com pendências' : 'Sem pendências'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => setModalFicha({ profKey, fichaId: ficha.id })}
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
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="border-b p-5 flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {modoComparativo ? 'Comparativo de Evolução' : 'Ficha de Avaliação'}
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
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2">
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Detalhe da ficha específica (só quando não é modo comparativo) */}
              {!modoComparativo && fichaModal && (
                <>
                  {!fichaModal.temProblema ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-700">
                        Desempenho satisfatório (considerando a média de evolução) em todas as categorias nesta ficha.
                      </p>
                    </div>
                  ) : (
                    fichaModal.categorias
                      .filter((c) => c.classificacao !== 'BOM')
                      .map((cat) => {
                        const chaveCat = `${modalFicha.profKey}-${fichaModal.id}-${cat.nome}`;
                        return (
                          <div key={cat.nome} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <strong className="text-gray-800">{cat.nome}</strong>
                                <div className="text-xs text-gray-500 flex gap-3 mt-0.5">
                                  <span>
                                    Nota desta ficha: <span className="font-semibold text-gray-700">{cat.mediaPonderada}</span>
                                  </span>
                                  <span>
                                    Média de evolução: <span className="font-semibold text-gray-700">{cat.mediaEvolucao}</span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClasse(cat.classificacao)}`}>
                                  {cat.classificacao}
                                </span>
                                <button
                                  onClick={() => toggleCategoria(chaveCat)}
                                  className="text-xl p-1 hover:bg-gray-100 rounded"
                                >
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

              {/* Comparativo: linhas filtradas (modo ficha) ou todas (modo comparativo dedicado) */}
              {profModal.fichas.length > 1 &&
                (() => {
                  const linhas = modoComparativo ? linhasComparativoTodas : linhasComparativoComProblema;
                  if (linhas.length === 0) {
                    return modoComparativo ? (
                      <p className="text-sm text-gray-500">Nenhuma categoria registrada ainda.</p>
                    ) : null;
                  }
                  return (
                    <div className={!modoComparativo ? 'pt-4 border-t mt-4' : ''}>
                      <h4 className="font-semibold text-sm mb-3">
                        {modoComparativo ? 'Evolução por categoria (todas as fichas)' : 'Comparativo de evolução (todas as fichas)'}
                      </h4>
                      <div className="border rounded-lg overflow-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr className="text-center">
                              <th className="p-2 text-left">Categoria</th>
                              {profModal.fichas.map((f, idx) => (
                                <th
                                  key={f.id}
                                  className={`p-2 ${
                                    !modoComparativo && fichaModal && f.id === fichaModal.id
                                      ? 'bg-blue-50 text-blue-700'
                                      : ''
                                  }`}
                                >
                                  Ficha {idx + 1}
                                  <div className="text-xs font-normal text-gray-500">{formatarData(f.criado_em)}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {linhas.map(([nomeCat, valores]) => (
                              <tr key={nomeCat} className="border-t">
                                <td className="p-2">{nomeCat}</td>
                                {valores.map((valor, idx) => (
                                  <td
                                    key={idx}
                                    className={`p-2 text-center ${
                                      !modoComparativo && fichaModal && profModal.fichas[idx].id === fichaModal.id
                                        ? 'bg-blue-50'
                                        : ''
                                    }`}
                                  >
                                    {valor ? (
                                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badgeClasse(valor.classificacao)}`}>
                                        {valor.mediaEvolucao} • {valor.classificacao}
                                        {setaTendencia(valor.mediaEvolucao, valores[idx - 1]?.mediaEvolucao ?? null)}
                                      </span>
                                    ) : (
                                      <span className="text-gray-300">—</span>
                                    )}
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