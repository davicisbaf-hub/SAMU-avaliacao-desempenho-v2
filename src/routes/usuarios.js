import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/api/usuarios", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM usuarios
      WHERE ativo = TRUE
      ORDER BY nome
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

router.post("/api/usuarios", async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      funcao,
      base,
      perfil,
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO usuarios
      (
        nome,
        email,
        senha,
        funcao,
        base,
        perfil
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
        base,
        perfil,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

router.put("/api/usuarios/:id", async (req, res) => {
  try {
    const {
      nome,
      email,
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
        funcao = $3,
        perfil = $4,
        base = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        nome,
        email,
        funcao,
        perfil,
        base,
        req.params.id,
      ]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

router.put("/api/usuarios/:id/inativar", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      UPDATE usuarios
      SET ativo = FALSE
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

export default router;