import type { Request, Response } from "express";
import pool from "../pool";

export async function listar(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM usuarios
      WHERE ativo = true
      ORDER BY nome
    `);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function listarPorBase(req: Request, res: Response) {
  const { base } = req.params;
  const { rows } = await pool.query(
    `
    SELECT id, nome, email, funcao, perfil
    FROM usuarios
    WHERE base = $1
    ORDER BY nome
    `,
    [base]
  );
  res.json(rows);
}

export async function cadastrar(req: Request, res: Response) {
  try {
    const { nome, email, senha, funcao, perfil, base, par } = req.body;

    const parValue = Array.isArray(par) && par.length > 0 ? par : null;

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, funcao, perfil, base, par)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nome, email, senha, funcao, perfil, base, JSON.stringify(parValue)]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function atualizar(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, email, senha, funcao, perfil, base, par } = req.body;

  const parValue = Array.isArray(par) && par.length > 0 ? par : null;

  await pool.query(
    `UPDATE usuarios SET nome=$1, email=$2, senha=$3, funcao=$4, perfil=$5, base=$6, par=$7
     WHERE id=$8`,
    [nome, email, senha, funcao, perfil, base, JSON.stringify(parValue), id]
  );

  res.json({ ok: true });
}

export async function inativar(req: Request, res: Response) {
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
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}