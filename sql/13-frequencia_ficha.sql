-- Tabela para parametrizar frequências por nível de experiência
CREATE TABLE IF NOT EXISTS frequencia_por_nivel (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(50) NOT NULL UNIQUE, -- 'novato', 'intermediario', 'veterano'
    
    -- Dias desde a criação do usuário para ser considerado neste nível
    dias_minimos INTEGER NOT NULL DEFAULT 0,
    dias_maximos INTEGER,
    
    -- Frequência de avaliação (em dias, semanas, meses, anos)
    dias INTEGER NOT NULL DEFAULT 0,
    semanas INTEGER NOT NULL DEFAULT 0,
    meses INTEGER NOT NULL DEFAULT 0,
    anos INTEGER NOT NULL DEFAULT 0,
    
    ativo BOOLEAN DEFAULT TRUE,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (dias_minimos >= 0 AND (dias_maximos IS NULL OR dias_maximos > dias_minimos))
);

-- Dados iniciais: 
-- Novato: 0 a 90 dias - avaliação a cada 7 dias
INSERT INTO frequencia_por_nivel (nivel, dias_minimos, dias_maximos, dias)
VALUES ('novato', 0, 90, 7)
ON CONFLICT (nivel) DO UPDATE SET
    dias_minimos = 0,
    dias_maximos = 90,
    dias = 7;

-- Intermediário: 91 a 365 dias - avaliação a cada 30 dias
INSERT INTO frequencia_por_nivel (nivel, dias_minimos, dias_maximos, meses)
VALUES ('intermediario', 91, 365, 1)
ON CONFLICT (nivel) DO UPDATE SET
    dias_minimos = 91,
    dias_maximos = 365,
    dias = 0,
    meses = 1;

-- Veterano: 365+ dias - avaliação a cada ano
INSERT INTO frequencia_por_nivel (nivel, dias_minimos, dias_maximos, anos)
VALUES ('veterano', 366, NULL, 1)
ON CONFLICT (nivel) DO UPDATE SET
    dias_minimos = 366,
    dias_maximos = NULL,
    dias = 0,
    meses = 0,
    anos = 1;