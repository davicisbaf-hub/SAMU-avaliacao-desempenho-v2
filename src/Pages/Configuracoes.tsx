import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useUserSession } from "../contexts/UserSession";

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
};

export default function ConfiguracaoPage() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [criterios, setCriterios] = useState<Criterio[]>([]);

  const [categoria, setCategoria] = useState("");
  const [codigo, setCodigo] = useState("");
  const [criterio, setCriterio] = useState("");
  const [peso, setPeso] = useState(1);
  const [indicador, setIndicador] = useState("");
  const { user } = useUserSession();

  function toggleSelecionado(id: number) {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function editarCriterio(item: Criterio) {
    setEditandoId(item.id);
    setCategoria(item.categoria);
    setCodigo(item.codigo);
    setCriterio(item.criterio);
    setPeso(item.peso);
    setIndicador(item.indicador);

    setModalAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);
    setCategoria("");
    setCodigo("");
    setCriterio("");
    setPeso(1);
    setIndicador("");
    setModalAberto(false);
  }

  async function salvar() {
    if (!tipoSelecionado || !categoria || !codigo || !criterio) {
      alert("Preencha todos os campos.");
      return;
    }

    const url = editandoId
      ? `/api/criterios-avaliacao/${editandoId}`
      : "/api/criterios-avaliacao";

    const method = editandoId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: tipoSelecionado,
        categoria,
        codigo,
        criterio,
        peso,
        indicador,
      }),
    });

    limparFormulario();
    carregarCriterios();
  }

  function novoCriterio() {
    setEditandoId(null);

    setCategoria("");
    setCodigo("");
    setCriterio("");
    setPeso(1);
    setIndicador("");

    setModalAberto(true);
  }

  async function inativarSelecionados() {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um critério.");
      return;
    }

    if (!confirm(`Deseja inativar ${selecionados.length} critérios?`)) {
      return;
    }

    await Promise.all(
      selecionados.map((id) =>
        fetch(
          `/api/criterios-avaliacao/${id}/inativar`,
          {
            method: "PUT",
          }
        )
      )
    );

    setSelecionados([]);
    carregarCriterios();
  }

  useEffect(() => {
    carregarTipos();
  }, []);

  useEffect(() => {
    if (tipoSelecionado) {
      carregarCriterios();
    }
  }, [tipoSelecionado]);

  async function carregarTipos() {
    const res = await fetch("/api/tipos-avaliacao");
    const data = await res.json();

    setTipos(Array.isArray(data) ? data : []);
  }

  async function carregarCriterios() {
    const res = await fetch(
      `/api/criterios-avaliacao/${tipoSelecionado}`
    );

    const data = await res.json();
    setCriterios(Array.isArray(data) ? data : []);
  }


  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="rounded-xl border p-6 space-y-6">

            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-bold">
                Configuração das Fichas
              </h1>
              <p className="text-sm text-gray-500">
                Adicione e gerencie critérios de avaliação.
              </p>
            </div>

            {/* SELECT */}
            <div>
              <label className="text-sm font-semibold">
                Tipo de Avaliação
              </label>

              <select
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Selecione</option>

                  <option value={user?.funcao}>
                    {user?.funcao}
                  </option>
              </select>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Critérios da Ficha
              </h2>

              <div className="flex gap-2">
                {/* <button
                  onClick={novoCriterio}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Novo Critério
                </button>

                <button
                  onClick={inativarSelecionados}
                  disabled={selecionados.length === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                >
                  Inativar ({selecionados.length})
                </button> */}
              </div>
            </div>
            {/* LISTA */}
            {tipoSelecionado && (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
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
                            e.target.checked
                              ? criterios.map((c) => c.id)
                              : []
                          )
                        }
                      />
                    </th>

                    <th className="px-3 py-2 text-left">Categoria</th>
                    <th className="px-3 py-2 text-left">Código</th>
                    <th className="px-3 py-2 text-left">Critério</th>
                    <th className="px-3 py-2 text-center">Peso</th>
                    <th className="px-3 py-2 text-left">Indicador</th>
                    <th className="px-3 py-2 text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {criterios.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3">
                        {item.id}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(item.id)}
                          onChange={() => toggleSelecionado(item.id)}
                        />
                      </td>

                      <td className="px-3 py-3">
                        {item.categoria}
                      </td>

                      <td className="px-3 py-3 font-medium">
                        {item.codigo}
                      </td>

                      <td className="px-3 py-3">
                        {item.criterio}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {item.peso}
                      </td>

                      <td className="px-3 py-3">
                        {item.indicador}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => editarCriterio(item)}
                          className="text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {criterios.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        Nenhum critério encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Editar Critério
              </h2>

              <button
                onClick={limparFormulario}
                className="text-gray-500 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Categoria"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código"
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                value={criterio}
                onChange={(e) => setCriterio(e.target.value)}
                placeholder="Critério"
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
              />

              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                value={indicador}
                onChange={(e) => setIndicador(e.target.value)}
                placeholder="Indicador"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={limparFormulario}
                className="px-4 py-2 border rounded-lg"
              >
                Cancelar
              </button>

              <button
                  onClick={salvar}
                  className="px-4 py-2 bg-black text-white rounded-lg"
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