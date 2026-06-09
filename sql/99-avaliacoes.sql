CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    resultado JSONB NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario
      FOREIGN KEY (usuario_id)
      REFERENCES usuarios(id)
);