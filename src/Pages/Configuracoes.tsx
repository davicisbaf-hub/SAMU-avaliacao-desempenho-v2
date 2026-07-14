import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../components/ui/menubar"

type Tipo = {
  tipo: string;
};

type Criterio = {
  id: number;
  tipo: string;
  categoria: string;
  codigo: string;
  criterio: string;
  peso: number;
  indicador: string;
  avaliacao: string;
  ativo: boolean;
};

type TipoAvaliacao = {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
};

type Frequencia = {
  id: number;
  nivel: string;
  dias_minimos: number;
  dias_maximos: number;
  dias: number;
  semanas: number;
  meses: number;
  anos: number;
  ativo: boolean;
};

export default function ConfiguracaoPage() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState("autoavaliacao");
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [criterios, setCriterios] = useState<Criterio[]>([]);

  const [categoria, setCategoria] = useState("");
  const [codigo, setCodigo] = useState("");
  const [criterio, setCriterio] = useState("");
  const [peso, setPeso] = useState(1);
  const [indicador, setIndicador] = useState("");
  const [tipoAvaliacao, setAvaliacao] = useState<TipoAvaliacao[]>([]);

  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [frequenciaEditando, setFrequenciaEditando] = useState<Frequencia | null>(null);
  const [salvando, setSalvando] = useState(false);

  const { authFetch } = useAuthFetch();

  async function carregarFrequencias() {
    try {
      const res = await authFetch("/api/frequencia-avaliacoes");
      const data = await res.json();
      setFrequencias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar frequências:", error);
      setFrequencias([]);
    }
  }

  async function salvarFrequencia(item: Frequencia) {
    if (salvando) return;
    setSalvando(true);

    try {
      console.log("Salvando frequência ID:", item.id);
      console.log("Dados:", item);

      const response = await authFetch(`/api/frequencia-avaliacoes/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel: item.nivel,
          dias: item.dias,
          semanas: item.semanas,
          meses: item.meses,
          anos: item.anos,
          dias_minimos: item.dias_minimos,
          dias_maximos: item.dias_maximos,
          ativo: item.ativo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Erro ao salvar");
      }

      await carregarFrequencias();
      setFrequenciaEditando(null);
      alert("Frequência salva com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar frequência.");
    } finally {
      setSalvando(false);
    }
  }

  function editarFrequencia(item: Frequencia) {
    setFrequenciaEditando({ ...item });
  }

  function cancelarEdicaoFrequencia() {
    setFrequenciaEditando(null);
    carregarFrequencias();
  }

  useEffect(() => {
    carregarTipoAvaliacao();
    carregarFrequencias();
  }, []);

  async function carregarTipoAvaliacao() {
    try {
      const url = `/api/criterios-avaliacao/avaliacao`;
      const res = await authFetch(url);
      const data = await res.json();
      setAvaliacao(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar critérios:", error);
      setAvaliacao([]);
    }
  }

  useEffect(() => {
    carregarTipoAvaliacao();
  }, []);

  function toggleSelecionado(id: number) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function editarCriterio(item: Criterio) {
    setEditandoId(item.id);
    setCategoria(item.categoria);
    setCodigo(item.codigo);
    setCriterio(item.criterio);
    setPeso(item.peso);
    setIndicador(item.indicador || "");
    setAvaliacaoSelecionada(item.avaliacao || "autoavaliacao");
    setModalAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);
    setCategoria("");
    setCodigo("");
    setCriterio("");
    setPeso(1);
    setIndicador("");
    setAvaliacaoSelecionada("autoavaliacao");
    setModalAberto(false);
  }

  async function salvar() {
    const url = editandoId ? `/api/criterios-avaliacao/${editandoId}` : "/api/criterios-avaliacao";
    const method = editandoId ? "PUT" : "POST";

    try {
      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria,
          criterio,
          peso,
          indicador,

          avaliacao: avaliacaoSelecionada,
          tipo: tipoSelecionado,
        }),
      });

      limparFormulario();
      carregarCriterios();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o critério.");
    }
  }

  function novoCriterio() {
    setEditandoId(null);
    setCategoria("");
    setCodigo("");
    setCriterio("");
    setPeso(1);
    setIndicador("");
    setTipoSelecionado("");
    setAvaliacaoSelecionada("autoavaliacao");
    setModalAberto(true);
  }

  async function inativarSelecionados() {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um critério.");
      return;
    }

    if (!confirm(`Deseja inativar ${selecionados.length} critério(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selecionados.map((id) =>
          authFetch(`/api/criterios-avaliacao/${id}/inativar`, { method: "PUT" })
        )
      );

      setSelecionados([]);
      carregarCriterios();
    } catch (error) {
      console.error("Erro ao inativar:", error);
      alert("Erro ao inativar os critérios.");
    }
  }

  useEffect(() => {
    carregarTipos();
  }, []);

  useEffect(() => {
    if (tipoSelecionado) {
      carregarCriterios();
    }
  }, [tipoSelecionado, avaliacaoSelecionada]);

  async function carregarTipos() {
    try {
      const res = await authFetch("/api/tipos-avaliacao");
      const data = await res.json();
      setTipos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar tipos:", error);
    }
  }

  async function carregarCriterios() {
    try {
      const url = `/api/criterios-avaliacao/${tipoSelecionado}/${avaliacaoSelecionada}`;
      const res = await authFetch(url);
      const data = await res.json();
      setCriterios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar critérios:", error);
      setCriterios([]);
    }
  }

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="p-8 overflow-y-auto custom-scrollbar">

          <Tabs defaultValue="ficha" className="w-full block ">
            
            <Menubar className="w-full menu-config">
              <MenubarMenu>
                <MenubarTrigger className="w-full">Configurações</MenubarTrigger>
                  <MenubarContent>
                    <MenubarGroup>
                      <MenubarItem>
                        <TabsList>
                          <TabsTrigger value="ficha">Configuração das Fichas</TabsTrigger>
                        </TabsList>
                      </MenubarItem>

                      <MenubarItem>
                        <TabsList>
                          <TabsTrigger value="frequencia">Frequência das Avaliações por Nível</TabsTrigger>
                        </TabsList>
                      </MenubarItem>

                      <MenubarItem>
                        <TabsList>
                          <TabsTrigger value="pdi" disabled>Plano de desenvolvimento Individual (PDI)</TabsTrigger>
                        </TabsList>
                      </MenubarItem>
                    </MenubarGroup>  
                  </MenubarContent>
              </MenubarMenu>
            </Menubar>

            <TabsList className="w-full tablist">
              <TabsTrigger value="ficha">Configuração das Fichas</TabsTrigger>
              <TabsTrigger value="frequencia">Frequência das Avaliações por Nível</TabsTrigger>
              <TabsTrigger value="pdi" disabled>Plano de desenvolvimento Individual (PDI)</TabsTrigger>
            </TabsList>

            <TabsContent value="ficha">
              {/* Configuração das fichas */}
              <div className="rounded-xl border p-6 space-y-6 mt-6">
                {/* HEADER */}
                <div>
                  <h1 className="text-2xl font-bold">Configuração das Fichas</h1>
                  <p className="text-sm text-gray-500">
                    Adicione e gerencie critérios de avaliação para cada tipo de ficha.
                  </p>
                </div>
                {/* SELECTS */}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold">Tipo de Profissional</label>
                    <select
                      value={tipoSelecionado}
                      onChange={(e) => setTipoSelecionado(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="">Selecione o tipo</option>
                      {tipos.map((t) => (
                        <option key={t.tipo} value={t.tipo}>
                          {t.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Tipo de Avaliação</label>
                    <select
                      value={avaliacaoSelecionada}
                      onChange={(e) => setAvaliacaoSelecionada(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                      {tipoAvaliacao.map((t) => (
                        <option key={t.id} value={t.nome}>
                          {t.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Critérios da Ficha</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={novoCriterio}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Novo Critério
                    </button>
                    <button
                      onClick={inativarSelecionados}
                      disabled={selecionados.length === 0}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition"
                    >
                      Inativar ({selecionados.length})
                    </button>
                  </div>
                </div>

                {/* LISTA */}
                {tipoSelecionado && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b bg-gray-100 text-center">
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-center w-12">
                            <input
                              type="checkbox"
                              checked={
                                criterios.length > 0 &&
                                selecionados.length === criterios.length
                              }
                              onChange={(e) =>
                                setSelecionados(
                                  e.target.checked ? criterios.map((c) => c.id) : []
                                )
                              }
                            />
                          </th>

                          <th className="px-3 py-2">Categoria</th>
                          <th className="px-3 py-2">Critério</th>
                          <th className="px-3 py-2">Peso</th>
                          <th className="px-3 py-2">Indicador</th>
                          <th className="px-3 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {criterios.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 py-3">{item.id}</td>
                            <td className="px-3 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={selecionados.includes(item.id)}
                                onChange={() => toggleSelecionado(item.id)}
                              />
                            </td>
                            <td className="px-3 py-3">{item.categoria}</td>
                            <td className="px-3 py-3 max-w-xs truncate">
                              {item.criterio}
                            </td>
                            <td className="px-3 py-3 text-center">{item.peso}</td>
                            <td className="px-3 py-3 max-w-xs truncate">
                              {item.indicador || "-"}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <button
                                onClick={() => editarCriterio(item)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                        {criterios.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                              Nenhum critério encontrado para esta seleção.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* FREQUÊNCIA DAS AVALIAÇÕES */}
            <TabsContent value="frequencia">
              <div className="rounded-lg border p-4 mt-6 overflow-x-auto">
                <h2 className="font-semibold text-lg mb-4">
                  Frequência das Avaliações por Nível
                </h2>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2">ID</th>
                      <th className="p-2">Nível</th>
                      <th className="p-2">Dias Mínimos</th>
                      <th className="p-2">Dias Máximos</th>
                      <th className="p-2">Dias</th>
                      <th className="p-2">Semanas</th>
                      <th className="p-2">Meses</th>
                      <th className="p-2">Anos</th>
                      <th className="p-2">Ação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {frequencias.map((item) => (
                      <tr key={item.id} className="border-b">
                        {frequenciaEditando?.id === item.id ? (
                          // Modo edição
                          <>
                            <td className="p-2 text-center">{item.id}</td>
                            <td className="p-2 text-center">
                              <input
                                type="text"
                                value={frequenciaEditando.nivel}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  nivel: e.target.value
                                })}
                                className="w-32 border rounded px-2 py-1"
                                placeholder="Nome do nível"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.dias_minimos}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  dias_minimos: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.dias_maximos}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  dias_maximos: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.dias}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  dias: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.semanas}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  semanas: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.meses}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  meses: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={frequenciaEditando.anos}
                                onChange={(e) => setFrequenciaEditando({
                                  ...frequenciaEditando,
                                  anos: Number(e.target.value)
                                })}
                                className="w-16 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => salvarFrequencia(frequenciaEditando)}
                                  disabled={salvando}
                                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs disabled:opacity-50"
                                >
                                  {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                  onClick={cancelarEdicaoFrequencia}
                                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 text-xs"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // Modo visualização
                          <>
                            <td className="p-2 text-center">{item.id}</td>
                            <td className="p-2 font-medium ">{item.nivel}</td>
                            <td className="p-2 text-center">{item.dias_minimos}</td>
                            <td className="p-2 text-center">{item.dias_maximos}</td>
                            <td className="p-2 text-center">{item.dias}</td>
                            <td className="p-2 text-center">{item.semanas}</td>
                            <td className="p-2 text-center">{item.meses}</td>
                            <td className="p-2 text-center">{item.anos}</td>
                            <td className="p-2">
                              <button
                                onClick={() => editarFrequencia(item)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                              >
                                Editar
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editandoId ? "Editar Critério" : "Novo Critério"}
              </h2>
              <button
                onClick={limparFormulario}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Categoria *</label>
                <input
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Habilidades Não Técnicas"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Critério *</label>
                <textarea
                  value={criterio}
                  onChange={(e) => setCriterio(e.target.value)}
                  placeholder="Descreva o critério de avaliação"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Peso *</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Indicador</label>
                <input
                  value={indicador}
                  onChange={(e) => setIndicador(e.target.value)}
                  placeholder="Ex: Humanização do cuidado"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Tipo de Profissional</label>
                <select
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Selecione o tipo</option>
                  {tipos.map((t) => (
                    <option key={t.tipo} value={t.tipo}>
                      {t.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Avaliação</label>
                <select
                  value={avaliacaoSelecionada}
                  onChange={(e) => setAvaliacaoSelecionada(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  {tipoAvaliacao.map((t) => (
                    <option key={t.id} value={t.nome}>
                      {t.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={limparFormulario}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {editandoId ? "Salvar Alterações" : "Adicionar Critério"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}