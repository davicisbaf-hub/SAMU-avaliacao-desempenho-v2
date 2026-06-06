CREATE TABLE escala_likert (
    nota INTEGER PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    cor VARCHAR(20) NOT NULL
);

CREATE TABLE pesos_avaliacao (
    valor INTEGER PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL
);

INSERT INTO escala_likert
(nota, titulo, descricao, cor)
VALUES
(
    1,
    'Insatisfatório',
    'Não atende; requer intervenção imediata',
    '#dc2626'
),
(
    2,
    'Abaixo do esperado',
    'Atende parcialmente; necessita melhoria significativa',
    '#ea580c'
),
(
    3,
    'Regular',
    'Atende minimamente; há espaço para desenvolvimento',
    '#ca8a04'
),
(
    4,
    'Bom',
    'Atende plenamente os requisitos esperados',
    '#16a34a'
),
(
    5,
    'Excelente',
    'Supera as expectativas; referência para a equipe',
    '#2563eb'
);

INSERT INTO pesos_avaliacao
(valor, descricao)
VALUES
(3, 'Peso Alto (itens críticos)'),
(2, 'Peso Médio'),
(1, 'Peso Baixo');