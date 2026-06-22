import type { Request, Response } from "express";
import pool from "../pool";

export async function listarFichas(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM fichas_avaliacao
      WHERE ativo = true
      ORDER BY ordem
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarFichasVw(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM vw_fichas_avaliacao
      ORDER BY ordem
    `);
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar fichas" });
  }
}

export async function listarFrequencias(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM frequencia_aplicacao
      WHERE ativo = true
      ORDER BY ordem
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarFluxos(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM fluxos_avaliacao
      WHERE ativo = true
      ORDER BY ordem
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarBases(req: Request, res: Response) {
  const bases = await pool.query("SELECT * FROM bases ORDER BY nome");
  res.json(bases.rows);
}

export async function listarEscalaLikert(req: Request, res: Response) {
  const { rows } = await pool.query(`
    SELECT * FROM escala_likert ORDER BY nota
  `);
  res.json(rows);
}

export async function listarPesosAvaliacao(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT valor, descricao, cor
      FROM pesos_avaliacao
      ORDER BY valor DESC
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}