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

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  const usuario = result.rows[0];

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({
      erro: "Credenciais inválidas",
    });
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  });
});

app.get("/api/escala-likert", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM escala_likert
    ORDER BY nota
  `);

  res.json(rows);
});

app.get("/api/pesos-avaliacao", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM pesos_avaliacao
    ORDER BY valor DESC
  `);

  res.json(rows);
});

app.get("/api/pesos-avaliacao", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT valor, descricao, cor
      FROM pesos_avaliacao
      ORDER BY valor DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/fichas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT nome
      FROM fichas_avaliacao
      WHERE ativo = true
      AND nome NOT ILIKE '%bp-team%';
    `);

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
      WHERE tipo_link = $1
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

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
