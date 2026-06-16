import express from "express";
import pg from "pg";
import cors from "cors";


const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;


app.use(cors({
 origin: [
   "http://localhost:5173",
   "http://127.0.0.1:5173",
   "http://192.168.1.10:5173",
   "http://192.168.1.10:3011",
   "http://192.168.1.10:8026",
   "http://192.168.1.10:8766"
 ]
}));

// app.use(cors());

const pool = new pg.Pool({
  host: process.env.DB_HOST || "db",
  port: 5432,
  user: "samu",
  password: "samu",
  database: "samu"
});

// const pool = new pg.Pool({
//   host: process.env.DB_HOST || "192.168.1.10",
//   port: 5490,
//   user: "samu",
//   password: "samu",
//   database: "samu"
// });

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

app.get("/api/fichas-avaliacao/:tipo", async (req, res) => {
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
      FROM fichas_avaliacao
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
    const {
      avaliadorId,
      avaliadoId,
      tipoAvaliacao,
      resultado,
      observacoesGerais,
      pontosMelhorar,
      planoAcao
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO avaliacoes
      (
        avaliador_id,
        avaliado_id,
        tipo_avaliacao,
        resultado,
        observacoes_gerais,
        pontos_melhorar,
        plano_acao
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        avaliadorId,
        avaliadoId,
        tipoAvaliacao,
        resultado,
        observacoesGerais,
        pontosMelhorar,
        planoAcao
      ]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: error.message
    });
  }
});

app.get("/api/avaliacoes", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.id,

        avaliador.nome AS avaliador_nome,
        avaliador.funcao AS avaliador_funcao,
        
        avaliado.nome AS avaliado_nome,
        avaliado.funcao AS avaliado_funcao,

        avaliado.funcao,

        a.tipo_avaliacao,
        a.resultado,
        a.criado_em

      FROM avaliacoes a

      JOIN usuarios avaliador
          ON avaliador.id = a.avaliador_id

      JOIN usuarios avaliado
          ON avaliado.id = a.avaliado_id

      ORDER BY a.criado_em DESC;
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: error.message,
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
    funcao: usuario.funcao,
    perfil: usuario.perfil,
    base: usuario.base,
    ativo: usuario.ativo,
    criadoEm: usuario.criado_em,
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

app.get("/api/bases", async (req, res) => {
  const bases = await pool.query("SELECT * FROM bases ORDER BY nome");
  res.json(bases.rows);
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

app.get("/api/usuarios", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM usuarios
      WHERE ativo = true
      ORDER BY nome
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

// Cadastrar usuário
app.post("/api/usuarios", async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      funcao,
      perfil,
      base,
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO usuarios
      (
        nome,
        email,
        senha,
        funcao,
        perfil,
        base
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        nome,
        email,
        senha,
        funcao,
        perfil,
        base,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      email,
      senha,
      funcao,
      perfil,
      base,
    } = req.body;

    const { rows } = await pool.query(
      `
      UPDATE usuarios
      SET
        nome = $1,
        email = $2,
        senha = $3,
        funcao = $4,
        perfil = $5,
        base = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        nome,
        email,
        senha,
        funcao,
        perfil,
        base,
        id,
      ]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

app.put("/api/usuarios/:id/inativar", async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      UPDATE usuarios
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

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});