import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from "react";
import TableAvaliacao from '../components/table-avaliacao';
import TextArea from '../components/TextArea';
import Assinatura from '../components/Assinatura';
import { useUserSession } from "../contexts/UserSession";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
	"Liderança": "👤",
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


export default function FichaAvaliacaoLideradoLideranca() {
	const [bases, setBases] = useState<Base[]>([]);
	const { user } = useUserSession();

	const [tipoAvaliacao, setTipoAvaliacao] = useState<string>("");
	const [criterios, setCriterios] = useState<Criterios[]>([]);
	const [notas, setNotas] = useState<Record<string, number>>({});

	const [escalaLikert, setEscalaLikert] = useState<EscalaLikert[]>([]);
	const [pesos, setPesos] = useState<Peso[]>([]);

	const [tentouEnviar, setTentouEnviar] = useState(false);
	const [usuarios, setUsuarios] = useState([]);
	const [avaliadoId, setAvaliadoId] = useState("");
	const [avaliado, setAvaliado] = useState<any>(null);


	const [observacoes, setObservacoes] = useState("");
	const [pontosMelhorar, setPontosMelhorar] = useState("");
	const [planoAcao, setPlanoAcao] = useState("");
	const fichaRef = useRef<HTMLDivElement>(null);

	const imprimirFicha = useReactToPrint({
		contentRef: fichaRef,
		documentTitle: "Ficha-Avaliacao",
	});

	const enviarAvaliacao = async () => {
		setTentouEnviar(true);

		if (!avaliado) {
			alert("Selecione um avaliado.");
			return;
		}

		const criteriosNaoRespondidos = criterios.filter(
			(criterio) => notas[criterio.criterio] === undefined
		);

		if (criteriosNaoRespondidos.length > 0) {
			alert(
				`Existem ${criteriosNaoRespondidos.length} perguntas sem resposta.`
			);
			return;
		}

		const resultado = criterios.reduce((acc, criterio) => {
			acc[criterio.criterio] = {
				criterio: criterio.criterio,
				codigo: criterio.codigo,
				nota: notas[criterio.criterio],
				peso: criterio.peso ?? 2,
				categoria: criterio.categoria,
			};

			return acc;
		}, {} as Record<string, any>);

		try {
			const response = await fetch(
				"http://localhost:3001/api/avaliacoes",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						avaliadorId: user?.id,
						avaliadoId: avaliado?.id,
						tipoAvaliacao,
						resultado,

						observacoesGerais: observacoes,
						pontosMelhorar,
						planoAcao,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Erro ao salvar avaliação");
			}

			const data = await response.json();

			console.log("Salvo:", data);

			alert("Avaliação salva com sucesso!");

		} catch (error) {
			console.error(error);
			alert("Erro ao salvar avaliação.");
		}
	};

	useEffect(() => {
		async function carregarBases() {
			const res = await fetch("http://localhost:3001/api/bases"); // sua rota backend
			const data = await res.json();

			setBases(data);
		}
		carregarBases();
	}, []);


	useEffect(() => {
		fetch("http://localhost:3001/api/escala-likert")
			.then((r) => r.json())
			.then(setEscalaLikert);

		fetch("http://localhost:3001/api/pesos-avaliacao")
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
			`http://localhost:3001/api/criterios-avaliacao-liderado/${tipoAvaliacao}`,
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


	useEffect(() => {
		fetch("http://localhost:3001/api/usuarios")
			.then(r => r.json())
			.then(setUsuarios);
	}, []);

	const usuariosDisponiveis = usuarios.filter((u) => {
		// MÉDICO
		if (user?.funcao === "Médico") {
			return (
				u.funcao === "Médico" &&
				u.perfil !== user.perfil
			);
		}

		// CONDUTOR
		if (user?.funcao === "Condutor") {
			return (
				u.funcao === "Condutor" &&
				u.perfil !== user.perfil
			);
		}

		// ENFERMEIRO E TÉCNICO
		if (
			user?.funcao === "Enfermeiro" ||
			user?.funcao === "Técnico de Enfermagem"
		) {
			return (
				(
					u.funcao === "Enfermeiro" ||
					u.funcao === "Técnico de Enfermagem"
				) &&
				u.perfil !== user.perfil
			);
		}

		return false;
	});
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
								<div>
									<label className='mr-4'>
										Avaliado:
									</label>

									<select
										value={avaliadoId}
										onChange={(e) => {
											const id = Number(e.target.value);

											const selecionado = usuarios.find(
												(u: any) => u.id === id
											);

											setAvaliadoId(e.target.value);
											setAvaliado(selecionado);

											if (selecionado?.funcao) {
												setTipoAvaliacao(selecionado.funcao);
												setNotas({}); // limpa notas ao trocar de avaliado
											}
										}}
										className="border p-1 rounded"
									>
										<option value="">
											Selecione...
										</option>

										{usuariosDisponiveis.map((u: any) => (
											<option key={u.id} value={u.id}>
												{u.nome} - {u.funcao}
											</option>
										))}
									</select>
								</div>

							</div>

							<div
								ref={fichaRef}
								className="print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]"
							>
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
												{bases
													.filter(base => base.nome === user?.base)
													.map(base => (
														<option
														key={base.id}
														value={base.id}
														className="text-black"
														>
														{base.nome}
														</option>
													))
												}
											</select>
										</div>
										<div>
											<label className='text-[#f8f8f8]/70 text-xs font-medium block mb-1'>Nome do AutoAvaliador</label>
											<input
												className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] placeholder:text-[#f8f8f8]/30 focus:outline-none focus:ring-2 focus:ring-[#cd0048]' placeholder="Ex: Dr. Roberto Alves"
												value={user?.nome || ""}
												disabled
											/>
										</div>
									</div>
								</div>

								{/* escala de pontuacao */}
								<div className="bg-[#e5ecf1]/50 rounded-xl p-4 pontuacao">
									<p className="text-xs font-semibold [text-#555f69] uppercase tracking-wider mb-3">
										Escala de Pontuação Likert — 1 a 5
									</p>

									<div className="flex flex-col gap-3 ">
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
										<div key={categoria} className="bg-card border border-[#d2d8de] rounded-xl overflow-hidden ">

											<button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#e5ecf1]/30 transition-colors text-left bg-white">
												<div className="flex items-center gap-3">
													<div className="w-1.5 h-5 rounded-full bg-[#cd0048]" />

													<h2 className="font-semibold text-[#0e1216] text-sm">{categoria}</h2>
													<span className="text-xs [text-#555f69]">0 / {itens.length} respondidos</span>
												</div>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
											</button>
											<div className='bg-white'>
												<div className="overflow-x-auto bg-white">

													<table className="w-full bg-white">
														<thead>
															<tr className="bg-[#e5ecf1]/50 text-xs [text-#555f69] border-b border-[#d2d8de] bg-white">
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
																	peso={1}
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
									<TextArea
										titulo="Observações Gerais"
										placeholder="Pontos positivos..."
										rows={4}
										value={observacoes}
										onChange={(e) => setObservacoes(e.target.value)}
									/>

									<TextArea
										titulo="Pontos a Melhorar (Lacunas Identificadas)"
										placeholder="Competências que requerem desenvolvimento..."
										rows={4}
										value={pontosMelhorar}
										onChange={(e) => setPontosMelhorar(e.target.value)}
									/>

									<TextArea
										titulo="Plano de Ação / PDI Sugerido"
										placeholder="Cursos, treinamentos..."
										rows={4}
										value={planoAcao}
										onChange={(e) => setPlanoAcao(e.target.value)}
									/>
								</div>
								<div className='bg-card border border-border rounded-xl p-5'>
									<h3 className='text-sm font-semibold text-[#0e1216] mb-4'>Assinaturas e Ciência</h3>
									<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
										<Assinatura Responsavel="Avaliador" />
										<Assinatura Responsavel="Avaliado / Profissional" />
										<Assinatura Responsavel="Coordenação / Chefia Imediata" />
									</div>
								</div>
							</div>

							<div className='flex gap-4 '>
								<button onClick={enviarAvaliacao} className='mt-4 px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-500/90 transition-colors'>
									Finalizar
								</button>
								<button onClick={imprimirFicha} className='mt-4 px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-500/90 transition-colors'>
									Imprimir Ficha
								</button>
							</div>
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