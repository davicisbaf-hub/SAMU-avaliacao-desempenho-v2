import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/api/fichas", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM fichas_avaliacao
    WHERE ativo = true
    ORDER BY ordem
  `);

  res.json(rows);
});

router.get("/api/fichas-avaliacao/:tipo", async (req, res) => {
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
    ORDER BY categoria, codigo
    `,
    [req.params.tipo]
  );

  res.json(rows);
});

router.get("/api/ficha/:tipo", async (req, res) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM criterios_avaliacao
    WHERE tipo = $1
    ORDER BY categoria, codigo
    `,
    [req.params.tipo]
  );

  res.json(rows);
});

router.get("/api/funcoes", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      id,
      nome,
      icon
    FROM fichas_avaliacao
    WHERE ativo = true
    ORDER BY ordem
  `);

  res.json(rows);
});

export default router;