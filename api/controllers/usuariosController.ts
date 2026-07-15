import type { Request, Response } from "express";
import pool from "../pool";
import validarCpf from "validar-cpf";


export async function listar(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT id, nome, email, funcao, perfil, base, ativo, criado_em, par
      FROM usuarios
      WHERE ativo = true
      AND perfil != '🔑 Administrador - Todas as bases'
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
    const { nome, email, cpf, funcao, perfil, base, par } = req.body;
  
    
    if (!validarCpf(cpf)) {
      return res.status(400).json({
        erro: "CPF inválido"
      });
    }

    const parValue = Array.isArray(par) && par.length > 0 ? par : null;

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, cpf, funcao, perfil, base, par)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nome, email, cpf, funcao, perfil, base, JSON.stringify(parValue)]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function atualizar(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, email, funcao, perfil, base, par } = req.body;

  const parValue = Array.isArray(par) && par.length > 0 ? par : null;

  await pool.query(
    `UPDATE usuarios SET nome=$1, email=$2, funcao=$3, perfil=$4, base=$5, par=$6
     WHERE id=$7`,
    [nome, email, funcao, perfil, base, JSON.stringify(parValue), id]
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

export async function getMe(req: Request, res: Response) {
  try {
  
    const usuarioId = (req as any).usuario.id;

    const result = await pool.query(
      "SELECT id, nome, email, cpf, funcao, perfil, base, ativo, criado_em, par FROM usuarios WHERE id = $1",
      [usuarioId]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      funcao: usuario.funcao,
      perfil: usuario.perfil,
      base: usuario.base,
      ativo: usuario.ativo,
      criadoEm: usuario.criado_em,
      par: usuario.par ?? [],
    });
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}