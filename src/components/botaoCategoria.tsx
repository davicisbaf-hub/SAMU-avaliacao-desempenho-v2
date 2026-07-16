type Props = {
    respondidos: number;
    categoria: string;
    itens: any[];
    aberto: boolean;
    onClick: () => void;
}

export default function BotaoCategoria({ 
    respondidos, 
    categoria, 
    itens, 
    aberto,
    onClick 
}: Props) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#e5ecf1]/30 transition-colors text-left bg-white"
        >
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-5 rounded-full bg-[#cd0048]" />

                <h2 className="font-semibold text-[#0e1216] text-sm">
                    {categoria}
                </h2>

                <span className="text-xs [text-#555f69]">
                    {respondidos} / {itens.length} respondidos {respondidos === itens.length && (<span className="text-emerald-600 text-xs font-medium">✓ Completo</span>)}
                </span>
            </div>

            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                {aberto ? (
                    <path d="m6 9 6 6 6-6" />
                ) : (
                    <path d="m18 15-6-6-6 6" />
                )}
            </svg>
        </button>
    );
}