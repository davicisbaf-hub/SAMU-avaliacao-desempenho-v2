import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TableAvaliacao from './table-avaliacao';
import Assinatura from './Assinatura';

type Criterios = {
	categoria: string;
	codigo: string;
	criterio: string;
	peso: number;
	id: number;
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

type Props = {
	tipoAvaliacao: string;
	criterios: Criterios[];
	notas: Record<string, number>;
	escalaLikert: EscalaLikert[];
	pesos: Peso[];
	bases: Base[];
	observacoes: string;
	pontosMelhorar: string;
	planoAcao: string;
	userName?: string;
	userBase?: string;
	selecionarNota?: (codigo: string, nota: number) => void;
	tentouEnviar?: boolean;
	readOnly?: boolean;
	onPrint?: () => void;
};

const iconByTipo: Record<string, string> = {
	"BP-TEAM": "⚕️",
	"Condutor": "🚑",
	"Técnico de Enfermagem": "💉",
	"Enfermeiro": "🩺",
	"Médico": "⚕️",
};

export default function FichaAvaliacaoTemplate({
	tipoAvaliacao,
	criterios,
	notas,
	escalaLikert,
	pesos,
	bases,
	observacoes,
	pontosMelhorar,
	planoAcao,
	userName = "",
	userBase = "",
	selecionarNota = () => {},
	tentouEnviar = false,
	readOnly = false,
	onPrint = () => {},
}: Props) {
	const fichaRef = useRef<HTMLDivElement>(null);

	const imprimirFicha = useReactToPrint({
		contentRef: fichaRef,
		documentTitle: "Ficha-Avaliacao",
		onAfterPrint: onPrint,
	});

	const criteriosPorCategoria = criterios.reduce((acc, criterio) => {
		if (!acc[criterio.categoria]) {
			acc[criterio.categoria] = [];
		}
		acc[criterio.categoria].push(criterio);
		return acc;
	}, {} as Record<string, Criterios[]>);

	
	return (
		<div>
			<div
				ref={fichaRef}
				className="print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact] bg-white"
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
							<select 
								disabled 
								className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#cd0048] appearance-none'
							>
								{bases
									.filter(base => base.nome === userBase)
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
								disabled
								className='w-full bg-[#fcfcfc]/10 border border-secondary-foreground/20 rounded-lg px-3 py-2 text-sm text-[#f8f8f8] placeholder:text-[#f8f8f8]/30 focus:outline-none focus:ring-2 focus:ring-[#cd0048]'
								placeholder="Ex: Dr. Roberto Alves"
								value={userName}
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

				{/* Perguntas */}
				{Object.entries(criteriosPorCategoria).map(
					([categoria, itens]) => {
						const respondidos = itens.filter(item => notas[item.criterio] !== undefined).length;
						return (
							<div key={categoria} className="bg-card border border-[#d2d8de] rounded-xl overflow-hidden ">
								<button 
									disabled 
									className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#e5ecf1]/30 transition-colors text-left bg-white"
								>
									<div className="flex items-center gap-3">
										<div className="w-1.5 h-5 rounded-full bg-[#cd0048]" />
										<h2 className="font-semibold text-[#0e1216] text-sm">{categoria}</h2>
										<span className="text-xs [text-#555f69]">{respondidos} / {itens.length} respondidos</span>
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
														onSelecionarNota={readOnly ? () => {} : selecionarNota}
														obrigatorio={!notas[criterio.criterio]}
														tentouEnviar={tentouEnviar}
														readOnly={readOnly}
													/>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						);
					}
				)}

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-6'>
					<div>
						<label className='text-sm font-semibold text-[#0e1216] mb-2 block'>Observações Gerais</label>
						<textarea
							disabled={readOnly}
							className='w-full border border-[#d2d8de] rounded-lg px-3 py-2 text-sm bg-white resize-none'
							rows={4}
							value={observacoes}
							readOnly={readOnly}
						/>
					</div>

					<div>
						<label className='text-sm font-semibold text-[#0e1216] mb-2 block'>Pontos a Melhorar (Lacunas Identificadas)</label>
						<textarea
							disabled={readOnly}
							className='w-full border border-[#d2d8de] rounded-lg px-3 py-2 text-sm bg-white resize-none'
							rows={4}
							value={pontosMelhorar}
							readOnly={readOnly}
						/>
					</div>

					<div>
						<label className='text-sm font-semibold text-[#0e1216] mb-2 block'>Plano de Ação / PDI Sugerido</label>
						<textarea
							disabled={readOnly}
							className='w-full border border-[#d2d8de] rounded-lg px-3 py-2 text-sm bg-white resize-none'
							rows={4}
							value={planoAcao}
							readOnly={readOnly}
						/>
					</div>
				</div>

				<div className='bg-card border border-border rounded-xl p-5 '>
					<h3 className='text-sm font-semibold text-[#0e1216] mb-4'>Assinaturas e Ciência</h3>
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
						<Assinatura Responsavel="Avaliador" />
						<Assinatura Responsavel="Avaliado / Profissional" />
						<Assinatura Responsavel="Coordenação / Chefia Imediata" />
					</div>
				</div>
				
			</div>

			<div className='flex gap-4'>
				<button
					onClick={imprimirFicha}
					className='mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-500/90 transition-colors print:hidden'
				>
					Imprimir/Baixar Ficha
				</button>
			</div>

			{readOnly && (
				<p className='text-xs [text-#555f69] text-center mt-4 print:hidden'>
					Instrumento baseado em bp-TEAM (validado em português), Habilidades Não Técnicas (NTS), Portaria MS 2.048/2002 e Processo de Enfermagem no SAMU (Pizzolato et al., 2023). Avaliação com foco na melhoria contínua da qualidade assistencial — caráter educativo, não punitivo.
				</p>
			)}
		</div>
	);
}
