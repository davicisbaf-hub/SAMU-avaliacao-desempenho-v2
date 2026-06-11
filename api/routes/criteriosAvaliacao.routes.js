app.get("/api/criterios-avaliacao/:tipo", async (req, res) => {
  try {
    const { tipo } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        id,
        tipo,
        categoria,
        codigo,
        criterio,
        peso,
        indicador
      FROM criterios_avaliacao
      WHERE tipo = $1
      AND ativo = true
      ORDER BY categoria, codigo;
      `,
      [tipo]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/ficha/:tipo", async (req, res) => {
  try {
    const { tipo } = req.params;

    const { rows } = await pool.query(
      `
      SELECT *
      FROM criterios_avaliacao
      ORDER BY categoria, codigo
      `,
      [tipo]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

app.post("/api/criterios-avaliacao", async (req, res) => {
  const {
    tipo,
    categoria,
    codigo,
    criterio,
    peso,
    indicador,
  } = req.body;

  const { rows } = await pool.query(
  `
    INSERT INTO criterios_avaliacao
    (
      tipo,
      categoria,
      codigo,
      criterio,
      peso,
      indicador
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `,
    [
      tipo,
      categoria,
      codigo,
      criterio,
      peso,
      indicador,
    ]
  );

  res.status(201).json(rows[0]);
});

app.put("/api/criterios-avaliacao/:id/inativar", async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      UPDATE criterios_avaliacao
      SET ativo = false
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

app.put("/api/criterios-avaliacao/:id", async (req, res) => {
  const {
    categoria,
    codigo,
    criterio,
    peso,
    indicador,
  } = req.body;

  const { rows } = await pool.query(
    `
    UPDATE criterios_avaliacao
    SET
      categoria = $1,
      codigo = $2,
      criterio = $3,
      peso = $4,
      indicador = $5
    WHERE id = $6
    RETURNING *
    `,
    [
      categoria,
      codigo,
      criterio,
      peso,
      indicador,
      req.params.id,
    ]
  );

  res.json(rows[0]);
});

app.get("/api/tipos-avaliacao", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT tipo
      FROM criterios_avaliacao
      ORDER BY tipo
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});