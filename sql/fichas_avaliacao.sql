CREATE TABLE fichas_avaliacao (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    criterios INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
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
    ordem
)
VALUES
(
    '🚑',
    'Condutor Socorrista',
    '15 critérios de avaliação',
    15,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    1
),
(
    '💉',
    'Técnico de Enfermagem',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    2
),
(
    '🩺',
    'Enfermeiro',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    3
),
(
    '⚕️',
    'Médico Intervencionista',
    '14 critérios de avaliação',
    14,
    ARRAY['Técnico', 'Comportamental', 'Processo', 'bp-TEAM'],
    4
),
(
    '👤',
    'Liderança / Coordenação',
    '12 critérios de avaliação',
    12,
    ARRAY['Técnico', 'Comportamental', 'Processo'],
    5
),
(
    '🛡️',
    'Autoavaliação / Simulação bp-TEAM',
    '11 critérios — 3 domínios + NTS',
    11,
    ARRAY['bp-TEAM', 'NTS'],
    6
);