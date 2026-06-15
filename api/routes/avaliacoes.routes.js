

app.post("/api/avaliacoes", async (req, res) => {
  try {
    const {
      usuarioId,
      tipoAvaliacao,
      resultado,
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO avaliacoes
      (
        usuario_id,
        tipo_avaliacao,
        resultado
      )
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [
        usuarioId,
        tipoAvaliacao,
        JSON.stringify(resultado),
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: error.message,
    });
  }
});



app.get("/api/avaliacoes", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.id,
        a.usuario_id,
        u.nome,
        a.tipo_avaliacao,
        a.resultado,
        a.criado_em
      FROM avaliacoes a
      INNER JOIN usuarios u
        ON u.id = a.usuario_id
      ORDER BY a.criado_em DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: error.message,
    });
  }
});