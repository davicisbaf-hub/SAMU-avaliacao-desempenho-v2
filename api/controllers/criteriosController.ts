import type { Request, Response } from "express";
import pool from "../pool";

export async function listarPorTipoEAvaliacao(req: Request, res: Response) {
  const { tipo, avaliacao } = req.params;
  const { rows } = await pool.query(
    `
    SELECT *
    FROM criterios_avaliacao
    WHERE tipo = $1 AND avaliacao = $2 AND ativo = true
    ORDER BY categoria, codigo
    `,
    [tipo, avaliacao]
  );
  res.json(rows);
}

export async function listarLider(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const { rows } = await pool.query(
      `
      SELECT id, tipo, categoria, codigo, criterio, peso, indicador, avaliacao
      FROM criterios_avaliacao
      WHERE avaliacao = 'Lider > Liderado' AND tipo = $1 AND ativo = true
      ORDER BY categoria, codigo
      `,
      [tipo]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarLiderado(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const { rows } = await pool.query(
      `
      SELECT id, tipo, categoria, codigo, criterio, peso, indicador, avaliacao
      FROM criterios_avaliacao
      WHERE avaliacao = 'Liderado > Lider' AND tipo = $1 AND ativo = true
      ORDER BY categoria, codigo
      `,
      [tipo]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarPar(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const { rows } = await pool.query(
      `
      SELECT id, tipo, categoria, codigo, criterio, peso, indicador, avaliacao
      FROM criterios_avaliacao
      WHERE avaliacao = 'Par' AND tipo = $1 AND ativo = true
      ORDER BY categoria, codigo
      `,
      [tipo]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarAutoavaliacao(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const { rows } = await pool.query(
      `
      SELECT id, tipo, categoria, codigo, criterio, peso, indicador, avaliacao
      FROM criterios_avaliacao
      WHERE avaliacao = 'autoavaliacao' AND tipo = $1 AND ativo = true
      ORDER BY categoria, codigo
      `,
      [tipo]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarTipos(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT tipo
      FROM criterios_avaliacao
      ORDER BY tipo
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function cadastrar(req: Request, res: Response) {
  const { tipo, categoria, codigo, criterio, peso, indicador } = req.body;
  const { rows } = await pool.query(
    `
    INSERT INTO criterios_avaliacao (tipo, categoria, codigo, criterio, peso, indicador)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [tipo, categoria, codigo, criterio, peso, indicador]
  );
  res.status(201).json(rows[0]);
}

export async function atualizar(req: Request, res: Response) {
  const { categoria, codigo, criterio, peso, indicador } = req.body;
  const { rows } = await pool.query(
    `
    UPDATE criterios_avaliacao
    SET categoria = $1, codigo = $2, criterio = $3, peso = $4, indicador = $5
    WHERE id = $6
    RETURNING *
    `,
    [categoria, codigo, criterio, peso, indicador, req.params.id]
  );
  res.json(rows[0]);
}

export async function inativar(req: Request, res: Response) {
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
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}