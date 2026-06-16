CREATE TABLE fichas_avaliacao (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    criterios INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    link VARCHAR(100) NOT NULL,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO fichas_avaliacao (
    icon,
    nome,
    descricao,
    criterios,
    tags,
    link,
    ordem
)
VALUES
(
    '🚑',
    'Condutor Socorrista',
    '15 critérios de avaliação',
    15,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    '/avaliacao/condutor-socorrista',
    1
),
(
    '💉',
    'Técnico de Enfermagem',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    '/avaliacao/tecnico-enfermagem',
    2
),
(
    '🩺',
    'Enfermeiro',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    '/avaliacao/enfermeiro',
    3
),
(
    '⚕️',
    'Médico Intervencionista',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    '/avaliacao/medico-intervencionista',
    4
),
(
    '👤',
    'Liderança > Liderado',
    '12 critérios de avaliação',
    12,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    '/avaliacao/lideranca-liderado',
    5
),
(
    '👤',
    'Liderado > Liderança',
    '12 critérios de avaliação',
    12,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    '/avaliacao/liderado-lideranca',
    5
),
(
    '🛡️',
    'Autoavaliação / Simulação bp-TEAM',
    '11 critérios — 3 domínios + NTS',
    11,
    ARRAY['bp-TEAM', 'NTS'],
    '/avaliacao/bp-team',
    6
);