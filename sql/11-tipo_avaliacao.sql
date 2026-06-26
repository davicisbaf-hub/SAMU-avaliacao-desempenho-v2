CREATE TABLE tipo_avaliacao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tipo_avaliacao (nome, descricao)
VALUES
('autoavaliacao', 'Autoavaliação'),
('Lider > Liderado', 'Líder > Liderado'),
('Liderado > Lider', 'Liderado > Líder'),
('Par', 'Avaliação por Par');
