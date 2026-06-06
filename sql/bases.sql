CREATE TABLE bases (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(20) NOT NULL
);


INSERT INTO bases (nome, cor) VALUES
('Nova Iguaçu', '#f97316'),
('Duque de Caxias', '#3b82f6'),
('São João de Meriti', '#22c55e'),
('Belford Roxo', '#a855f7'),
('Queimados', '#ef4444'),
('Nilópolis', '#eab308'),
('Mesquita', '#14b8a6'),
('Seropédica', '#6366f1'),
('Japeri', '#ec4899'),
('Paracambi', '#10b981'),
('Magé', '#f43f5e'),
('Itaguaí', '#0ea5e9');