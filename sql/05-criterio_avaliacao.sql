CREATE TABLE criterios_avaliacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    criterio TEXT NOT NULL,
    peso INTEGER[] NOT NULL DEFAULT ARRAY[1,2,3];
    indicador VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T1','Realiza avaliação primária (ABCDE) de forma rápida, sistemática e correta após chegada na cena',3,'Avaliação primária ABCDE',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T2','Identifica e comunica sinais de gravidade imediata ao Enfermeiro/médico com precisão e agilidade',3,'Triagem e comunicação',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T3','Executa corretamente compressões torácicas, ventilação (bolsa-valva-máscara) e desfibrilação com DEA conforme protocolo',3,'RCP e DEA',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T4','Realiza punção venosa periférica, coleta e administra medicamentos conforme prescrição do Enfermeiro/médico',3,'Punção venosa / medicação',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T5','Manuseia corretamente: oxímetro, monitor cardíaco, respirador, glicosímetro e demais equipamentos da USB/USA',2,'Manuseio de equipamentos',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T6','Realiza imobilização adequada de vítimas de trauma (colar cervical, prancha, talas) conforme protocolo PHTLS',3,'Imobilização PHTLS',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T7','Executa técnica correta de movimentação e transporte de pacientes críticos sem agravar lesões',2,'Técnica de transporte',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','TE-T8','Conhece e segue os protocolos clínicos do SAMU-192 (sepse, IAM, AVC, trauma, PCR, intoxicação)',3,'Adesão a protocolos',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Comportamental','TE-B1','Participa ativamente do trabalho em equipe, recebe e transmite informações de forma padronizada (SBAR)',3,'Comunicação SBAR / trabalho em equipe',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Comportamental','TE-B2','Mantém consciência situacional: monitora o estado do paciente, equipamentos e ambiente simultaneamente',2,'Consciência situacional NTS',true,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Técnico de Enfermagem','Comportamental','TE-B3','Usa corretamente todos os EPIs e adota medidas de segurança para si, paciente e equipe em toda cena',3,'Segurança / EPIs',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Comportamental','TE-B4','Mantém foco e equilíbrio emocional em situações de alta pressão (PCR, múltiplas vítimas, violência)',2,'Controle emocional',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Processo e Qualidade','TE-P1','Preenche corretamente a ficha de atendimento pré-hospitalar com completude, clareza e fidelidade aos achados',3,'Qualidade do prontuário',true,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Habilidades Não Técnicas (NTS)','BT-NTS1','A equipe demonstra consciência situacional compartilhada: cena, paciente, recursos, tempo',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Gerenciamento de Tarefas','BT-GT3','Os procedimentos são executados com técnica correta, sem erros ou omissões significativas',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Trabalho em Equipe','BT-TT1','A equipe utiliza comunicação em loop fechado (call-out + check-back) de forma consistente',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Trabalho em Equipe','BT-TT3','Todos os membros compartilham o mesmo modelo mental do quadro clínico e plano de ação',2,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Liderança','BT-L1','O líder dirige a equipe com clareza, define papéis e responsabilidades desde o início do atendimento',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Liderança','BT-L3','O líder adapta o plano de cuidado conforme evolução clínica do paciente e novos achados da cena',2,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Trabalho em Equipe','BT-TT2','Os membros monitoram e apoiam uns aos outros, antecipando necessidades sem solicitação',2,'',false,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Condutor','Comportamental','C-B2','Comunica-se de forma clara e objetiva com a equipe e com a Central de Regulação (CRUR-BF) durante o atendimento',2,'Comunicação operacional',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T1','Realiza checklist completo da viatura no início do plantão (combustível, pneus, equipamentos, kit de emergência)',3,'Checklist preenchido',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T3','Mantém a ambulância limpa, organizada e em condições sanitárias adequadas após cada atendimento',2,'Higienização ambulância',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T5','Conhece e utiliza corretamente rotas de acesso, vias alternativas e GPS para otimização do tempo-resposta',2,'Geolocalização / rotas',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T6','Auxilia a equipe nos procedimentos de Suporte Básico de Vida (SBV): RCP, imobilização, oxigenoterapia básica',3,'Competência SBV',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T4','Pratica direção defensiva com habilidade, respeitando sinalização e segurança da equipe e paciente no deslocamento de emergência',3,'Direção defensiva',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T7','Manuseia corretamente a maca, cadeira de rodas, prancha longa e colar cervical',2,'Manuseio de equipamentos',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Comportamental','C-B6','Trata pacientes, familiares e equipe com respeito, sigilo e ética, respeitando a dignidade humana',2,'Ética e humanização',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Comportamental','C-B4','Avalia a segurança da cena antes de aproximação e comunica riscos à equipe (tráfego, violência, substâncias)',3,'Segurança da cena',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Comportamental','C-B5','Mantém controle emocional em cenários de alta tensão, múltiplas vítimas, violência ou óbito',2,'Controle emocional',true,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Condutor','Processo e Qualidade','C-P2','Contribui para o cumprimento do tempo-resposta ≤15 minutos da central ao local (Portaria MS 2.048/2002)',3,'Tempo-resposta ≤15min',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Processo e Qualidade','C-P1','Preenche corretamente o registro de saída e chegada da viatura, tempo de deslocamento e ocorrências relevantes',2,'Completude dos registros',true,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Comportamental','C-B3','Utiliza corretamente todos os EPIs obrigatórios (luvas, máscara, avental) em todos os atendimentos',3,'Uso de EPIs',true,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Gerenciamento de Tarefas','BT-GT1','A avaliação do paciente é sistemática (ABCDE), rápida e sem etapas omitidas',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('Condutor','Técnico-Operacional','C-T2','Verifica e registra o estado dos equipamentos médicos (DEA, oxímetro, monitor cardíaco, maca)',3,'Conformidade equipamentos',false,'2026-06-10 10:02:38.389329'),
	 ('Condutor','teste','C-B1','Comunica-se com a equipe, antecipando necessidades, cooperando na cena e comunicando informações relevantes',3,'Trabalho em equipe',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T1','Realiza avaliação clínica completa (SAMPLA, ABCDE, Glasgow, FAST) e formula diagnósticos de enfermagem precisos',3,'Avaliação SAMPLA/ABCDE',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T5','Toma decisões clínicas rápidas e assertivas em cenários de IAM, AVC, trauma grave, sepse e PCR',3,'Decisão clínica em urgências',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T6','Reconhece limitações e aciona o médico regulador/intervencionista nos momentos adequados',2,'Escalada de cuidados',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Liderança','EN-L2','Usa comunicação em loop fechado (call-out, check-back) para garantir compreensão das ordens na cena',3,'Comunicação em loop (NTS)',true,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Técnico de Enfermagem','Liderança','EN-L3','Organiza as tarefas sequencialmente, priorizando intervenções conforme gravidade e tempo-crítico',3,'Gerenciamento de tarefas (bp-TEAM)',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Comportamental','EN-B1','Lidera pelo exemplo no uso de EPIs e na aplicação de precauções de segurança em toda a cena',3,'Segurança do paciente e equipe',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Processo e Qualidade','EN-P1','Registra o Processo de Enfermagem no SAMU de forma completa, legível e juridicamente válida',3,'Completude do Registro PE/SAMU (IVC ≥0,80)',true,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Processo e Qualidade','EN-P2','Contribui para metas operacionais: tempo-resposta ≤15min, tempo de cena ≤20min, ROSC em PCR',2,'KPIs operacionais',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T1','Realiza avaliação clínica completa e rápida, formulando diagnóstico sindromático correto no pré-hospitalar',3,'Diagnóstico pré-hospitalar',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T2','Executa procedimentos de SAV com excelência: IOT difícil, acesso intraósseo, drenagem, cardioversão',3,'Procedimentos SAV avançados',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T5','Conduz a PCR conforme ACLS: algoritmo, ritmo, medicação, tempo de RCP, ROSC — taxa de retorno adequada',3,'PCR / ROSC (taxa retorno circulação)',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T6','Comunica-se eficientemente com o médico regulador da CRUR-BF: informações precisas, decisão conjunta, tempo de regulação',3,'Qualidade da telemedicina / regulação',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Liderança','MD-L1','Lidera a equipe USA com autoridade, clareza e empatia: define papéis, distribui tarefas, mantém hierarquia e segurança',3,'Liderança bp-TEAM (domínio: Liderança)',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Liderança','MD-L4','Mantém consciência situacional ampla (cena, paciente, equipe, recursos, tempo) e adapta o plano de cuidado',2,'Consciência situacional NTS',true,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Médico','Liderança','MD-L3','Toma decisões rápidas e assertivas sob pressão extrema, com base em evidências e priorização correta',3,'Tomada de decisão NTS',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Comportamental','MD-B1','Comunica decisões de forma clara, utiliza comunicação em loop com a equipe e mantém registro verbal de ordens',2,'Comunicação efetiva em loop',true,'2026-06-10 10:02:38.389329'),
	 ('Médico','Comportamental','MD-B2','Aborda paciente e família com empatia, respeito, escuta ativa e informação adequada mesmo em cenários críticos',2,'Humanização do cuidado',true,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Gerenciamento de Tarefas','BT-GT2','As intervenções são priorizadas corretamente conforme critérios de gravidade e tempo-crítico',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Habilidades Não Técnicas (NTS)','BT-NTS2','A equipe mantém desempenho técnico adequado mesmo em cenários de alta carga emocional',2,'',false,'2026-06-10 10:02:38.389329'),
	 ('BP-TEAM','Liderança','BT-L2','O líder toma decisões de forma assertiva, sem hesitação excessiva, mesmo sob pressão extrema',3,'',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Liderança','MD-L2','Gerencia simultaneamente múltiplas tarefas críticas: paciente, equipe, comunicação com regulação e documentação',3,'Gerenciamento de tarefas bp-TEAM',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Liderança','MD-L3','Toma decisões rápidas e assertivas sob pressão extrema, com base em evidências e priorização correta',3,'Tomada de decisão NTS',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Processo e Qualidade','MD-P1','Documenta o atendimento médico de forma completa, com hipótese diagnóstica, condutas, medicamentos e encaminhamento',3,'Completude do prontuário médico',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Liderança','MD-L4','Mantém consciência situacional ampla (cena, paciente, equipe, recursos, tempo) e adapta o plano de cuidado',2,'Consciência situacional NTS',false,'2026-06-10 10:02:38.389329');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Médico','Liderança','MD-L5','Promove o trabalho em equipe, a comunicação efetiva e o ambiente de segurança psicológica para toda a equipe',2,'Clima de equipe / segurança psicológica',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Liderança','EN-L1','Exerce liderança na USB/USA: dirige a equipe com clareza, distribui tarefas e coordena o atendimento',3,'Liderança (bp-TEAM: domínio Liderança)',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Processo e Qualidade','TE-P2','Repõe materiais e medicamentos utilizados após cada atendimento, mantendo o estoque da viatura padronizado',2,'Reposição de materiais',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T2','Desenvolve e registra o Processo de Enfermagem (PE) conforme CIPE® e protocolos internacionais (PHTLS/ACLS)',3,'Processo de Enfermagem / CIPE®',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Liderança','EN-L4','Mantém e compartilha a consciência situacional com toda a equipe (briefing / atualização contínua)',2,'Consciência situacional coletiva',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T7','Supervisiona o técnico de enfermagem e o condutor, orientando procedimentos e prevenindo erros',3,'Supervisão técnica da equipe',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T4','Administra medicamentos de urgência com segurança, verificando via, dose, concentração e registro',3,'Administração de medicamentos',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Técnico-Clínico','EN-T3','Executa com precisão procedimentos de SAV: acesso venoso difícil, intubação orotraqueal, RCP avançada, desfibrilação',3,'Procedimentos SAV',false,'2026-06-10 10:02:38.389329'),
	 ('Técnico de Enfermagem','Gestão e Liderança','01','Comunica orientações, mudanças de protocolo e feedbacks de forma clara, direta e respeitosa.

',4,'',true,'2026-06-11 17:42:26.875394'),
	 ('BP-TEAM','Criterio aqui','Codigo','Pergunta aqui',1,'Indicador',false,'2026-06-10 13:35:37.504952');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Médico','Técnico-Clínico','MD-T7','Prescreve, verifica e supervisa a administração de medicamentos de urgência com segurança e precisão',3,'Farmacologia de urgência',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T4','Aplica protocolo de AVC (FAST/NIHSS), ativação da linha de cuidado cerebrovascular conforme POP',3,'AVC / Protocolo cerebrovascular',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Técnico-Clínico','MD-T3','Aplica protocolo de IAM (ACLS): ECG, trombolítico, ativação hemodinâmica. Tempo porta-balão: cumpre ≤90min',3,'IAM / Tempo porta-balão ≤90min',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Trabalho em Equipe','2','Utilizo comunicação em loop fechado (call-out e check-back) de forma consistente nos atendimentos.',3,'',true,'2026-06-11 17:47:31.017876'),
	 ('Médico','Trabalho em Equipe','3','Sou receptivo(a) a feedbacks construtivos da equipe após uma ocorrência.',3,'',true,'2026-06-11 17:48:02.009131'),
	 ('Médico','Liderança','MD-L2','Gerencia simultaneamente múltiplas tarefas críticas: paciente, equipe, comunicação com regulação e documentação',3,'Gerenciamento de tarefas bp-TEAM',false,'2026-06-10 10:02:38.389329'),
	 ('Médico','Habilidades Não Técnicas','4','
Mantenho a calma e o tom de voz firme para estabilizar a equipe, o paciente e os familiares em momentos de desespero ou conflito.',3,'',true,'2026-06-11 17:49:41.318069'),
	 ('Condutor','Trabalho em Equipe','a1','Sou receptivo(a) a feedbacks construtivos da equipe após uma ocorrência.',3,'',true,'2026-06-11 17:55:34.775804'),
	 ('Condutor','Habilidades Não Técnicas','a2','Realizo a conferência rigorosa da viatura (checklist) no início de cada plantão.',3,'',true,'2026-06-11 17:56:13.906028'),
	 ('Técnico de Enfermagem','Trabalho em Equipe','a3','Sou receptivo(a) a feedbacks construtivos da equipe após uma ocorrência.',3,'',true,'2026-06-11 17:58:51.235499');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Enfermeiro','Técnico-Clínico','TE-T1','Realiza avaliação primária (ABCDE) de forma rápida, sistemática e correta após chegada na cena',3,'Avaliação primária ABCDE',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T3','Executa corretamente compressões torácicas, ventilação (bolsa-valva-máscara) e desfibrilação com DEA conforme protocolo',3,'RCP e DEA',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T6','Realiza imobilização adequada de vítimas de trauma (colar cervical, prancha, talas) conforme protocolo PHTLS',3,'Imobilização PHTLS',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T7','Executa técnica correta de movimentação e transporte de pacientes críticos sem agravar lesões',2,'Técnica de transporte',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Comportamental','TE-B1','Participa ativamente do trabalho em equipe, recebe e transmite informações de forma padronizada (SBAR)',3,'Comunicação SBAR / trabalho em equipe',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Comportamental','TE-B2','Mantém consciência situacional: monitora o estado do paciente, equipamentos e ambiente simultaneamente',2,'Consciência situacional NTS',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Comportamental','TE-B3','Usa corretamente todos os EPIs e adota medidas de segurança para si, paciente e equipe em toda cena',3,'Segurança / EPIs',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Comportamental','TE-B4','Mantém foco e equilíbrio emocional em situações de alta pressão (PCR, múltiplas vítimas, violência)',2,'Controle emocional',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Processo e Qualidade','TE-P1','Preenche corretamente a ficha de atendimento pré-hospitalar com completude, clareza e fidelidade aos achados',3,'Qualidade do prontuário',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Processo e Qualidade','TE-P2','Repõe materiais e medicamentos utilizados após cada atendimento, mantendo o estoque da viatura padronizado',2,'Reposição de materiais',true,'2026-06-11 15:06:08.472675');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Enfermeiro','Técnico-Clínico','EN-T4','Administra medicamentos de urgência com segurança, verificando via, dose, concentração e registro',3,'Administração de medicamentos',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Liderança','EN-L1','Exerce liderança na USB/USA: dirige a equipe com clareza, distribui tarefas e coordena o atendimento',3,'Liderança (bp-TEAM: domínio Liderança)',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Liderança','EN-L2','Usa comunicação em loop fechado (call-out, check-back) para garantir compreensão das ordens na cena',3,'Comunicação em loop (NTS)',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Liderança','EN-L3','Organiza as tarefas sequencialmente, priorizando intervenções conforme gravidade e tempo-crítico',3,'Gerenciamento de tarefas (bp-TEAM)',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','EN-T1','Realiza avaliação clínica completa (SAMPLA, ABCDE, Glasgow, FAST) e formula diagnósticos de enfermagem precisos',3,'Avaliação SAMPLA/ABCDE',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T2','Identifica e comunica sinais de gravidade imediata ao Enfermeiro/médico com precisão e agilidade',3,'Triagem e comunicação',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T4','Realiza punção venosa periférica, coleta e administra medicamentos conforme prescrição do Enfermeiro/médico',3,'Punção venosa / medicação',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T8','Conhece e segue os protocolos clínicos do SAMU-192 (sepse, IAM, AVC, trauma, PCR, intoxicação)',3,'Adesão a protocolos',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','EN-T7','Supervisiona o Enfermeiro e o condutor, orientando procedimentos e prevenindo erros',3,'Supervisão técnica da equipe',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','EN-T2','Desenvolve e registra o Processo de Enfermagem (PE) conforme CIPE® e protocolos internacionais (PHTLS/ACLS)',3,'Processo de Enfermagem / CIPE®',false,'2026-06-11 15:06:08.472675');
INSERT INTO public.criterios_avaliacao (tipo,categoria,codigo,criterio,peso,indicador,ativo,created_at) VALUES
	 ('Enfermeiro','Técnico-Clínico','EN-T6','Reconhece limitações e aciona o médico regulador/intervencionista nos momentos adequados',2,'Escalada de cuidados',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','TE-T5','Manuseia corretamente: oxímetro, monitor cardíaco, respirador, glicosímetro e demais equipamentos da USB/USA',2,'Manuseio de equipamentos',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','EN-T5','Toma decisões clínicas rápidas e assertivas em cenários de IAM, AVC, trauma grave, sepse e PCR',3,'Decisão clínica em urgências',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Processo e Qualidade','EN-P1','Registra o Processo de Enfermagem no SAMU de forma completa, legível e juridicamente válida',3,'Completude do Registro PE/SAMU (IVC ≥0,80)',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Processo e Qualidade','EN-P2','Contribui para metas operacionais: tempo-resposta ≤15min, tempo de cena ≤20min, ROSC em PCR',2,'KPIs operacionais',true,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Técnico-Clínico','EN-T3','Executa com precisão procedimentos de SAV: acesso venoso difícil, intubação orotraqueal, RCP avançada, desfibrilação',3,'Procedimentos SAV',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Processo e Qualidade','MD-P1','Documenta o atendimento médico de forma completa, com hipótese diagnóstica, condutas, medicamentos e encaminhamento',3,'Completude do prontuário médico',false,'2026-06-11 15:04:42.69826'),
	 ('Enfermeiro','Comportamental','EN-B1','Lidera pelo exemplo no uso de EPIs e na aplicação de precauções de segurança em toda a cena',3,'Segurança do paciente e equipe',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Liderança','EN-L4','Mantém e compartilha a consciência situacional com toda a equipe (briefing / atualização contínua)',2,'Consciência situacional coletiva',false,'2026-06-11 15:06:08.472675'),
	 ('Enfermeiro','Trabalho em Equipe','a4','Sou receptivo(a) a feedbacks construtivos da equipe após uma ocorrência.',3,'',true,'2026-06-11 18:10:30.85717');
