CREATE TABLE fichas_avaliacao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    criterios INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO fichas_avaliacao (
    nome,
    descricao,
    criterios,
    tags,
    ordem
)
VALUES
(
    'Condutor Socorrista',
    '15 critérios de avaliação',
    15,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    1
),
(
    'Técnico de Enfermagem',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    2
),
(
    'Enfermeiro',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    3
),
(
    'Médico Intervencionista',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    4
),
(
    'Liderança / Coordenação',
    '12 critérios de avaliação',
    12,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    5
),
(
    'Autoavaliação / Simulação bp-TEAM',
    '11 critérios — 3 domínios + NTS',
    11,
    ARRAY['bp-TEAM', 'NTS'],
    6
);


CREATE TABLE frequencia_aplicacao (
    id SERIAL PRIMARY KEY,
    frequencia VARCHAR(50) NOT NULL,
    instrumento_acao TEXT NOT NULL,
    responsavel VARCHAR(255) NOT NULL,
    ordem INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
)
    
    
INSERT INTO frequencia_aplicacao (
    frequencia,
    instrumento_acao,
    responsavel,
    ordem
)
VALUES
(
    'Diária',
    'Checklist de viatura e EPIs (início do plantão)',
    'Condutor + equipe',
    1
),
(
    'Semanal',
    'Análise de prontuários e KPIs operacionais',
    'Enfermeiro supervisor / coord.',
    2
),
(
    'Mensal',
    'Avaliação 360° por competências + feedback individual',
    'Chefia imediata',
    3
),
(
    'Semestral',
    'Simulação realística bp-TEAM/NTS + debriefing em vídeo',
    'NEP / Coord. médica',
    4
),
(
    'Anual',
    'PDI — revisão de metas e certificações (ACLS/PHTLS/BLS)',
    'Direção Técnica / CISBAF',
    5
);