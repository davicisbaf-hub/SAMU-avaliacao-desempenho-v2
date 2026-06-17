import { useEffect, useState } from "react";
import KPICard from "./KPICard";

interface KPIData {
  categoria: string;
  tipo_avaliacao: string;
  total_avaliacoes: number;
  profissionais_avaliados: number;
  media_notas: number;
  nota_maxima: number;
  nota_minima: number;
}

export default function KPIAvaliacoesPorCategoria() {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("Condutor");

  useEffect(() => {
    async function carregarKPIs() {
      try {
        setCarregando(true);
        const res = await fetch("http://localhost:3001/api/kpis/avaliacoes-por-categoria");
        const dados = await res.json();
        setKpis(dados);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregarKPIs();
  }, []);

  const tiposDisponiveis = Array.from(new Set(kpis.map(k => k.tipo_avaliacao)));
  const kpisFiltrados = kpis.filter(k => k.tipo_avaliacao === tipoFiltro);

  const obterCor = (nota: number): 'red' | 'yellow' | 'green' => {
    if (nota >= 4) return 'green';
    if (nota >= 3) return 'yellow';
    return 'red';
  };

  if (carregando) {
    return <div className="text-center py-12">Carregando KPIs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtro por tipo */}
      <div className="flex gap-2 flex-wrap">
        {tiposDisponiveis.map(tipo => (
          <button
            key={tipo}
            onClick={() => setTipoFiltro(tipo)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              tipoFiltro === tipo
                ? "bg-[#cd0048] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpisFiltrados.length > 0 ? (
          kpisFiltrados.map((kpi) => (
            <div key={`${kpi.tipo_avaliacao}-${kpi.categoria}`} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 px-1">
                {kpi.categoria}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <KPICard
                  titulo="Média de Notas"
                  valor={kpi.media_notas}
                  subtitulo={`Min: ${kpi.nota_minima} | Max: ${kpi.nota_maxima}`}
                  icon="📊"
                  cor={obterCor(kpi.media_notas)}
                />
                
                <KPICard
                  titulo="Avaliações"
                  valor={kpi.total_avaliacoes}
                  subtitulo={`${kpi.profissionais_avaliados} profissionais`}
                  icon="👥"
                  cor="blue"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum dado disponível para {tipoFiltro}
          </div>
        )}
      </div>

      {/* Estatísticas Gerais */}
      {kpisFiltrados.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mt-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Resumo - {tipoFiltro}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Total de Avaliações
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {kpisFiltrados.reduce((acc, k) => acc + k.total_avaliacoes, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Profissionais Avaliados
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {kpisFiltrados.reduce((acc, k) => acc + k.profissionais_avaliados, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Média Geral
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(
                  kpisFiltrados.reduce((acc, k) => acc + k.media_notas, 0) /
                  kpisFiltrados.length
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Categorias
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {kpisFiltrados.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
