CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(255) NOT NULL,
    perfil VARCHAR(100) NOT NULL,
    base VARCHAR(100),
    resultado JSONB NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, funcao, perfil, base)
VALUES
(
    'Davi',
    'admin@admin.com',
    '123456',
    'Medico',
    '🔑 Administrador — Todas as bases',
    'Itaguai'
);
