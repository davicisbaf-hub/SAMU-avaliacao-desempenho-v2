CREATE TABLE criterios_avaliacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    tipo_link VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    criterio TEXT NOT NULL,
    peso INTEGER NOT NULL,
    indicador VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO criterios_avaliacao (tipo, tipo_link, categoria, codigo, criterio, indicador, peso) VALUES
(
    'BP-TEAM',
    'Liderança',
    'BT-L1',
    'O líder dirige a equipe com clareza, define papéis e responsabilidades desde o início do atendimento',
    '',
    3
),
(
    'BP-TEAM',
    'Liderança',
    'BT-L2',
    'O líder toma decisões de forma assertiva, sem hesitação excessiva, mesmo sob pressão extrema',
    '',
    3
),
(

    'BP-TEAM',
    'Liderança',
    'BT-L3',
    'O líder adapta o plano de cuidado conforme evolução clínica do paciente e novos achados da cena',
    '',
    2
),(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT1',
    'A equipe utiliza comunicação em loop fechado (call-out + check-back) de forma consistente',
    '',
    3
),
(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT2',
    'Os membros monitoram e apoiam uns aos outros, antecipando necessidades sem solicitação',
    '',
    2
),
(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT3',
    'Todos os membros compartilham o mesmo modelo mental do quadro clínico e plano de ação',
    '',
    2
),(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT1',
    'A avaliação do paciente é sistemática (ABCDE), rápida e sem etapas omitidas',
    '',
    3
),
(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT2',
    'As intervenções são priorizadas corretamente conforme critérios de gravidade e tempo-crítico',
    '',
    3
),
(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT3',
    'Os procedimentos são executados com técnica correta, sem erros ou omissões significativas',
    '',
    3
),(
    'BP-TEAM',
    'Habilidades Não Técnicas (NTS)',
    'BT-NTS1',
    'A equipe demonstra consciência situacional compartilhada: cena, paciente, recursos, tempo',
    '',
    3
),
(
    'BP-TEAM',
    'Habilidades Não Técnicas (NTS)',
    'BT-NTS2',
    'A equipe mantém desempenho técnico adequado mesmo em cenários de alta carga emocional',
    '',
    2
),
('Condutor', 'Técnico-Operacional', 'C-T1',
 'Realiza checklist completo da viatura no início do plantão (combustível, pneus, equipamentos, kit de emergência)',
 'Checklist preenchido',
 3
 ),

('Condutor', 'Técnico-Operacional', 'C-T2',
 'Verifica e registra o estado dos equipamentos médicos (DEA, oxímetro, monitor cardíaco, maca)',
 'Conformidade equipamentos',
 3),

('Condutor', 'Técnico-Operacional', 'C-T3',
 'Mantém a ambulância limpa, organizada e em condições sanitárias adequadas após cada atendimento',
 'Higienização ambulância',
 2),

('Condutor', 'Técnico-Operacional', 'C-T4',
 'Pratica direção defensiva com habilidade, respeitando sinalização e segurança da equipe e paciente no deslocamento de emergência',
 'Direção defensiva',
 3),

('Condutor', 'Técnico-Operacional', 'C-T5',
 'Conhece e utiliza corretamente rotas de acesso, vias alternativas e GPS para otimização do tempo-resposta',
 'Geolocalização / rotas',
 2),

('Condutor', 'Técnico-Operacional', 'C-T6',
 'Auxilia a equipe nos procedimentos de Suporte Básico de Vida (SBV): RCP, imobilização, oxigenoterapia básica',
 'Competência SBV',
 3),

('Condutor', 'Técnico-Operacional', 'C-T7',
 'Manuseia corretamente a maca, cadeira de rodas, prancha longa e colar cervical',
 'Manuseio de equipamentos',
 2),

('Condutor', 'Comportamental', 'C-B1',
 'Integra-se ativamente à equipe, antecipando necessidades, cooperando na cena e comunicando informações relevantes',
 'Trabalho em equipe',
 3),

('Condutor', 'Comportamental', 'C-B2',
 'Comunica-se de forma clara e objetiva com a equipe e com a Central de Regulação (CRUR-BF) durante o atendimento',
 'Comunicação operacional',
 2),

('Condutor', 'Comportamental', 'C-B3',
 'Utiliza corretamente todos os EPIs obrigatórios (luvas, máscara, avental) em todos os atendimentos',
 'Uso de EPIs',
 3),

('Condutor', 'Comportamental', 'C-B4',
 'Avalia a segurança da cena antes de aproximação e comunica riscos à equipe (tráfego, violência, substâncias)',
 'Segurança da cena',
 3),

('Condutor', 'Comportamental', 'C-B5',
 'Mantém controle emocional em cenários de alta tensão, múltiplas vítimas, violência ou óbito',
 'Controle emocional',
 2),

('Condutor', 'Comportamental', 'C-B6',
 'Trata pacientes, familiares e equipe com respeito, sigilo e ética, respeitando a dignidade humana',
 'Ética e humanização',
 2),


('Condutor', 'Processo e Qualidade', 'C-P1',
 'Preenche corretamente o registro de saída e chegada da viatura, tempo de deslocamento e ocorrências relevantes',
 'Completude dos registros',
 2),
('Condutor', 'Processo e Qualidade', 'C-P2',
 'Contribui para o cumprimento do tempo-resposta ≤15 minutos da central ao local (Portaria MS 2.048/2002)',
 'Tempo-resposta ≤15min',
 3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T1',
'Realiza avaliação primária (ABCDE) de forma rápida, sistemática e correta após chegada na cena',
'Avaliação primária ABCDE',
3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T2',
'Identifica e comunica sinais de gravidade imediata ao Enfermeiro/médico com precisão e agilidade',
'Triagem e comunicação',
3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T3',
'Executa corretamente compressões torácicas, ventilação (bolsa-valva-máscara) e desfibrilação com DEA conforme protocolo',
'RCP e DEA',
3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T4',
'Realiza punção venosa periférica, coleta e administra medicamentos conforme prescrição do Enfermeiro/médico',
'Punção venosa / medicação',
3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T5',
'Manuseia corretamente: oxímetro, monitor cardíaco, respirador, glicosímetro e demais equipamentos da USB/USA',
'Manuseio de equipamentos',
2
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T6',
'Realiza imobilização adequada de vítimas de trauma (colar cervical, prancha, talas) conforme protocolo PHTLS',
'Imobilização PHTLS',
3
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T7',
'Executa técnica correta de movimentação e transporte de pacientes críticos sem agravar lesões',
'Técnica de transporte',
2
),
(
'Técnico de Enfermagem',
'Técnico-Clínico',
'TE-T8',
'Conhece e segue os protocolos clínicos do SAMU-192 (sepse, IAM, AVC, trauma, PCR, intoxicação)',
'Adesão a protocolos',
3
),

(
'Técnico de Enfermagem',
'Comportamental',
'TE-B1',
'Participa ativamente do trabalho em equipe, recebe e transmite informações de forma padronizada (SBAR)',
'Comunicação SBAR / trabalho em equipe',
3
),
(
'Técnico de Enfermagem',
'Comportamental',
'TE-B2',
'Mantém consciência situacional: monitora o estado do paciente, equipamentos e ambiente simultaneamente',
'Consciência situacional NTS',
2
),
(
'Técnico de Enfermagem',
'Comportamental',
'TE-B3',
'Usa corretamente todos os EPIs e adota medidas de segurança para si, paciente e equipe em toda cena',
'Segurança / EPIs',
3
),
(
'Técnico de Enfermagem',
'Comportamental',
'TE-B4',
'Mantém foco e equilíbrio emocional em situações de alta pressão (PCR, múltiplas vítimas, violência)',
'Controle emocional',
2
),

(
'Técnico de Enfermagem',
'Processo e Qualidade',
'TE-P1',
'Preenche corretamente a ficha de atendimento pré-hospitalar com completude, clareza e fidelidade aos achados',
'Qualidade do prontuário',
3
),
(
'Técnico de Enfermagem',
'Processo e Qualidade',
'TE-P2',
'Repõe materiais e medicamentos utilizados após cada atendimento, mantendo o estoque da viatura padronizado',
'Reposição de materiais',
2
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T1',
'Realiza avaliação clínica completa (SAMPLA, ABCDE, Glasgow, FAST) e formula diagnósticos de enfermagem precisos',
'Avaliação SAMPLA/ABCDE',
3
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T2',
'Desenvolve e registra o Processo de Enfermagem (PE) conforme CIPE® e protocolos internacionais (PHTLS/ACLS)',
'Processo de Enfermagem / CIPE®',
3
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T3',
'Executa com precisão procedimentos de SAV: acesso venoso difícil, intubação orotraqueal, RCP avançada, desfibrilação',
'Procedimentos SAV',
3
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T4',
'Administra medicamentos de urgência com segurança, verificando via, dose, concentração e registro',
'Administração de medicamentos',
3
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T5',
'Toma decisões clínicas rápidas e assertivas em cenários de IAM, AVC, trauma grave, sepse e PCR',
'Decisão clínica em urgências',
3
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T6',
'Reconhece limitações e aciona o médico regulador/intervencionista nos momentos adequados',
'Escalada de cuidados',
2
),
(
'Enfermeiro',
'Técnico-Clínico',
'EN-T7',
'Supervisiona o técnico de enfermagem e o condutor, orientando procedimentos e prevenindo erros',
'Supervisão técnica da equipe',
3
),

(
'Enfermeiro',
'Liderança',
'EN-L1',
'Exerce liderança na USB/USA: dirige a equipe com clareza, distribui tarefas e coordena o atendimento',
'Liderança (bp-TEAM: domínio Liderança)',
3
),
(
'Enfermeiro',
'Liderança',
'EN-L2',
'Usa comunicação em loop fechado (call-out, check-back) para garantir compreensão das ordens na cena',
'Comunicação em loop (NTS)',
3
),
(
'Enfermeiro',
'Liderança',
'EN-L3',
'Organiza as tarefas sequencialmente, priorizando intervenções conforme gravidade e tempo-crítico',
'Gerenciamento de tarefas (bp-TEAM)',
3
),
(
'Enfermeiro',
'Liderança',
'EN-L4',
'Mantém e compartilha a consciência situacional com toda a equipe (briefing / atualização contínua)',
'Consciência situacional coletiva',
2
),

(
'Enfermeiro',
'Comportamental',
'EN-B1',
'Lidera pelo exemplo no uso de EPIs e na aplicação de precauções de segurança em toda a cena',
'Segurança do paciente e equipe',
3
),

(
'Enfermeiro',
'Processo e Qualidade',
'EN-P1',
'Registra o Processo de Enfermagem no SAMU de forma completa, legível e juridicamente válida',
'Completude do Registro PE/SAMU (IVC ≥0,80)',
3
),
(
'Enfermeiro',
'Processo e Qualidade',
'EN-P2',
'Contribui para metas operacionais: tempo-resposta ≤15min, tempo de cena ≤20min, ROSC em PCR',
'KPIs operacionais',
2
),
(
'Médico',
'Técnico-Clínico',
'MD-T1',
'Realiza avaliação clínica completa e rápida, formulando diagnóstico sindromático correto no pré-hospitalar',
'Diagnóstico pré-hospitalar',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T2',
'Executa procedimentos de SAV com excelência: IOT difícil, acesso intraósseo, drenagem, cardioversão',
'Procedimentos SAV avançados',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T3',
'Aplica protocolo de IAM (ACLS): ECG, trombolítico, ativação hemodinâmica. Tempo porta-balão: cumpre ≤90min',
'IAM / Tempo porta-balão ≤90min',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T4',
'Aplica protocolo de AVC (FAST/NIHSS), ativação da linha de cuidado cerebrovascular conforme POP',
'AVC / Protocolo cerebrovascular',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T5',
'Conduz a PCR conforme ACLS: algoritmo, ritmo, medicação, tempo de RCP, ROSC — taxa de retorno adequada',
'PCR / ROSC (taxa retorno circulação)',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T6',
'Comunica-se eficientemente com o médico regulador da CRUR-BF: informações precisas, decisão conjunta, tempo de regulação',
'Qualidade da telemedicina / regulação',
3
),
(
'Médico',
'Técnico-Clínico',
'MD-T7',
'Prescreve, verifica e supervisa a administração de medicamentos de urgência com segurança e precisão',
'Farmacologia de urgência',
3
),

(
'Médico',
'Liderança',
'MD-L1',
'Lidera a equipe USA com autoridade, clareza e empatia: define papéis, distribui tarefas, mantém hierarquia e segurança',
'Liderança bp-TEAM (domínio: Liderança)',
3
),
(
'Médico',
'Liderança',
'MD-L2',
'Gerencia simultaneamente múltiplas tarefas críticas: paciente, equipe, comunicação com regulação e documentação',
'Gerenciamento de tarefas bp-TEAM',
3
),
(
'Médico',
'Liderança',
'MD-L3',
'Toma decisões rápidas e assertivas sob pressão extrema, com base em evidências e priorização correta',
'Tomada de decisão NTS',
3
),
(
'Médico',
'Liderança',
'MD-L4',
'Mantém consciência situacional ampla (cena, paciente, equipe, recursos, tempo) e adapta o plano de cuidado',
'Consciência situacional NTS',
2
),

(
'Médico',
'Comportamental',
'MD-B1',
'Comunica decisões de forma clara, utiliza comunicação em loop com a equipe e mantém registro verbal de ordens',
'Comunicação efetiva em loop',
2
),
(
'Médico',
'Comportamental',
'MD-B2',
'Aborda paciente e família com empatia, respeito, escuta ativa e informação adequada mesmo em cenários críticos',
'Humanização do cuidado',
2
),

(
'Médico',
'Processo e Qualidade',
'MD-P1',
'Documenta o atendimento médico de forma completa, com hipótese diagnóstica, condutas, medicamentos e encaminhamento',
'Completude do prontuário médico',
3
);