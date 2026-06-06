CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    resultado JSONB NOT NULL,
    data_avaliacao TIMESTAMP DEFAULT NOW()
);