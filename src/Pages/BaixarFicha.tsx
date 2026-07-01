import Header from '../components/Header'
import Nav from '../components/Nav'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Eye, Download } from "lucide-react";
import { useUserSession } from "../contexts/UserSession";
import { useReactToPrint } from "react-to-print";

import { useEffect, useState, useRef } from "react";
import FichaAvaliacaoTemplate from '../components/FichaAvaliacaoTemplate';
import { useAuthFetch } from "../hooks/useAuthFetch";


type Criterios = {
	categoria: string;
	codigo: string;
	criterio: string;
	peso: number;
	id: string | number;
	indicador: string;
	titulo: string;
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

type Avaliacao = {
	id: number;
	avaliador_nome: string;
	avaliador_funcao: string;
	avaliado_nome: string;
	avaliado_funcao: string;
	funcao: string;
	tipo_avaliacao: string;
	base?: string;
	resultado: Record<string, { nota: number; peso: number; }>;
	observacoes_gerais?: string;
	pontos_melhorar?: string;
	plano_acao?: string;
	criado_em: string;
	avaliacao: string;
};

type Usuario = {
	id: number;
	nome: string;
	email: string;
	funcao: string;
	perfil: string;
	base: string;
};

export default function BaixarFicha() {
	const [filtroUsuario, setFiltroUsuario] = useState("");
	const [filtroFuncao, setFiltroFuncao] = useState("");
	const [filtroTipo, setFiltroTipo] = useState("");
	const [dataInicio, setDataInicio] = useState<Date | null>(null);
	const [dataFim, setDataFim] = useState<Date | null>(null);
	const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
	const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

	const [criterios, setCriterios] = useState<Criterios[]>([]);
	const [escalaLikert, setEscalaLikert] = useState<EscalaLikert[]>([]);
	const [pesos, setPesos] = useState<Peso[]>([]);
	const [bases, setBases] = useState<Base[]>([]);

	const fichaRefParaPdf = useRef<HTMLDivElement>(null);
	const [avaliacaoParaPdf, setAvaliacaoParaPdf] = useState<Avaliacao | null>(null);
	const [criteriosParaPdf, setCriteriosParaPdf] = useState<Criterios[]>([]);
	
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	
	const { user } = useUserSession();
	const userBase = user?.base;
	const isAdminGlobal = user?.perfil === "🔑 Administrador - Todas as bases";
	const isAdmin = user?.perfil === "Administrador";
	const { authFetch } = useAuthFetch();
	

	useEffect(() => {
		carregarUsuarios();
	}, []);

	async function carregarUsuarios() {
		try {
			const res = await authFetch("/api/usuarios");
			const data = await res.json();
			setUsuarios(data);
		} catch (error) {
			console.error(error);
		}
	}

	const imprimirParaPdf = useReactToPrint({
		contentRef: fichaRefParaPdf,
		documentTitle: `Ficha-Avaliacao-${avaliacaoParaPdf?.avaliado_nome}`,
	});

	useEffect(() => {
		authFetch("/api/avaliacoes")
			.then((res) => res.json())
			.then(setAvaliacoes)
			.catch(console.error);
	}, []);

	useEffect(() => {
		Promise.all([
			authFetch("/api/escala-likert").then(r => r.json()),
			authFetch("/api/pesos-avaliacao").then(r => r.json()),
			authFetch("/api/bases").then(r => r.json()),
		]).then(([likert, pesos, bases]) => {
			setEscalaLikert(likert);
			setPesos(pesos);
			setBases(bases);
		}).catch(console.error);
	}, []);

	useEffect(() => {
  		if (!avaliacaoSelecionada) return;

		// Usar critérios salvos na avaliação (histórico) em vez de buscar os atuais
		const criteriosFromResultado = Object.values(avaliacaoSelecionada.resultado)
			.filter((item: any) => item.criterio && item.codigo)
			.map((item: any, idx: number) => ({
				id: String(idx),
				categoria: item.categoria || "Sem categoria",
				codigo: item.codigo,
				criterio: item.criterio,
				peso: item.peso ?? 1,
				indicador: "",
				titulo: item.criterio,
			}));
		
		setCriterios(criteriosFromResultado);
		}, [avaliacaoSelecionada]);
	
	

	// Nomes dos usuários que são da minha base
	// const nomesNaMinhaBase = usuarios
	// 	.filter(u => isAdminGlobal || u.base === userBase)
	// 	.map(u => u.nome);

	const avaliacoesPermitidas = avaliacoes.filter((avaliacao) => {
		const ehAutoavaliacao =
			avaliacao.avaliador_nome === avaliacao.avaliado_nome;

		if (isAdminGlobal) return true;

		// Administrador da base
		if (isAdmin) {
			const usuarioAvaliado = usuarios.find(
			u => u.nome === avaliacao.avaliado_nome
			);

			return usuarioAvaliado?.base === userBase;
		}

		// Usuário comum
		return (
			ehAutoavaliacao &&
			avaliacao.avaliado_nome === user?.nome
		);
	});

	const handleViewClick = (avaliacao: Avaliacao) => {
		setAvaliacaoSelecionada(avaliacao);
	};
	
	const funcoes = [...new Set(avaliacoesPermitidas.map(a => a.funcao))];

	const tipos = [...new Set(avaliacoesPermitidas.map(a => a.tipo_avaliacao))];

		
	const avaliacoesFiltradas = avaliacoesPermitidas.filter((avaliacao) => {
		const dataAvaliacao = new Date(avaliacao.criado_em);

		const passouUsuario =
			!filtroUsuario ||
			avaliacao.avaliado_nome === filtroUsuario;

		const passouFuncao =
			!filtroFuncao ||
			avaliacao.funcao === filtroFuncao;

		const passouTipo =
			!filtroTipo ||
			avaliacao.tipo_avaliacao === filtroTipo;

		const passouDataInicio =
			!dataInicio ||
			dataAvaliacao >= dataInicio;

		const passouDataFim =
			!dataFim ||
			dataAvaliacao <= dataFim;

		return (
			passouUsuario &&
			passouFuncao &&
			passouTipo &&
			passouDataInicio &&
			passouDataFim
		);
		});

	
	const handleDownloadPdf = async (avaliacao: Avaliacao) => {
		try {
			// Reconstruir critérios a partir do resultado salvo na avaliação (histórico)
			const criteriosFromResultado = Object.values(avaliacao.resultado)
				.filter((item: any) => item.criterio && item.codigo)
				.map((item: any, idx: number) => ({
					id: String(idx),
					categoria: item.categoria || "Sem categoria",
					codigo: item.codigo,
					criterio: item.criterio,
					peso: item.peso ?? 1,
					indicador: "",
					titulo: item.criterio,
				}));
			
			setCriteriosParaPdf(criteriosFromResultado);
			setAvaliacaoParaPdf(avaliacao);
			setTimeout(() => {
				imprimirParaPdf();
			}, 100);
		} catch (error) {
			console.error('Erro ao gerar PDF:', error);
		}
	};

	return (
		<div>
			<div className="flex h-screen w-screen bg-white text-black">
				<Nav />

				<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
					<Header />

					<div className='custom-scrollbar p-[32px] overflow-y-auto'>
						<div className="space-y-4">

							<h1 className="text-2xl font-bold">
								Avaliações Enviadas
							</h1>

							<div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3">
								<select
									value={filtroUsuario}
									onChange={(e) => setFiltroUsuario(e.target.value)}
									className="border rounded-lg px-3 py-2"
								>
									<option value="">Avaliado</option>
									{usuarios
										.filter(u => {
											if (isAdminGlobal) return true;

											return (
											u.base === userBase &&
											u.funcao === user?.funcao
											);
										})
										.map(usuario => (
											<option
											key={usuario.nome}
											value={usuario.nome}
											>
											{usuario.nome}
											</option>
									))}
								</select>

								<select
									value={filtroFuncao}
									onChange={(e) => setFiltroFuncao(e.target.value)}
									className="border rounded-lg px-3 py-2"
								>
									<option value="">Funções</option>
									{funcoes.map(funcao => (
										<option key={funcao} value={funcao}>
											{funcao}
										</option>
									))}
								</select>

								<select
									value={filtroTipo}
									onChange={(e) => setFiltroTipo(e.target.value)}
									className="border rounded-lg px-3 py-2"
								>
									<option value="">Tipos</option>
									{tipos.map(tipo => (
										<option key={tipo} value={tipo}>
											{tipo}
										</option>
									))}
								</select>

								<div className="flex gap-2">
									<DatePicker
										selected={dataInicio}
										onChange={(date: Date | null) => setDataInicio(date)}
										dateFormat="dd/MM/yyyy"
										placeholderText="Data inicial"
										className="border rounded-lg px-3 py-2 w-full react-datepicker"
									/>
									<DatePicker
										selected={dataFim}
										onChange={(date: Date | null) => setDataFim(date)}
										dateFormat="dd/MM/yyyy"
										placeholderText="Data final"
										className="border rounded-lg px-3 py-2 w-full react-datepicker"
									/>
								</div>

								<button
									onClick={() => {
										setFiltroUsuario("");
										setFiltroFuncao("");
										setFiltroTipo("");
										setDataInicio(null);
										setDataFim(null);
									}}
									className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
								>
									Limpar filtros
								</button>
							</div>

							<div className="bg-white rounded-xl border overflow-hidden">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-100 border-b">
											<tr className="text-center">
												<th className="px-4 py-3">#</th>
												<th className="px-4 py-3">Avaliado</th>
												<th className="px-4 py-3">Avaliador</th>
												<th className="px-4 py-3">Tipo avaliação</th>
												<th className="px-4 py-3">Data</th>
												<th className="px-4 py-3">Ações</th>
											</tr>
										</thead>

										<tbody>
											{avaliacoesFiltradas.map((avaliacao) => (
												<tr key={avaliacao.id} className="border-b hover:bg-gray-50">
													<td className="px-4 py-3">{avaliacao.id}</td>

													<td className="px-4 py-3 font-medium">
														{avaliacao.avaliado_funcao} - {avaliacao.avaliado_nome}
													</td>

													{avaliacao.avaliador_nome === user?.nome  
														|| avaliacao.avaliador_nome === avaliacao.avaliado_nome 
														|| isAdminGlobal ? (
														<td className="px-4 py-3">
															{avaliacao.avaliador_funcao} - {avaliacao.avaliador_nome}
														</td>
														) : (
														<td className="px-4 py-3 blur select-none pointer-events-none">
															Anônimo
														</td>
													)}
													
													<td className="px-4 py-3">
														<span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
															{avaliacao.tipo_avaliacao}
														</span>
													</td>

													<td className="px-4 py-3">
														{new Date(avaliacao.criado_em).toLocaleDateString("pt-BR")}
													</td>

													<td className="px-4 py-3">
														<div className="flex justify-center gap-2">
															<button
																onClick={() => handleViewClick(avaliacao)}
																className="text-black px-3 py-2 rounded-lg"
																title="Visualizar"
															>
																<Eye />
															</button>

															<button
																onClick={() => handleDownloadPdf(avaliacao)}
																className="text-black px-3 py-2 rounded-lg"
																title="Baixar PDF"
															>
																<Download />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{avaliacaoSelecionada && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-auto p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">
								Ficha de Avaliação - {avaliacaoSelecionada.avaliado_nome}
							</h2>
							<button
								onClick={() => setAvaliacaoSelecionada(null)}
								className="text-2xl font-bold cursor-pointer hover:text-gray-600"
							>
								✕
							</button>
						</div>

						{criterios.length > 0 ? (
							<>
								{(() => {
									const notasMap: Record<string, number> = {};
									criterios.forEach(criterio => {
										const resultadoItem = avaliacaoSelecionada.resultado[criterio.criterio];
										if (resultadoItem && resultadoItem.nota !== undefined) {
											notasMap[criterio.criterio] = resultadoItem.nota;
										}
									});
									return (
										<FichaAvaliacaoTemplate
											tipoAvaliacao={avaliacaoSelecionada.tipo_avaliacao}
											criterios={criterios}
											notas={notasMap}
											escalaLikert={escalaLikert}
											pesos={pesos}
											bases={bases}
											observacoes={avaliacaoSelecionada.observacoes_gerais || ""}
											pontosMelhorar={avaliacaoSelecionada.pontos_melhorar || ""}
											planoAcao={avaliacaoSelecionada.plano_acao || ""}
											userName={avaliacaoSelecionada.avaliado_nome}
											userBase={
												usuarios.find(
													u => u.nome === avaliacaoSelecionada.avaliado_nome
												)?.base || ""
											}
											readOnly={true}
											criado_em={avaliacaoSelecionada.criado_em}
										/>
									);
								})()}
							</>
						) : (
							<div className="flex items-center justify-center py-8">
								<p className="text-gray-500">Carregando dados da avaliação...</p>
							</div>
						)}
					</div>
				</div>
			)}

			{avaliacaoParaPdf && criteriosParaPdf.length > 0 && (
				<div style={{ display: 'none' }}>
					<div ref={fichaRefParaPdf}>
						{(() => {
							const notasMap: Record<string, number> = {};
							criteriosParaPdf.forEach(criterio => {
								const resultadoItem = avaliacaoParaPdf.resultado[criterio.criterio];
								if (resultadoItem && resultadoItem.nota !== undefined) {
									notasMap[criterio.criterio] = resultadoItem.nota;
								}
							});
							return (
								<FichaAvaliacaoTemplate
									tipoAvaliacao={avaliacaoParaPdf.tipo_avaliacao}
									criterios={criteriosParaPdf}
									notas={notasMap}
									escalaLikert={escalaLikert}
									pesos={pesos}
									bases={bases}
									observacoes={avaliacaoParaPdf.observacoes_gerais || ""}
									pontosMelhorar={avaliacaoParaPdf.pontos_melhorar || ""}
									planoAcao={avaliacaoParaPdf.plano_acao || ""}
									userName={avaliacaoParaPdf.avaliado_nome}
									userBase={
										usuarios.find(
											u => u.nome === avaliacaoParaPdf.avaliado_nome
										)?.base || ""
									}
									readOnly={true}
									criado_em={avaliacaoParaPdf.criado_em}
								/>
							);
						})()}
					</div>
				</div>
			)}
		</div>
	);
}
