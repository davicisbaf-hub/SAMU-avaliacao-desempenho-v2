CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(255) NOT NULL,
    base VARCHAR(255) NOT NULL,
    perfil VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, funcao, base, perfil)
VALUES
(
    'Davi',
    'admin@admin.com',
    '123456',
    'Medico',
    'Nova Iguaçu',
    'Administrador'
    
),
(
    'João Silva',
    'joao@samu192.com',
    '123456',
    'enfermeiro',
    'Nova Iguaçu',
    'Usuario'
    
);