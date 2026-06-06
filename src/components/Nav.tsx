import { useNavigate } from "react-router";
import { useUserSession } from "../contexts/UserSession";


export default function Nav() {
  
    const navigate = useNavigate();
    const { logout } = useUserSession();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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

        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2 space-y-0.5 text-left">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150  text-sidebar-[#cd0048]/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                Inicio
            </a>
            <a href="/KPIs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150  text-sidebar-[#cd0048]/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
                Painel de KPIs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150  text-sidebar-[#cd0048]/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                Baixar Fichas (PDF)
            </a>
            <a href="/instrucao" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150  text-sidebar-[#cd0048]/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                Como Avaliar
            </a>

            <div className='pt-3 pb-1'>
                <p className='px-3 text-[12px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1'>
                    Fichas de Avaliação
                </p>
                <a href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                    Condutor Socorrista
                </a>
                <a href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                    Condutor Socorrista
                </a>
                <a href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                    Condutor Socorrista
                </a>
                <a href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                    Condutor Socorrista
                </a>
                <a href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ml-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                    Condutor Socorrista
                </a>
            </div>

            <div className='pt-3 pb-1'>
                <p className='px-3 text-[12px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1'>
                    Ferramentas
                </p>
                <a href="avaliacao" className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-sidebar-primary text-sidebar-primary-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                    Autoavaliação / bp-TEAM
                </a>
                <a className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-sidebar-primary text-sidebar-primary-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
                    Plano de Desenvolvimento
                </a>
                <a className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 bg-sidebar-primary text-sidebar-primary-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Cadastro de Profissionais
                </a>
            </div>
        </nav>
        <div className='px-4 py-3 border-t border-sidebar-border'>
            <button onClick={handleLogout} className='w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                Sair
            </button>
            <p className='text-sidebar-foreground/30 text-[10px] mt-2 leading-relaxed px-1'>bp-TEAM · NTS · Portaria MS 2.048/2002</p>
        </div>
      </div>
    </aside>
  )
}