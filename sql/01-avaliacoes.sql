CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,

    avaliador_id INTEGER NOT NULL,
    avaliado_id INTEGER NOT NULL,
    modalidade TEXT,

    tipo_avaliacao VARCHAR(100) NOT NULL,
    resultado JSONB NOT NULL,

    observacoes_gerais TEXT,
    pontos_melhorar TEXT,
    plano_acao TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_avaliador
        FOREIGN KEY (avaliador_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_avaliado
        FOREIGN KEY (avaliado_id)
        REFERENCES usuarios(id)
);