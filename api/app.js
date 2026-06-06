import express from "express";
import pg from "pg";
import cors from "cors";


const app = express();
app.use(express.json());
const port = 3001

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);



const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  user: "samu",
  password: "samu",
  database: "samu"
});

app.get("/api/fichas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM fichas_avaliacao
      WHERE ativo = true
      ORDER BY ordem
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/frequencias", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT frequencia, instrumento_acao, responsavel
      FROM frequencia_aplicacao
      WHERE ativo = true
      ORDER BY ordem
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/fluxos-avaliacao", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM fluxos_avaliacao
      WHERE ativo = true
      ORDER BY ordem
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

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


app.post("/api/avaliacoes", async (req, res) => {
  try {
    const notas = req.body;

    await pool.query(
      `
      INSERT INTO avaliacoes(resultado)
      VALUES($1)
      `,
      [JSON.stringify(notas)]
    );

    res.json({
      sucesso: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao salvar",
    });
  }
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
