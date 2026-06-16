

type EscalaLikert = {
  nota: number;
  titulo: string;
  descricao: string;
  cor: string;
};

type Peso = {
  valor: number;
  descricao: string;
  cor: string;
};

type Props = {
  codigo: string;
  criterio: string;
  peso: number;
  indicador: string;

  escalaLikert: EscalaLikert[];
  pesos: Peso[];

  onSelecionarNota: (criterio: string, nota: number) => void;
  notaSelecionada: number;

  obrigatorio: boolean;
  tentouEnviar: boolean;
  readOnly?: boolean;
};



export default function TableAvaliacao({
  codigo,
  criterio,
  peso,
  indicador,
  onSelecionarNota,
  notaSelecionada,
  escalaLikert,
  pesos,
  obrigatorio,
  tentouEnviar,
  readOnly = false
}: Props) {

  const classificacao = escalaLikert.find(
    (item) => item.nota === notaSelecionada
  );

  const pesoInfo = pesos.find(
  (item) => item.valor === peso
);

  return (
    <tr
      className={`border-t transition-colors  ${
        tentouEnviar && obrigatorio === undefined
          ? "bg-red-50"
          : "hover:bg-[#e5ecf1]/30"
      }`}
    >
      <td className="py-3 px-4 w-32">
        <span className="text-xs font-mono [text-#555f69] bg-[#e5ecf1] px-1.5 py-0.5 rounded">
          {codigo}
        </span>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-foreground leading-snug">
          {criterio}
          <span className="block text-xs my-2 [text-#555f69] italic">
            {indicador}
          </span>
        </p>
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className="inline-block w-5 h-5 rounded-full text-[10px] font-bold text-white text-center leading-5"
          style={{
            backgroundColor: pesoInfo?.cor,
          }}
        >
          {peso}
        </span>
      </td>

      <td className="py-3 px-4">
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5].map((nota) => {
            const escala = escalaLikert.find(
              (item) => item.nota === nota
            );

            return (
              <button
                key={nota}
                type="button"
                onClick={() => !readOnly && onSelecionarNota(criterio, nota)}
                disabled={readOnly}
                className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all duration-150 ${
                  readOnly ? "cursor-default" : ""
                } ${
                  notaSelecionada !== nota
                    ? "bg-[#fcfcfc] border-[#d2d8de] [text-#555f69] hover:border-[#cd0048]/50"
                    : ""
                }`}
                style={
                  notaSelecionada === nota
                    ? {
                        backgroundColor: escala?.cor,
                        borderColor: escala?.cor,
                        color: "#fff",
                      }
                    : {}
                }
              >
                {nota}
              </button>
            );
          })}
        </div>
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className="text-xs italic font-medium"
          style={{
            color: classificacao?.cor,
          }}
        >
          {classificacao?.titulo ?? "—"}
        </span>
      </td>
    </tr>
  );
}