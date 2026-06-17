import { useEffect, useState } from "react";
import KPICard from "./KPICard";

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

export default function KPIAvaliacoesPorCategoria() {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tiposFiltrados, setTiposFiltrados] = useState<Set<string>>(new Set(["Condutor"]));

  useEffect(() => {
    async function carregarKPIs() {
      try {
        setCarregando(true);
        const res = await fetch("http://localhost:3001/api/kpis/avaliacoes-por-categoria");
        const dados = await res.json();
        // Postgres numeric fields may be returned as strings. Coerce to numbers and handle nulls.
        const parsed = (dados || []).map((k: any) => ({
          categoria: k.categoria,
          tipo_avaliacao: k.tipo_avaliacao,
          total_avaliacoes: k.total_avaliacoes != null ? Number(k.total_avaliacoes) : 0,
          profissionais_avaliados: k.profissionais_avaliados != null ? Number(k.profissionais_avaliados) : 0,
          media_ponderada: k.media_ponderada != null && k.media_ponderada !== '' ? Number(k.media_ponderada) : null,
          nota_maxima: k.nota_maxima != null ? Number(k.nota_maxima) : null,
          nota_minima: k.nota_minima != null ? Number(k.nota_minima) : null,
          soma_pesos: k.soma_pesos != null ? Number(k.soma_pesos) : 0,
        }));
        setKpis(parsed);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregarKPIs();
  }, []);

  const tiposDisponiveis = Array.from(new Set(kpis.map(k => k.tipo_avaliacao)));
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
      // Se todos estão selecionados, desselecionar todos
      setTiposFiltrados(new Set());
    } else {
      // Selecionar todos
      setTiposFiltrados(new Set(tiposDisponiveis));
    }
  };

  const [avaliacoesFull, setAvaliacoesFull] = useState<any[]>([]);

  useEffect(() => {
    // carregar avaliações brutas para calcular profissionais distintos por tipo
    fetch('http://localhost:3001/api/avaliacoes')
      .then(r => r.json())
      .then(data => setAvaliacoesFull(data))
      .catch(() => setAvaliacoesFull([]));
  }, []);

  const obterCor = (nota: number | null): 'red' | 'yellow' | 'green' => {
    const n = typeof nota === 'number' && !isNaN(nota) ? nota : 0;
    if (n >= 4) return 'green';
    if (n >= 3) return 'yellow';
    return 'red';
  };

  if (carregando) {
    return <div className="text-center py-12">Carregando KPIs...</div>;
  }

  // calcular média ponderada geral de forma segura
  const mediasValidas = kpisFiltrados.map(k => k.media_ponderada).filter(v => typeof v === 'number' && !isNaN(v)) as number[];
  const mediaGeral = mediasValidas.length > 0 ? (mediasValidas.reduce((s, x) => s + x, 0) / mediasValidas.length).toFixed(2) : '—';

  // calcular profissionais distintos avaliados no filtro (por nome)
  const profissionaisDistintos = Array.from(new Set(
    avaliacoesFull
      .filter(a => tiposFiltrados.has(a.tipo_avaliacao))
      .map(a => a.avaliado_nome)
  )).length;

  return (
    <div className="space-y-6">
      {/* Filtro por tipo */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={handleSelecionarTodos}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            tiposFiltrados.size === tiposDisponiveis.length && tiposDisponiveis.length > 0
              ? "bg-[#1f2937] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {tiposFiltrados.size === tiposDisponiveis.length && tiposDisponiveis.length > 0 ? "Desselecionar Todos" : "Selecionar Todos"}
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        {tiposDisponiveis.map(tipo => (
          <button
            key={tipo}
            onClick={() => handleToggleTipo(tipo)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              tiposFiltrados.has(tipo)
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
                  titulo="Média Ponderada"
                  valor={kpi.media_ponderada}
                  subtitulo={`Min: ${kpi.nota_minima} | Max: ${kpi.nota_maxima}`}
                  icon="📊"
                  cor={obterCor(kpi.media_ponderada)}
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
            Nenhum dado disponível
          </div>
        )}
      </div>

      {/* Estatísticas Gerais */}
      {kpisFiltrados.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mt-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Resumo {tiposFiltrados.size === tiposDisponiveis.length && tiposDisponiveis.length > 0 ? "- Todas as Funções" : `- ${Array.from(tiposFiltrados).join(", ")}`}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Total de Avaliações
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {kpisFiltrados.reduce((acc, k) => acc + (k.total_avaliacoes || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Profissionais Avaliados
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {profissionaisDistintos}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Média Ponderada Geral
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {mediaGeral}
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
