CREATE TABLE fluxos_avaliacao (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO fluxos_avaliacao (
    titulo,
    descricao,
    ordem
)
VALUES
(
    'Chefia → Equipe',
    'Avaliação da chefia/liderança para o profissional',
    1
),
(
    'Autoavaliação',
    'O profissional avalia a si mesmo',
    2
),
(
    'Equipe → Liderança',
    'A equipe avalia a liderança/coordenação',
    3
),
(
    'Simulação / bp-TEAM',
    'Avaliação em cenário simulado (bp-TEAM/NTS)',
    4
);