import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();

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

app.listen(3001);