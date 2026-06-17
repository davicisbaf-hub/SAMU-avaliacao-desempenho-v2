import React, { useEffect, useState } from 'react';
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
  const { user } = useUserSession();
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

  // quando avaliações carregarem, buscar critérios por cada função encontrada
  useEffect(() => {
    const tipos = Array.from(new Set(avaliacoes.map(a => a.avaliado_funcao))).filter(Boolean);
    tipos.forEach((tipo) => {
      if (criteriosPorTipo[tipo]) return; // já buscado
      fetch(`http://localhost:3001/api/criterios-avaliacao-autoavaliacao/${encodeURIComponent(tipo)}`)
        .then(r => r.json())
        .then((dados: Criterio[]) => {
          setCriteriosPorTipo(prev => ({ ...prev, [tipo]: dados }));
        })
        .catch(() => {
          // ignorar erros individuais
        });
    });
  }, [avaliacoes]);

  // Extrai itens do resultado com nota e metadados (usa categoria direto do payload)
  const extrairItens = (obj: any, path = ''): { path: string; nota: number; categoria?: string; codigo?: string; criterioText?: string; peso?: number }[] => {
    const res: { path: string; nota: number; categoria?: string; codigo?: string; criterioText?: string; peso?: number }[] = [];
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
        // continuar recursão para itens aninhados
        res.push(...extrairItens(val, p));
      }
    }
    return res;
  };

  const toggleCategory = (profKey: string, categoria: string) => {
    setExpanded(prev => {
      const updated = { ...prev };
      if (!updated[profKey]) updated[profKey] = {};
      updated[profKey][categoria] = !updated[profKey][categoria];
      return updated;
    });
  };

  const gerarPlanoPara = (avaliacoesDoProf: Avaliacao[]) => {
    if (avaliacoesDoProf.length === 0) return null;

    // coletar itens (já incluem categoria, codigo, criterioText, peso)
    const itens = avaliacoesDoProf.flatMap((a) => extrairItens(a.resultado || {}));
    if (itens.length === 0) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm">Sem detalhes numéricos nas avaliações — plano genérico aplicado.</p>
        </div>
      );
    }

    // agrupar por categoria e por criterio (usa codigo quando disponível)
    const grouped: Record<string, Record<string, { soma: number; count: number; peso?: number; codigo?: string; criterioText?: string }>> = {};

    itens.forEach(it => {
      const categoria = it.categoria && String(it.categoria).trim() !== '' ? it.categoria : (it.path && it.path.includes('.') ? it.path.split('.')[0] : 'Sem categoria');
      const critKey = it.codigo || it.criterioText || it.path;
      if (!grouped[categoria]) grouped[categoria] = {};
      if (!grouped[categoria][critKey]) grouped[categoria][critKey] = { soma: 0, count: 0, peso: it.peso, codigo: it.codigo, criterioText: it.criterioText };
      grouped[categoria][critKey].soma += it.nota;
      grouped[categoria][critKey].count += 1;
    });

    // construir estrutura por categoria com médias
    const categoriasComFracos: Record<string, { criterio: string; media: number; peso?: number; count: number; codigo?: string }[]> = {};

    Object.entries(grouped).forEach(([cat, criteriosObj]) => {
      const arr = Object.entries(criteriosObj).map(([critKey, info]) => ({
        criterio: info.criterioText || critKey,
        key: critKey,
        media: parseFloat((info.soma / info.count).toFixed(2)),
        peso: info.peso,
        count: info.count,
        codigo: info.codigo,
      }));

      categoriasComFracos[cat] = arr.filter(x => x.media <= 3);
    });

    const anyFraco = Object.values(categoriasComFracos).some(arr => arr.length > 0);
    if (!anyFraco) {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm">Nenhum item com média ≤ 3 por categoria.</p>
        </div>
      );
    }

    // UI: mostrar categorias com botão olho para expandir detalhes
    return (
      <div className="bg-card rounded-xl p-4 border">
        <h4 className="font-semibold mb-3">Itens abaixo do limiar (média ≤ 3) por categoria</h4>

        <div className="space-y-3">
          {Object.entries(categoriasComFracos).map(([cat, items]) => (
            items.length === 0 ? null : (
              <div key={cat} className="border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <strong className="text-sm">{cat}</strong>
                    <span className="text-xs text-gray-500">{items.length} item(s)</span>
                  </div>
                  <button onClick={() => toggleCategory(`${avaliacoesDoProf[0].avaliado_nome}||${avaliacoesDoProf[0].avaliado_funcao}`, cat)} className="text-gray-500 hover:text-gray-700">
                    {/* eye icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>

                {expanded[`${avaliacoesDoProf[0].avaliado_nome}||${avaliacoesDoProf[0].avaliado_funcao}`]?.[cat] && (
                  <div className="mt-2 text-sm">
                    <ul className="list-disc ml-5">
                      {items.map(it => (
                        <li key={it.key} className="mb-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{it.codigo ? `${it.codigo} — ${it.criterio}` : it.criterio}</div>
                              <div className="text-xs text-gray-500">Média: {it.media} — respostas: {it.count}{it.peso ? ` — peso: ${it.peso}` : ''}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        <div className="mt-3 text-xs text-gray-500">Detalhes gerados a partir das avaliações registradas no painel. Clique no ícone para ver perguntas por categoria.</div>
      </div>
    );
  };

  // Agrupa avaliações por profissional
  const porProfissional = avaliacoes.reduce((acc: Record<string, Avaliacao[]>, a) => {
    const key = `${a.avaliado_nome}||${a.avaliado_funcao}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {} as Record<string, Avaliacao[]>);

  return (
    <div>
      <div className="flex h-screen w-screen bg-white text-black">
        <Nav />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />

          {/* conteudo */}
          <div className="custom-scrollbar p-[32px] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Plano de Desenvolvimento Profissional (6 meses)</h1>
                <p className="text-sm text-gray-600">Planos gerados automaticamente a partir das avaliações do painel. Revisão mensal recomendada.</p>
              </div>

              {carregando ? (
                <div className="py-12 text-center">Carregando avaliações...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {Object.keys(porProfissional).length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhuma avaliação encontrada para gerar planos.</div>
                  ) : (
                    Object.entries(porProfissional).map(([key, items]) => {
                      const [nome, funcao] = key.split('||');
                      return (
                        <div key={key} className="bg-white rounded-xl shadow-sm p-4 border">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-gray-500">{funcao}</p>
                              <h3 className="text-lg font-semibold">{nome}</h3>
                            </div>
                            <div className="text-right text-sm text-gray-500">Avaliações: {items.length}</div>
                          </div>

                          <div className="mt-3">
                            {gerarPlanoPara(items)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
