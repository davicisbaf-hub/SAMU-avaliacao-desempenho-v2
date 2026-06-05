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
    <div className="bg-card border-t border-l border-r rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 text-xs text-muted-foreground border-b border-border">
            <th className="px-4 py-2.5 text-left">Frequência</th>
            <th className="px-4 py-2.5 text-left">Instrumento / Ação</th>
            <th className="px-4 py-2.5 text-left">Responsável</th>
          </tr>
        </thead>

        <tbody className="text-left">
          {dados.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b border-border ${
                index % 2 === 0
                  ? "bg-background"
                  : "bg-muted/20"
              }`}
            >
              <td className="px-4 py-2.5 font-semibold text-primary text-xs text-red-500">
                {item.frequencia}
              </td>

              <td className="px-4 py-2.5 text-foreground text-sm">
                {item.instrumento_acao}
              </td>

              <td className="px-4 py-2.5 text-muted-foreground text-xs">
                {item.responsavel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}