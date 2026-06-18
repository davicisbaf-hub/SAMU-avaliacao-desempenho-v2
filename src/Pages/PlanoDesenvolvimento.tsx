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

type Criterio = {
  id: number;
  tipo: string;
  categoria: string;
  codigo: string;
  criterio: string;
  peso: number;
};

export default function PlanoDesenvolvimento() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [criteriosPorTipo, setCriteriosPorTipo] = useState<Record<string, Criterio[]>>({});
  const [expanded, setExpanded] = useState<Record<string, Record<string, boolean>>>({});

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

  // Busca critérios por função (caso precise usar no futuro, já que está no seu código original)
  useEffect(() => {
    const tipos = Array.from(new Set(avaliacoes.map(a => a.avaliado_funcao))).filter(Boolean);
    tipos.forEach((tipo) => {
      if (criteriosPorTipo[tipo]) return;
      fetch(`http://localhost:3001/api/criterios-avaliacao-autoavaliacao/${encodeURIComponent(tipo)}`)
        .then(r => r.json())
        .then((dados: Criterio[]) => {
          setCriteriosPorTipo(prev => ({ ...prev, [tipo]: dados }));
        })
        .catch(() => { });
    });
  }, [avaliacoes, status]);

  // Extrai itens recursivamente do resultado
  const extrairItens = (obj: any, path = ''): { path: string; nota: number; categoria?: string; codigo?: string; criterioText?: string; peso?: number }[] => {
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

  const toggleCategory = (profKey: string, categoria: string) => {
    setExpanded(prev => ({
      ...prev,
      [profKey]: {
        ...prev[profKey],
        [categoria]: !prev[profKey]?.[categoria],
      },
    }));
  };

  // SOLUÇÃO: Agrupa as avaliações por profissional dinamicamente
  const porProfissional = useMemo(() => {
    const grupos: Record<string, Avaliacao[]> = {};
    avaliacoes.forEach((aval) => {
      const chave = aval.avaliado_nome;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(aval);
    });
    return grupos;
  }, [avaliacoes]);

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />


        <div className='custom-scrollbar p-[32px] overflow-y-auto'>
          <h2 className="text-2xl font-bold mb-6">Plano de Desenvolvimento</h2>

          {carregando ? (
            <div className="text-center py-10 font-medium">Carregando avaliações...</div>
          ) : Object.keys(porProfissional).length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhuma avaliação encontrada.</div>
          ) : (
            Object.entries(porProfissional).map(([profKey, avaliacoesDoProf]) => {
              const grouped: Record<string, Record<string, { soma: number; count: number; codigo?: string; }>> = {};

              avaliacoesDoProf.forEach((avaliacao) => {
                const itens = extrairItens(avaliacao.resultado);
                itens.forEach((item) => {
                  const categoria = item.categoria || "Sem categoria";
                  const criterio = item.criterioText || item.path;

                  if (!grouped[categoria]) grouped[categoria] = {};
                  if (!grouped[categoria][criterio]) {
                    grouped[categoria][criterio] = { soma: 0, count: 0, codigo: item.codigo };
                  }

                  grouped[categoria][criterio].soma += item.nota;
                  grouped[categoria][criterio].count += 1;
                });
              });

              const categoriasClassificadas: Record<string, any[]> = {};
              Object.entries(grouped).forEach(([cat, criteriosObj]) => {
                categoriasClassificadas[cat] = Object.entries(criteriosObj).map(([criterio, info]) => {
                  const media = Number((info.soma / info.count).toFixed(2));
                  let classificacao = "";
                  let orientacao = "";

                  // Regra baseada na sua tabela de médias/porcentagem
                  if (media >= 4) {
                    classificacao = "BOM";
                    orientacao = "Manutenção e aperfeiçoamento. Reconhecimento e incentivo.";
                  } else if (media >= 3) {
                    classificacao = "REGULAR";
                    orientacao = "PDI com ações de melhoria. Acompanhamento mensal. Treinamentos específicos.";
                  } else {
                    classificacao = "RUIM";
                    orientacao = "Intervenção imediata. PDI urgente. Supervisão direta. Afastamento de funções críticas se necessário.";
                  }

                  return { criterio, media, classificacao, orientacao };
                });
              });

              const anyProblema = Object.values(categoriasClassificadas).some(
                (items) => items.some((item) => item.classificacao !== "BOM")
              );

              return (
                <div key={profKey} className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">
                    {avaliacoesDoProf[0].avaliado_nome} - {avaliacoesDoProf[0].avaliado_funcao}
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(categoriasClassificadas).map(([cat, items]) => {
                      const itensNecessitamAcao = items.filter(item => item.classificacao !== "BOM");
                      if (itensNecessitamAcao.length === 0) return null;

                      return (
                        <div key={cat} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <strong className="text-gray-800">{cat}</strong>
                              <div className="text-xs text-gray-500">
                                {itensNecessitamAcao.length} item(s) com oportunidade de melhoria
                              </div>
                            </div>
                            <button onClick={() => toggleCategory(profKey, cat)} className="text-xl p-1 hover:bg-gray-100 rounded">
                              {expanded[profKey]?.[cat] ? '👁️‍🗨️' : '👁️'}
                            </button>
                          </div>

                          {expanded[profKey]?.[cat] && (
                            <div className="mt-3 space-y-3 border-t pt-3">
                              {itensNecessitamAcao.map((item) => (
                                <div key={`${cat}-${item.codigo || item.criterio}`} className="border rounded-lg p-3 bg-gray-50">
                                  <div className="font-medium text-gray-900">
                                    {item.codigo ? `${item.codigo} - ${item.criterio}` : item.criterio}
                                  </div>
                                  <div className="text-sm mt-1 text-gray-700">
                                    Média: <strong className="text-base">{item.media}</strong>
                                  </div>
                                  <div className={`font-semibold mt-1 text-sm ${item.classificacao === "RUIM" ? "text-red-600" : "text-amber-600"}`}>
                                    {item.classificacao}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border">
                                    {item.orientacao}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!anyProblema && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                      <p className="text-sm font-medium text-green-700">
                        Profissional com desempenho satisfatório em todos os critérios.
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Manutenção e aperfeiçoamento. Reconhecimento e incentivo.
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}