import { useUserSession } from "../contexts/UserSession";

export default function Header() {

    const { user } = useUserSession();

    return (
        <header className='shrink-0 h-14 border-b border-border bg-background/95 flex items-center gap-4 px-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground truncate'>
                <span className='font-semibold text-foreground'>Avaliação de Desempenho</span>
                <span className='hidden sm:inline'>·</span>
                <span className='hidden sm:inline'>Equipe SAMU 192</span>
            </div>

            <div className='ml-auto flex items-center gap-2'>
                <span className='hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cd0048]/10 text-[#cd0048] text-xs font-medium'>
                    {user?.perfil}
                </span>
                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cd0048]/10 text-[#cd0048] text-xs font-medium'>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cd0048] animate-pulse"></span>
                    360°
                </span>                
            </div>
        </header>
    )
}