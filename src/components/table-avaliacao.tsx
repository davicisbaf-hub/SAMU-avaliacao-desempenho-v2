type Criterios = {
    codigo: string;
    criterio: string;
    peso: number;
};


export default function TableAvaliacao({codigo, criterio, peso}: Criterios) {
  return (
    <tr className="border-t hover:bg-muted/30 transition-colors group">
        <td className="py-3 px-4 w-32">
        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {codigo}
        </span>
        </td>

        <td className="py-3 px-4">
        <p className="text-sm text-foreground leading-snug">
            {criterio}
        </p>
        </td>

        <td className="py-3 px-4 text-center">
        <span className="inline-block w-5 h-5 rounded-full text-[10px] font-bold text-white text-center leading-5 bg-[#cd0048]">
            {peso}
        </span>
        </td>

        <td className="py-3 px-4">
        <div className="flex gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5].map((nota) => (
            <button
                key={nota}
                type="button"
                className="w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all duration-150 bg-background border-border text-muted-foreground hover:border-primary/50"
            >
                {nota}
            </button>
            ))}
        </div>
        </td>

        <td className="py-3 px-4 text-center">
        <span className="text-xs text-muted-foreground italic">
            —
        </span>
        </td>
    </tr>
  )
}