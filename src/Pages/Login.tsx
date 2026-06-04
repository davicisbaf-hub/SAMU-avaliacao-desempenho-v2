import '../App.css'

function App() {

  return (
    <div className="login w-[100vw] text-center flex items-center justify-center p-4">
      <div className='w-full max-w-md'>
        
        <div className='mb-8'>
        
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#cd0048] shadow-lg mb-4'>
            <span className='text-white font-black text-2xl'>
              192
            </span>
          </div>

          <h1 className='text-2xl font-bold text-white mt-4'>SAMU 192</h1>
          <p className='text-[#f8f8f8]/70 text-sm mt-1'>Sistema de Avaliação de Desempenho 360°</p>
          <p className='text-[#f8f8f8]/50 text-xs mt-0.5'>CRUR-BF / CISBAF — Baixada Fluminense</p>
        
        </div>

        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          
          <div className='bg-[#cd0048] px-6 py-4'>
            <div className='flex items-center gap-2 text-white font-bold'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lov-id="src\pages\Login.tsx:127:14" data-lov-name="Shield" data-component-path="src\pages\Login.tsx" data-component-line="127" data-component-file="Login.tsx" data-component-name="Shield" data-component-content="%7B%22className%22%3A%22text-primary-foreground%22%7D"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
              <p>Acesso Restrito por Perfil</p>
            </div>
            <p className='text-[#f8f8f8]/70 text-sm mt-1 text-left'>Coordenação/Admin: acesso ao painel completo.</p>
            <p className='text-[#f8f8f8]/70 text-sm mt-1 text-left'>Profissional: apenas autoavaliação.</p>  
          </div>

          <div className='grid grid-cols-2 gap-2 p-4 border-b border-border'>
              <button className='flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all border-primary bg-primary/5 text-primary'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lov-id="src\pages\Login.tsx:144:14" data-lov-name="Shield" data-component-path="src\pages\Login.tsx" data-component-line="144" data-component-file="Login.tsx" data-component-name="Shield" data-component-content="%7B%7D"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                <span>Admin / Coordenação</span>
                <span className='text-[10px] font-normal opacity-70'>Acesso completo</span>
              </button>

              <button className='flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all border-primary bg-primary/5 text-primary'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lov-name="UserCircle2" data-component-path="src\pages\Login.tsx" data-component-line="155" data-component-file="Login.tsx" data-component-name="UserCircle2" data-component-content="%7B%7D"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><circle cx="12" cy="12" r="10"></circle></svg>
                <span>Profissional</span>
                <span className='text-[10px] font-normal opacity-70'>Autoavaliação / bp-TEAM</span>
              </button>
          </div>

          <form className='p-6 space-y-4'>
            <div className='space-y-2 text-left'>  
              <label className='text-sm font-semibold text-black text-foreground'>Acesso / Base de Lotação</label>
              <select className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition'>
                <option value="">Selecione seu acesso…</option>
                <optgroup label="── Administração ──">
                  <option value="admin">🔑 Administrador CRUR-BF (todas as bases)</option>
                </optgroup>
              </select>
            </div>

            <div className='space-y-2 text-left'>
              <label className='text-sm font-semibold text-black text-foreground'>Senha de Acesso</label>
              <div className='relative'>
                <input type="password" placeholder="Digite a senha…" className="w-full border border-input bg-background rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" ></input>
              </div>
            </div>

            <button className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#cd0048] text-white font-semibold text-sm hover:opacity-90 transition-opacity'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>
              Entrar
            </button>
          </form>
        </div>
        
        <p className='text-[#f8f8f8]/70 text-sm mt-4'>SAMU 192 · CRUR-BF · CISBAF · Baixada Fluminense – RJ</p>
    
      </div>
    </div>
  )
}

export default App
