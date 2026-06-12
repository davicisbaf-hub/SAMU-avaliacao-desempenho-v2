import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from "react";
import TableAvaliacao from '../components/table-avaliacao';
import TextArea from '../components/TextArea';
import Assinatura from '../components/Assinatura';
import { useUserSession } from "../contexts/UserSession";

type Criterios = {
	categoria: string;
	codigo: string;
	criterio: string;
	peso: number;
	id: number;
	indicador: string;
	titulo: string;
};


const iconByTipo: Record<string, string> = {
	"BP-TEAM": "⚕️",
	"Condutor": "🚑",
	"Técnico de Enfermagem": "💉",
	"Enfermeiro": "🩺",
	"Médico": "⚕️",
};

type EscalaLikert = {
  nota: number;
  titulo: string;
  descricao: string;
  cor: string;
};

type Peso = {
  valor: number;
  descricao: string;
  cor: string;
};

type Base = {
    id: number;
    nome: string;
    cor: string;
};


export default function AvaliacaoPage() {
	const [bases, setBases] = useState<Base[]>([]);
	const { user } = useUserSession();

	const [tipoAvaliacao, setTipoAvaliacao] = useState(`${user?.funcao}`);
	const [criterios, setCriterios] = useState<Criterios[]>([]);
	const [notas, setNotas] = useState<Record<string, number>>({});
	
	const [escalaLikert, setEscalaLikert] = useState<EscalaLikert[]>([]);
	const [pesos, setPesos] = useState<Peso[]>([]);
	const [tentouEnviar, setTentouEnviar] = useState(false);

	const enviarAvaliacao = async () => {
		setTentouEnviar(true);

		const criteriosNaoRespondidos = criterios.filter(
			(criterio) => notas[criterio.criterio] === undefined
		);

		if (criteriosNaoRespondidos.length > 0) {
			alert(
				`Existem ${criteriosNaoRespondidos.length} perguntas sem resposta.`
			);
			return;
		}

		try {
			const response = await fetch(
			"http://localhost:46241/api/avaliacoes",
			{
				method: "POST",
				headers: {
				"Content-Type": "application/json",
				},
				body: JSON.stringify({
				usuarioId: user?.id,
				tipoAvaliacao,
				resultado: notas,
				}),
			}
			);

			const data = await response.json();

			console.log("Salvo:", data);
		} catch (error) {
			console.error(error);
		}
	};


	useEffect(() => {
        async function carregarBases() {
            const res = await fetch("http://localhost:46241/api/bases"); // sua rota backend
            const data = await res.json();

            setBases(data);
        }
        carregarBases();
    }, []);


	useEffect(() => {
	fetch("http://localhost:46241/api/escala-likert")
		.then((r) => r.json())
		.then(setEscalaLikert);

	fetch("http://localhost:46241/api/pesos-avaliacao")
		.then((r) => r.json())
		.then(setPesos);
	}, []);

	const selecionarNota = (codigo: string, nota: number) => {
		setNotas((prev) => {
			const atualizado = {
				...prev,
				[codigo]: nota,
			};

			return atualizado;
		});
	};

	const carregar = async (url: string, setter: Function) => {
		try {
			const res = await fetch(url);
			const data = await res.json();
			setter(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		carregar(
			`http://localhost:46241/api/criterios-avaliacao/${tipoAvaliacao}`,
			setCriterios
		);
	}, [tipoAvaliacao]);

	const criteriosPorCategoria = criterios.reduce((acc, criterio) => {
		if (!acc[criterio.categoria]) {
			acc[criterio.categoria] = [];
		}

		acc[criterio.categoria].push(criterio);

		return acc;
	}, {} as Record<string, Criterios[]>);

	return (
		<div>
			<div className="flex h-screen w-screen bg-white text-black">
				<Nav />

				<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
					<Header />

					{/* conteudo */}
					<div className='custom-scrollbar p-[32px] overflow-y-auto text-left'>

						<div className='space-y-6'>

							{/* titulo */}
							<h1 className='text-2xl font-bold text-foreground'>Autoavaliação & Simulação bp-TEAM</h1>
							<p className='[text-#555f69] mt-1 text-sm'>O profissional avalia sua própria performance, ou aplique a ferramenta bp-TEAM validada em cenários de simulação realística</p>

							{/* acesso */}
							<div className='flex items-center gap-3 bg-[#cd0048]/10 border border-[#cd0048]/30 rounded-xl px-4 py-3'>
								<span className='text-2xl'>💉</span>
								<div>
									<p className='font-semibold text-sm text-foreground'>
										Acesso como:
										<span className='text-[#cd0048]'> {user?.funcao}</span>
									</p>
									<p className='text-xs [text-#555f69]'>Você tem acesso à sua autoavaliação e à simulação bp-TEAM.</p>
								</div>
							</div>

							{/* selecao ficha */}
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
								<button
									onClick={() => setTipoAvaliacao("BP-TEAM")}
									className={`text-left p-4 rounded-xl border-2 transition-all ${
										tipoAvaliacao === "BP-TEAM"
											? "border-[#cd0048] bg-[#cd0048]/10 shadow-sm"
											: "border-[#d2d8de] bg-[#f6f6f6] hover:border-[#cd0048]/40"
									}`}
								>
									<p className='font-semibold text-sm text-foreground'>
										Simulação bp-TEAM
									</p>
									<p className='text-xs [text-#555f69] mt-1'>
										Avaliação em cenário simulado — Liderança, Trabalho em Equipe, Gerenciamento de Tarefas e NTS
									</p>
								</button>

								<button
									onClick={() => setTipoAvaliacao(`${user?.funcao}`)}
									className={`text-left p-4 rounded-xl border-2 transition-all ${
										tipoAvaliacao === user?.funcao
											? "border-[#cd0048] bg-[#cd0048]/10 shadow-sm"
											: "border-[#d2d8de] bg-[#f6f6f6] hover:border-[#cd0048]/40"
									}`}
								>
									<p className='font-semibold text-sm text-foreground'>
										Autoavaliação: {user?.funcao}
									</p>
									<p className='text-xs [text-#555f69] mt-1'>
										O condutor avalia sua própria performance técnica e comportamental
									</p>
								</button>
							</div>

							{/* header de avaliacao */}
							<div className='bg-[#0a1a30] text-white rounded-lg mb-8'>
								<div className='flex items-center gap-4 p-5'>
									<div className='w-14 h-14 rounded-xl bg-[#cd0048] flex items-center justify-center shrink-0'>
										<span className="text-2xl">
											{iconByTipo[tipoAvaliacao]}
										</span>
									</div>
									<div className='flex-1'>
										<div className='flex items-center gap-2 flex-wrap'>
											<h1 className='text-lg font-bold text-[#f8f8f8]'>Ficha de Avaliação de Desempenho</h1>
											<span className='bg-[#cd0048]/20 text-white/80 text-xs px-2 py-0.5 rounded-full font-medium border border-[#cd0048]/30'>Autoavaliação: {tipoAvaliacao}</span>
										</div>
										<p className='text-[#f8f8f8]/70 text-sm mt-0.5'>{tipoAvaliacao} — SAMU 192 / CRUR-BF / CISBAF</p>
									</div>
									<div className='text-right hidden sm:block'>
										<p className='text-[#f8f8f8]/60 text-xs'>Data</p>
										<p className='text-[#f8f8f8] font-mono text-sm'>{new Date().toLocaleDateString()}</p>
									</div>
								</div>
								<div className='bg-[#061c31]/50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4'>
									<div>
										<label className='text-[#f8f8f8]/70 text-xs font-medium block mb-1'>Base de Lotação</label>
										<select className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#cd0048] appearance-none'>
											<option className='text-black'>
												Selecione a base…
											</option>
											{bases.map((bases) => (
												<option key={bases.id} value={bases.id} className='text-black'>
													{bases.nome}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className='text-[#f8f8f8]/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
										<input className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] placeholder:text-[#f8f8f8]/30 focus:outline-none focus:ring-2 focus:ring-[#cd0048]' placeholder="Ex: Dr. Roberto Alves"></input>
									</div>
									<div>
										<label className='text-[#f8f8f8]/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
										<input className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] placeholder:text-[#f8f8f8]/30 focus:outline-none focus:ring-2 focus:ring-[#cd0048]' placeholder="Ex: Dr. Roberto Alves"></input>
									</div>
									<div>
										<label className='text-[#f8f8f8]/70 text-xs font-medium block mb-1'>Nome do Avaliador</label>
										<input className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] placeholder:text-[#f8f8f8]/30 focus:outline-none focus:ring-2 focus:ring-[#cd0048]' placeholder="Ex: Dr. Roberto Alves"></input>
									</div>
								</div>
							</div>

							{/* escala de pontuacao */}
							<div className="bg-[#e5ecf1]/50 rounded-xl p-4 ">
								<p className="text-xs font-semibold [text-#555f69] uppercase tracking-wider mb-3">
									Escala de Pontuação Likert — 1 a 5
								</p>

								<div className="flex flex-col gap-3">
									{escalaLikert.map((item) => (
										<div
											key={item.nota}
											className="flex items-center gap-2"
										>
											<span
												className="w-6 h-6 rounded text-xs font-bold text-white flex items-center justify-center"
												style={{
													backgroundColor: item.cor,
												}}
											>
											{item.nota}
											</span>
											<span className="text-xs text-foreground">
												<span
													className="font-medium">
													{item.titulo}
												</span>

												<span className="[text-#555f69]">
													{" "}
													— {item.descricao}
												</span>
											</span>
										</div>
										))}
								</div>

								<div className="flex flex-wrap gap-4 mt-4 text-xs [text-#555f69] border-t border-border pt-3">
									{pesos.map((peso) => (
										<span
											key={peso.valor}
											className="flex items-center gap-2"
										>
											<span
												className="inline-block w-5 h-5 rounded-full text-[10px] font-bold text-white text-center leading-5"
												style={{
													backgroundColor: peso.cor,
												}}
												>
												{peso.valor}
											</span>

											{peso.descricao}
										</span>
									))}
								</div>
							</div>

							{/* PErguntas */}
							{Object.entries(criteriosPorCategoria).map(
								([categoria, itens]) => (
									<div key={categoria} className="bg-card border border-[#d2d8de] rounded-xl overflow-hidden">

										<button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#e5ecf1]/30 transition-colors text-left">
											<div className="flex items-center gap-3">
												<div className="w-1.5 h-5 rounded-full bg-[#cd0048]" />

												<h2 className="font-semibold text-[#0e1216] text-sm">{categoria}</h2>
												<span className="text-xs [text-#555f69]">0 / {itens.length} respondidos</span>
											</div>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
										</button>
										<div>
											<div className="overflow-x-auto">

												<table className="w-full">
													<thead>
														<tr className="bg-[#e5ecf1]/50 text-xs [text-#555f69] border-b border-[#d2d8de]">
															<th className="px-4 py-2 text-left w-28">Código</th>
															<th className="px-4 py-2 text-left">
																Critério de Avaliação / Indicador
															</th>
															<th className="px-4 py-2 text-center w-16">Peso</th>
															<th className="px-4 py-2 text-left min-w-56">
																Pontuação (1–5)
															</th>
															<th className="px-4 py-2 text-center w-32">
																Classificação
															</th>
														</tr>
													</thead>

													<tbody>
														{itens.map((criterio) => (
															<TableAvaliacao
																pesos={pesos}
																key={criterio.codigo}
																codigo={criterio.codigo}
																criterio={criterio.criterio}
																peso={criterio.peso}
																indicador={criterio.indicador}
																escalaLikert={escalaLikert}
																notaSelecionada={notas[criterio.criterio]}
																onSelecionarNota={selecionarNota}
																obrigatorio={!notas[criterio.criterio]}
																tentouEnviar={tentouEnviar}

															/>
														))}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								)
							)}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<TextArea titulo="Observações Gerais" placeholder="Pontos positivos, contexto da avaliação, situações específicas observadas..." />
								<TextArea titulo="Pontos a Melhorar (Lacunas Identificadas)" placeholder="Competências que requerem desenvolvimento, erros recorrentes, lacunas técnicas..." />
								<TextArea titulo="Plano de Ação / PDI Sugerido" placeholder="Cursos, treinamentos, simulações, mentoria, prazo previsto..." />
							</div>
							<div className='bg-card border border-border rounded-xl p-5'>
								<h3 className='text-sm font-semibold text-[#0e1216] mb-4'>Assinaturas e Ciência</h3>
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
									<Assinatura Responsavel="Avaliador" />
									<Assinatura Responsavel="Avaliado / Profissional" />
									<Assinatura Responsavel="Coordenação / Chefia Imediata" />
								</div>
							</div>
							<button onClick={enviarAvaliacao} className='mt-4 px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-500/90 transition-colors'>
								Finalizar e Imprimir Ficha
							</button>
							<p className='text-xs [text-#555f69] text-center print:hidden'>
								Instrumento baseado em bp-TEAM (validado em português), Habilidades Não Técnicas (NTS), Portaria MS 2.048/2002 e Processo de Enfermagem no SAMU (Pizzolato et al., 2023). Avaliação com foco na melhoria contínua da qualidade assistencial — caráter educativo, não punitivo.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}