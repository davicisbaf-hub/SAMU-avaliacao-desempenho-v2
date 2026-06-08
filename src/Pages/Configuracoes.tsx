import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";

type Tipo = {
  tipo: string;
  tipo_link: string;
};

type Criterio = {
  id: number;
  tipo: string;
  tipo_link: string;
  categoria: string;
  codigo: string;
  criterio: string;
  peso: number;
  indicador: string;
};

export default function ConfiguracaoPage() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("");

  const [criterios, setCriterios] = useState<Criterio[]>([]);

  const [categoria, setCategoria] = useState("");
  const [codigo, setCodigo] = useState("");
  const [criterio, setCriterio] = useState("");
  const [peso, setPeso] = useState(1);
  const [indicador, setIndicador] = useState("");

  useEffect(() => {
    carregarTipos();
  }, []);

  useEffect(() => {
    if (tipoSelecionado) {
      carregarCriterios();
    }
  }, [tipoSelecionado]);

  async function carregarTipos() {
    const res = await fetch(
      "http://localhost:3001/api/tipos-avaliacao"
    );

    const data = await res.json();

    setTipos(data);
  }

  async function carregarCriterios() {
    const res = await fetch(
      `http://localhost:3001/api/criterios-avaliacao/${tipoSelecionado}`
    );

    const data = await res.json();

    setCriterios(data);
  }

  async function adicionarCriterio() {
    if (
      !tipoSelecionado ||
      !categoria ||
      !codigo ||
      !criterio
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    const tipoInfo = tipos.find(
      (t) => t.tipo === tipoSelecionado
    );

    await fetch(
      "http://localhost:3001/api/criterios-avaliacao",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: tipoSelecionado,
          tipo_link: tipoInfo?.tipo_link,
          categoria,
          codigo,
          criterio,
          peso,
          indicador,
        }),
      }
    );

    setCategoria("");
    setCodigo("");
    setCriterio("");
    setPeso(1);
    setIndicador("");

    carregarCriterios();
  }

  async function removerCriterio(id: number) {
    if (!confirm("Deseja remover este critério?")) {
      return;
    }

    await fetch(
      `http://localhost:3001/api/criterios-avaliacao/${id}/inativar`,
      {
        method: "PUT",
      }
    );

    carregarCriterios();
  }

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      <Nav />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="custom-scrollbar p-8 overflow-y-auto">

          <div className="rounded-xl border p-6 space-y-6">

            <div>
              <h1 className="text-2xl font-bold">
                Configuração das Fichas
              </h1>

              <p className="text-sm text-gray-500">
                Adicione e remova critérios de avaliação.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Tipo de Avaliação
              </label>

              <select
                value={tipoSelecionado}
                onChange={(e) =>
                  setTipoSelecionado(e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">
                  Selecione
                </option>

                {tipos?.map((tipo) => (
                  <option key={tipo.tipo_link} value={tipo.tipo}>
                    {tipo.tipo}
                  </option>
                ))}
              </select>
            </div>

            {tipoSelecionado && (
              <>
                <div className="border rounded-xl p-4 space-y-3">

                  <h2 className="font-semibold">
                    Novo Critério
                  </h2>

                  <input
                    value={categoria}
                    onChange={(e) =>
                      setCategoria(e.target.value)
                    }
                    placeholder="Categoria"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <input
                    value={codigo}
                    onChange={(e) =>
                      setCodigo(e.target.value)
                    }
                    placeholder="Código"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <textarea
                    value={criterio}
                    onChange={(e) =>
                      setCriterio(e.target.value)
                    }
                    placeholder="Critério"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <input
                    type="number"
                    value={peso}
                    onChange={(e) =>
                      setPeso(Number(e.target.value))
                    }
                    placeholder="Peso"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <input
                    value={indicador}
                    onChange={(e) =>
                      setIndicador(e.target.value)
                    }
                    placeholder="Indicador"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <button
                    onClick={adicionarCriterio}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Adicionar Critério
                  </button>
                </div>

                <div className="border rounded-xl overflow-hidden">

                  <div className="p-4 border-b font-semibold">
                    Critérios da Ficha
                  </div>

                  <div className="divide-y">
                    {criterios.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex justify-between gap-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.codigo}
                          </p>

                          <p className="text-sm">
                            {item.criterio}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.categoria} • Peso {item.peso}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removerCriterio(item.id)
                          }
                          className="text-red-600"
                        >
                          Remover
                        </button>
                      </div>
                    ))}

                    {criterios.length === 0 && (
                      <div className="p-4 text-sm text-gray-500">
                        Nenhum critério encontrado.
                      </div>
                    )}
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}