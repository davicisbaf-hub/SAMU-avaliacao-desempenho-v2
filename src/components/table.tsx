type Frequencia = {
  id: number;
  frequencia: string;
  instrumento_acao: string;
  responsavel: string;
};

type FrequenciaTableProps = {
  dados: Frequencia[];
};

export default function FrequenciaTable({
  dados,
}: FrequenciaTableProps) {
  return (
    <div className="bg-card border-[#d2d8de] border-t border-l border-r rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#e5ecf1]/50 text-xs [text-#555f69] border-b border-border border-[#d2d8de]">
            <th className="px-4 py-2.5 text-left">Frequência</th>
            <th className="px-4 py-2.5 text-left">Instrumento / Ação</th>
            <th className="px-4 py-2.5 text-left">Responsável</th>
          </tr>
        </thead>

        <tbody className="text-left">
          {dados.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b border-[#d2d8de] border-border ${
                index % 2 === 0
                  ? "bg-[#fcfcfc]"
                  : "bg-[#e5ecf1]/20"
              }`}
            >
              <td className="px-4 py-2.5 font-semibold text-[#cd0048] text-xs text-red-500">
                {item.frequencia}
              </td>

              <td className="px-4 py-2.5 text-foreground text-sm">
                {item.instrumento_acao}
              </td>

              <td className="px-4 py-2.5 [text-#555f69] text-xs">
                {item.responsavel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}