interface KPICardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon?: string;
  cor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray';
  classe?: string;
}

const coresPaleta = {
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' },
};

export default function KPICard({
  titulo,
  valor,
  subtitulo,
  icon,
  cor = 'blue',
  classe,
}: KPICardProps) {
  const cores = coresPaleta[cor];

  return (
    <div className={`${cores.bg} border-2 ${cores.border} rounded-lg p-5 ${classe || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            {titulo}
          </p>
          <p className={`text-3xl font-bold ${cores.text}`}>
            {valor}
          </p>
          {subtitulo && (
            <p className="text-xs text-gray-500 mt-2">
              {subtitulo}
            </p>
          )}
        </div>
        {icon && (
          <div className={`text-4xl ${cores.icon} opacity-20`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
