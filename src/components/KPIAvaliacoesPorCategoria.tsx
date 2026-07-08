import { useEffect, useState } from "react";
import { useUserSession } from "../contexts/UserSession";
import { useAuthFetch } from "../hooks/useAuthFetch";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList
} from "recharts";

interface KPIData {
  categoria: string;
  tipo_avaliacao: string;
  total_avaliacoes: number;
  profissionais_avaliados: number;
  media_ponderada: number;
  nota_maxima: number;
  nota_minima: number;
  soma_pesos: number;
}

export interface StatusKPIContagem {
  categoriasBom: number;
  categoriasAtenção: number;
  categoriasRisco: number;
}

interface Props {
  onStatusChange?: (status: StatusKPIContagem) => void;
}

export default function KPIAvaliacoesPorCategoria({ onStatusChange }: Props) {
  const { user } = useUserSession();
  const { authFetch } = useAuthFetch();
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [avaliacoesFull, setAvaliacoesFull] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tiposFiltrados, setTiposFiltrados] = useState<Set<string>>(new Set([`${user?.funcao}`, "Avaliação Par"]));
  const isAdminGlobal = user?.perfil === "🔑 Administrador - Todas as bases";

  const [bases, setBases] = useState<string[]>([]);
  const [filtroBase, setFiltroBase] = useState(
    isAdminGlobal ? "" : (user?.base ?? "")
  );

  useEffect(() => {
    async function carregarBases() {
      try {
        const res = await authFetch("/api/bases");
        const data = await res.json();

        setBases(data.map((b: any) => b.nome));
      } catch (err) {
        console.error(err);
      }
    }

    if (isAdminGlobal) {
      carregarBases();
    }
  }, []);

  useEffect(() => {
    async function carregarKPIs() {
      try {
        setCarregando(true);

        const base = isAdminGlobal ? filtroBase : user?.base;

        const url = base
          ? `/api/kpis/avaliacoes-por-categoria?base=${encodeURIComponent(base)}`
          : "/api/kpis/avaliacoes-por-categoria";

        const res = await authFetch(url);
        const dados = await res.json();

        const parsed = Array.isArray(dados)
          ? dados.map((k: any) => ({
              categoria: k.categoria,
              tipo_avaliacao: k.tipo_avaliacao,
              total_avaliacoes: Number(k.total_avaliacoes ?? 0),
              profissionais_avaliados: Number(k.profissionais_avaliados ?? 0),
              media_ponderada:
                k.media_ponderada !== null
                  ? Number(k.media_ponderada)
                  : 0,
              nota_maxima: Number(k.nota_maxima ?? 0),
              nota_minima: Number(k.nota_minima ?? 0),
              soma_pesos: Number(k.soma_pesos ?? 0),
            }))
          : [];

        setKpis(parsed);

      } catch (err) {
        console.error(err);
        setKpis([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarKPIs();

  }, [filtroBase, user?.base]);

  useEffect(() => {
    async function carregarAvaliacoes() {
      try {
        const url = isAdminGlobal
        ? filtroBase
          ? `/api/avaliacoes?base=${encodeURIComponent(filtroBase)}`
          : "/api/avaliacoes"
        : `/api/avaliacoes?base=${encodeURIComponent(user?.base ?? "")}`;
        const res = await authFetch(url);
        const data = await res.json();
        setAvaliacoesFull(Array.isArray(data) ? data : []);
      } catch (err) {
        
        setAvaliacoesFull([]);
      }
    }
    carregarAvaliacoes();
  }, [filtroBase]);

  const tiposDisponiveis = isAdminGlobal
  ? Array.from(new Set(kpis.map(k => k.tipo_avaliacao)))
  : Array.from(
      new Set(
        kpis
          .map(k => k.tipo_avaliacao)
          .filter(
            tipo =>
              tipo === user?.funcao ||
              tipo === "Avaliação Par"
          )
      )
    );
  const kpisFiltrados = kpis.filter(k => tiposFiltrados.has(k.tipo_avaliacao));

  const handleToggleTipo = (tipo: string) => {
    const novosTipos = new Set(tiposFiltrados);
    if (novosTipos.has(tipo)) {
      novosTipos.delete(tipo);
    } else {
      novosTipos.add(tipo);
    }
    setTiposFiltrados(novosTipos);
  };

  const handleSelecionarTodos = () => {
    if (tiposFiltrados.size === tiposDisponiveis.length) {
      setTiposFiltrados(new Set());
    } else {
      setTiposFiltrados(new Set(tiposDisponiveis));
    }
  };

  const totalAvaliacoes = kpisFiltrados.reduce((acc, k) => acc + k.total_avaliacoes, 0);

  const mediaGeral =
    totalAvaliacoes > 0
      ? (
        kpisFiltrados.reduce((acc, k) => acc + (k.media_ponderada * k.total_avaliacoes), 0) / totalAvaliacoes
      ).toFixed(1)
      : "- ";

  const profissionaisDistintos = Array.from(new Set(
    avaliacoesFull
      .filter(a => tiposFiltrados.has(a.tipo_avaliacao))
      .map(a => a.avaliado_nome)
  )).length;

  const categoriasBom = kpisFiltrados.filter(k => k.media_ponderada >= 4).length;
  const categoriasAtenção = kpisFiltrados.filter(k => k.media_ponderada >= 3 && k.media_ponderada < 3.9).length;
  const categoriasRisco = kpisFiltrados.filter(k => k.media_ponderada < 3).length;

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({ categoriasBom, categoriasAtenção, categoriasRisco });
    }
  }, [categoriasBom, categoriasAtenção, categoriasRisco, onStatusChange]);

  if (carregando) {
    return <div className="text-center py-12">Carregando KPIs...</div>;
  }

  const dadosPorTipo = Array.from(tiposFiltrados).map((tipo) => {
    const categorias = kpis.filter((k) => k.tipo_avaliacao === tipo);
    return {
      tipo,
      Bom: categorias.filter((c) => c.media_ponderada >= 4).length,
      Atenção: categorias.filter((c) => c.media_ponderada >= 3 && c.media_ponderada < 4).length,
      Risco: categorias.filter((c) => c.media_ponderada < 3).length,
    };
  });

  const categoriasAgrupadas = Object.values(
    kpisFiltrados.reduce((acc: any, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = {
          categoria: item.categoria,
          somaMediaPonderada: 0,
          somaAvaliacoes: 0,
          total_avaliacoes: 0,
          profissionais_avaliados: 0,
        };
      }
      acc[item.categoria].somaMediaPonderada += item.media_ponderada * item.total_avaliacoes;
      acc[item.categoria].somaAvaliacoes += item.total_avaliacoes;
      acc[item.categoria].total_avaliacoes += item.total_avaliacoes;
      acc[item.categoria].profissionais_avaliados += item.profissionais_avaliados;
      return acc;
    }, {})
  ).map((item: any) => ({
    categoria: item.categoria,
    media_ponderada: item.somaAvaliacoes > 0 ? item.somaMediaPonderada / item.somaAvaliacoes : 0,
    total_avaliacoes: item.total_avaliacoes,
    profissionais_avaliados: item.profissionais_avaliados,
  }));

  const dadosCards = tiposFiltrados.size > 1 ? categoriasAgrupadas : kpisFiltrados;
  const totalCategorias = new Set(kpisFiltrados.map(k => k.categoria)).size;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap items-center">
        {isAdminGlobal && (
          <>
            <button
              onClick={handleSelecionarTodos}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                tiposFiltrados.size === tiposDisponiveis.length &&
                tiposDisponiveis.length > 0
                  ? "bg-[#1f2937] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tiposFiltrados.size === tiposDisponiveis.length &&
              tiposDisponiveis.length > 0
                ? "Desselecionar Todos"
                : "Selecionar Todos"}
            </button>

            <div className="h-6 w-px bg-gray-300" />
          </>
        )}
        {isAdminGlobal && (
          <>
            <select
              value={filtroBase}
              onChange={(e) => setFiltroBase(e.target.value)}
              className="px-2 py-1 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer outline-none"
            >
              <option value="">
                Todas as Bases
              </option>

              {bases.map((base) => (
                <option key={base} value={base}>
                  {base}
                </option>
              ))}
            </select>

            <div className="h-6 w-px bg-gray-300" />
          </>
        )}
        {tiposDisponiveis.map((tipo) => (
          <button
            key={tipo}
            onClick={() => handleToggleTipo(tipo)}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              tiposFiltrados.has(tipo)
                ? "bg-[#cd0048] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {kpisFiltrados.length > 0 ? (
          dadosCards.map((kpi: any) => (
            <div key={kpi.categoria} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{kpi.categoria}</h3>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${kpi.media_ponderada >= 4 ? "bg-green-100 text-green-700" : kpi.media_ponderada >= 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {kpi.media_ponderada >= 4 ? "BOM" : kpi.media_ponderada >= 3 ? "ATENÇÃO" : "RISCO"}
                </span>
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">{kpi.media_ponderada?.toFixed(1)}</span>
                <span className="text-sm text-gray-500 mb-1">/ 5.0</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${kpi.media_ponderada >= 4 ? "bg-green-500" : kpi.media_ponderada >= 3 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${(kpi.media_ponderada / 5) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Avaliações</p>
                  <p className="font-bold text-lg">{kpi.total_avaliacoes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Profissionais</p>
                  <p className="font-bold text-lg">{kpi.profissionais_avaliados}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">Nenhum dado disponível</div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-bold mb-4">Comparativo por Função</h3>
        <ResponsiveContainer width="100%" height={Math.max(250, dadosPorTipo.length * 90)}>
          <BarChart data={dadosPorTipo} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }} barSize={35}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="tipo" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Bom" stackId="status" fill="#22c55e">
              <LabelList dataKey="Bom" position="center" fill="#fff" fontWeight="bold" formatter={(v: number) => (v > 0 ? v : "")} />
            </Bar>
            <Bar dataKey="Atenção" stackId="status" fill="#f59e0b">
              <LabelList dataKey="Atenção" position="center" fill="#fff" fontWeight="bold" formatter={(v: number) => (v > 0 ? v : "")} />
            </Bar>
            <Bar dataKey="Risco" stackId="status" fill="#ef4444">
              <LabelList dataKey="Risco" position="center" fill="#fff" fontWeight="bold" formatter={(v: number) => (v > 0 ? v : "")} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {kpisFiltrados.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mt-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Resumo {tiposFiltrados.size === tiposDisponiveis.length && tiposDisponiveis.length > 0 ? "- Todas as Funções" : `- ${Array.from(tiposFiltrados).join(", ")}`}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Total de Avaliações</p>
              <p className="text-2xl font-bold text-gray-900">{kpisFiltrados.reduce((acc, k) => acc + (k.total_avaliacoes || 0), 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Profissionais Avaliados</p>
              <p className="text-2xl font-bold text-gray-900">{profissionaisDistintos}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Média Ponderada Geral</p>
              <p className="text-2xl font-bold text-blue-600">{mediaGeral}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Categorias</p>
              <p className="text-2xl font-bold text-purple-600">{totalCategorias}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}