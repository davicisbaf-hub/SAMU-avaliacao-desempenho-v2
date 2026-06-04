export default function Nav() {
  return (
    <aside className="bg-[#0a1a30] lg:flex w-64 flex-col text-white shrink-0 border-r border-sidebar-border">
      <div className="flex flex-col h-full">

        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl bg-[#cd0048] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">192</span>
            </div>
            <div>
                <p className="text-sidebar-foreground font-bold text-sm leading-tight">SAMU 192</p>
                <p className="text-sidebar-foreground/60 text-xs">CRUR-BF / CISBAF</p>
            </div>
        </div>
    
        <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="rounded-lg px-3 py-2 text-xs text-left bg-[#cd0048]/20">
                <span className="text-[#cd0048] text-[10px] font-bold uppercase tracking-wide">🔑 Administrador</span>
                <p className="text-sidebar-foreground font-semibold leading-tight truncate">Administrador CRUR-BF</p>
            </div>
        </div>
    
        <div className="relative px-3 pb-2 pt-2">
            Todas as bases
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-[#cd0048] text-sidebar-[#cd0048]/70">
                Inicio
            </a>
            <a href="/KPIs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-[#cd0048] text-sidebar-[#cd0048]/70">
                Painel de KPIs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-[#cd0048] text-sidebar-[#cd0048]/70">
                Baixar Fichas (PDF)
            </a>
            <a href="/instrucao" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-[#cd0048] text-sidebar-[#cd0048]/70">
                Como Avaliar
            </a>
        </nav>

      </div>
    </aside>
  )
}