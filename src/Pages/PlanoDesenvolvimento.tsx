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
  classificacao: 'BOM' | 'REGULAR' | 'RUIM';
};

type CategoriaProcessada = {
  nome: string;
  itens: ItemCriterio[];
  mediaPonderada: number;
  classificacao: 'BOM' | 'REGULAR' | 'RUIM';
  orientacao: string;
};

type FichaProcessada = {
  id: number;
  criado_em: string;
  categorias: CategoriaProcessada[];
  temProblema: boolean;
};

export default function PlanoDesenvolvimento() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  // qual ficha está aberta na modal: { profKey, fichaId }
  const [modalFicha, setModalFicha] = useState<{ profKey: string; fichaId: number } | null>(null);
  // expand/collapse dos critérios dentro de uma categoria, dentro da modal
  const [categoriaAberta, setCategoriaAberta] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await fetch('http://localhost:3001/api/avaliacoes');
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

  const classificar = (media: number): { classificacao: ItemCriterio['classificacao']; orientacao: string } => {
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

  // Agrupa por profissional e processa CADA ficha individualmente, com média ponderada por categoria
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

      const fichas: FichaProcessada[] = ordenada.map((aval) => {
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
            const { classificacao } = classificar(item.nota);
            return {
              criterio: item.criterioText || item.path,
              codigo: item.codigo,
              nota: item.nota,
              peso,
              classificacao,
            };
          });

          const mediaPonderada = somaPeso > 0 ? Number((somaNotaPeso / somaPeso).toFixed(2)) : 0;
          const { classificacao, orientacao } = classificar(mediaPonderada);

          return {
            nome: nomeCat,
            itens: itensProcessados,
            mediaPonderada,
            classificacao,
            orientacao,
          };
        });

        const temProblema = categorias.some((c) => c.classificacao !== 'BOM');

        return { id: aval.id, criado_em: aval.criado_em, categorias, temProblema };
      });

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

  // Comparativo por categoria: média ponderada de cada categoria ao longo das fichas
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

  // Dados do que está aberto na modal (calculado fora do map dos profissionais)
  const profModal = modalFicha ? porProfissional[modalFicha.profKey] : null;
  const fichaModal = profModal?.fichas.find((f) => f.id === modalFicha?.fichaId) || null;
  const idxFichaModal = profModal && fichaModal ? profModal.fichas.findIndex((f) => f.id === fichaModal.id) : -1;
  const comparativoModal = profModal ? montarComparativoCategorias(profModal.fichas) : {};
  const linhasComparativoComProblema = Object.entries(comparativoModal).filter(([, valores]) =>
    valores.some((v) => v && v.classificacao !== 'BOM')
  );

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="custom-scrollbar p-[32px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Plano de Desenvolvimento</h2>

          {carregando ? (
            <div className="text-center py-10 font-medium">Carregando avaliações...</div>
          ) : Object.keys(porProfissional).length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhuma avaliação encontrada.</div>
          ) : (
            Object.entries(porProfissional).map(([profKey, prof]) => (
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
                        <tr key={ficha.id} className="border-t">
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
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalFicha && profModal && fichaModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalFicha(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho estilo "ficha" */}
            <div className="border-b p-5 flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Ficha de Avaliação</p>
                <h3 className="font-bold text-xl">{profModal.nome}</h3>
                <p className="text-sm text-gray-600">{profModal.funcao}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ficha {idxFichaModal + 1} • {formatarData(fichaModal.criado_em)}
                </p>
              </div>
              <button
                onClick={() => setModalFicha(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              {!fichaModal.temProblema ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-700">
                    Desempenho satisfatório em todas as categorias nesta ficha.
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
                            <div className="text-xs text-gray-500">
                              Média ponderada: <span className="font-semibold">{cat.mediaPonderada}</span>
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
                                  <th className="p-2">Critério</th>
                                  <th className="p-2 w-20">Nota</th>
                                  <th className="p-2 w-20">Peso</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cat.itens.map((item) => (
                                  <tr key={`${cat.nome}-${item.codigo || item.criterio}`} className="border-t">
                                    <td className="p-2 text-left">
                                      {item.codigo ? `${item.criterio}` : item.criterio}
                                    </td>
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

              {/* Comparativo, no final da modal */}
              {profModal.fichas.length > 1 && linhasComparativoComProblema.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h4 className="font-semibold text-sm mb-3">Comparativo de evolução (todas as fichas)</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-center">
                          <th className="p-2 text-left">Categoria</th>
                          {profModal.fichas.map((f, idx) => (
                            <th
                              key={f.id}
                              className={`p-2 ${f.id === fichaModal.id ? 'bg-blue-50 text-blue-700' : ''}`}
                            >
                              Ficha {idx + 1}
                              <div className="text-xs font-normal text-gray-500">{formatarData(f.criado_em)}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {linhasComparativoComProblema.map(([nomeCat, valores]) => (
                          <tr key={nomeCat} className="border-t">
                            <td className="p-2">{nomeCat}</td>
                            {valores.map((valor, idx) => (
                              <td
                                key={idx}
                                className={`p-2 text-center ${
                                  profModal.fichas[idx].id === fichaModal.id ? 'bg-blue-50' : ''
                                }`}
                              >
                                {valor ? (
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClasse(valor.classificacao)}`}>
                                    {valor.mediaPonderada} • {valor.classificacao}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}