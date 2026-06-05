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