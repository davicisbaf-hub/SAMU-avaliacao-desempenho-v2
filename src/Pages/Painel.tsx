import Header from '../components/Header'
import Nav from '../components/Nav'


export default function Painel() {

    return (
        <div>
            <div className="flex h-screen w-screen bg-white text-black">
                <Nav />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />

                    {/* conteudo */}
                    <div className='custom-scrollbar p-[32px] overflow-y-auto'>


                        

                    </div>
                </div>
            </div>
        </div>
    )
}