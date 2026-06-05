CREATE TABLE criterios_avaliacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    criterio TEXT NOT NULL,
    peso INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO criterios_avaliacao
(tipo, categoria, codigo, criterio, peso)
VALUES
(
    'BP-TEAM',
    'Liderança',
    'BT-L1',
    'O líder dirige a equipe com clareza, define papéis e responsabilidades desde o início do atendimento',
    3
),
(
    'BP-TEAM',
    'Liderança',
    'BT-L2',
    'O líder toma decisões de forma assertiva, sem hesitação excessiva, mesmo sob pressão extrema',
    3
),
(
    'BP-TEAM',
    'Liderança',
    'BT-L3',
    'O líder adapta o plano de cuidado conforme evolução clínica do paciente e novos achados da cena',
    2
),(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT1',
    'A equipe utiliza comunicação em loop fechado (call-out + check-back) de forma consistente',
    3
),
(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT2',
    'Os membros monitoram e apoiam uns aos outros, antecipando necessidades sem solicitação',
    2
),
(
    'BP-TEAM',
    'Trabalho em Equipe',
    'BT-TT3',
    'Todos os membros compartilham o mesmo modelo mental do quadro clínico e plano de ação',
    2
),(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT1',
    'A avaliação do paciente é sistemática (ABCDE), rápida e sem etapas omitidas',
    3
),
(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT2',
    'As intervenções são priorizadas corretamente conforme critérios de gravidade e tempo-crítico',
    3
),
(
    'BP-TEAM',
    'Gerenciamento de Tarefas',
    'BT-GT3',
    'Os procedimentos são executados com técnica correta, sem erros ou omissões significativas',
    3
),(
    'BP-TEAM',
    'Habilidades Não Técnicas (NTS)',
    'BT-NTS1',
    'A equipe demonstra consciência situacional compartilhada: cena, paciente, recursos, tempo',
    3
),
(
    'BP-TEAM',
    'Habilidades Não Técnicas (NTS)',
    'BT-NTS2',
    'A equipe mantém desempenho técnico adequado mesmo em cenários de alta carga emocional',
    2
);