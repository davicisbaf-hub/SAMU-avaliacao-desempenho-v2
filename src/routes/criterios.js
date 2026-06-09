import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/api/tipos-avaliacao", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT DISTINCT tipo
    FROM criterios_avaliacao
    ORDER BY tipo
  `);

  res.json(rows);
});

router.get("/api/criterios-avaliacao/:tipo", async (req, res) => {
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
    ORDER BY id
    `,
    [req.params.tipo]
  );

  res.json(rows);
});

router.post("/api/criterios-avaliacao", async (req, res) => {
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

router.put("/api/criterios-avaliacao/:id", async (req, res) => {
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

router.put("/api/criterios-avaliacao/:id/inativar", async (req, res) => {
  const { rows } = await pool.query(
    `
    UPDATE criterios_avaliacao
    SET ativo = false
    WHERE id = $1
    RETURNING *
    `,
    [req.params.id]
  );

  res.json(rows[0]);
});

export default router;