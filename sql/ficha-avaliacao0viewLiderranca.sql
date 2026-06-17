CREATE OR REPLACE VIEW vw_fichas_lideranca AS
SELECT
    ROW_NUMBER() OVER (ORDER BY m.ordem) AS id,
    m.icon,
    m.nome,

    COUNT(c.id)::TEXT || ' critérios de avaliação' AS descricao,

    COUNT(c.id) AS criterios,

    ARRAY_AGG(DISTINCT c.categoria ORDER BY c.categoria) AS tags,

    m.link,
    m.ordem,
    TRUE AS ativo

FROM (
    VALUES
        ('🚑', 'Condutor', '/avaliacao/condutor-socorrista', 1),
        ('💉', 'Técnico de Enfermagem', '/avaliacao/tecnico-enfermagem', 2),
        ('🩺', 'Enfermeiro', '/avaliacao/enfermeiro', 3),
        ('⚕️', 'Médico', '/avaliacao/medico-intervencionista', 4),
        ('👤', 'Liderança > Liderado', '/avaliacao/lideranca-liderado', 5),
        ('👤', 'Liderado > Liderança', '/avaliacao/liderado-lideranca', 6),
        ('🛡️', 'BP-TEAM', '/avaliacao/bp-team', 7)
) AS m(icon, nome, link, ordem)

LEFT JOIN criterios_avaliacao c
    ON c.tipo = m.nome
   AND c.ativo = TRUE
   AND c.acaliacao = 'Lider > Liderado'

GROUP BY
    m.icon,
    m.nome,
    m.link,
    m.ordem;