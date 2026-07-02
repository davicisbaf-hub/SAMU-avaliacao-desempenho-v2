CREATE TABLE frequencia_avaliacao (
    id SERIAL PRIMARY KEY,
    tipo_avaliacao VARCHAR(50) NOT NULL UNIQUE,
    dia INTEGER NOT NULL DEFAULT 0,
    semana INTEGER NOT NULL DEFAULT 0,
    mes INTEGER NOT NULL DEFAULT 0,
    ano INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO frequencia_avaliacao (tipo_avaliacao, dia) VALUES ('autoavaliacao', 1);
INSERT INTO frequencia_avaliacao (tipo_avaliacao, dia) VALUES ('Liderado > Lider', 1);
INSERT INTO frequencia_avaliacao (tipo_avaliacao, dia) VALUES ('Lider > Liderado', 1);
INSERT INTO frequencia_avaliacao (tipo_avaliacao, dia) VALUES ('Par', 1);

