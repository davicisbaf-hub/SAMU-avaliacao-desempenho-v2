interface StatusCardsKPIProps {
  categoriasBom: number;
  categoriasAtenção: number;
  categoriasRisco: number;
}

export default function StatusCardsKPI({ categoriasBom, categoriasAtenção, categoriasRisco }: StatusCardsKPIProps) {
  return (
    <div className='grid grid-cols-3 gap-3'>
      <div className='rounded-xl border p-4 text-center bg-emerald-50 border-emerald-200'>
        <p className='text-2xl font-bold text-[#10b981]'>{categoriasBom}</p>
        <p className='text-xs font-semibold mt-0.5 text-[#10b981]'>Acima de 4.0</p>
      </div>

      <div className='rounded-xl border p-4 text-center bg-yellow-50 border-yellow-200'>
        <p className='text-2xl font-bold text-[#f59e0b]'>{categoriasAtenção}</p>
        <p className='text-xs font-semibold mt-0.5 text-[#f59e0b]'>Entre 3.0 e 3.9</p>
      </div>

      <div className='rounded-xl border p-4 text-center bg-red-50 border-red-200'>
        <p className='text-2xl font-bold text-[#ef4444]'>{categoriasRisco}</p>
        <p className='text-xs font-semibold mt-0.5 text-[#ef4444]'>Abaixo de 3.0</p>
      </div>
    </div>
  );
}
