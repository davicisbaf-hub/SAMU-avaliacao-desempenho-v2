import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/api/frequencias", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      frequencia,
      instrumento_acao,
      responsavel
    FROM frequencia_aplicacao
    WHERE ativo = true
    ORDER BY ordem
  `);

  res.json(rows);
});

router.get("/api/fluxos-avaliacao", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM fluxos_avaliacao
    WHERE ativo = true
    ORDER BY ordem
  `);

  res.json(rows);
});

router.get("/api/escala-likert", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM escala_likert
    ORDER BY nota
  `);

  res.json(rows);
});

router.get("/api/pesos-avaliacao", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      valor,
      descricao,
      cor
    FROM pesos_avaliacao
    ORDER BY valor DESC
  `);

  res.json(rows);
});

export default router;