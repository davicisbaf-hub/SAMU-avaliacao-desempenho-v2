import type { Request, Response } from "express";
import pool from "../pool";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "samu-secret-key";

export async function login(req: Request, res: Response) {
  let { cpf, base } = req.body;

  // Busca todos os usuários com o CPF informado
  const usuarios = await pool.query(
    `SELECT id, nome, email, funcao, perfil, base, ativo, criado_em, par
     FROM usuarios
     WHERE cpf = $1`,
    [cpf]
  );

  if (usuarios.rows.length === 0) {
    return res.status(401).json({
      erro: "Credenciais inválidas",
    });
  }

  // Se houver mais de um usuário e nenhuma base foi escolhida,
  // retorna a lista para o frontend abrir o modal.
  if (usuarios.rows.length > 1 && !base) {
    return res.json({
      escolherBase: true,
      usuarios: usuarios.rows.map((u) => ({
        id: u.id,
        nome: u.nome,
        funcao: u.funcao,
        perfil: u.perfil,
        base: u.base,
      })),
    });
  }

  let usuario;

  if (base) {
    const result = await pool.query(
      `SELECT *
       FROM usuarios
       WHERE cpf = $1
       AND base = $2 AND perfil='🔑 Administrador - Todas as bases'`,
      [cpf, base]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: "Base inválida.",
      });
    }

    usuario = result.rows[0];
  } else {
    usuario = usuarios.rows[0];
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      funcao: usuario.funcao,
      perfil: usuario.perfil,
      base: usuario.base,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return res.json({
    token,
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
}

export async function loginWithEmail(req: Request, res: Response) {
  let { email, base } = req.body;

  if (!email) {
    return res.status(400).json({
      erro: "Email é obrigatório",
    });
  }


  const usuarios = await pool.query(
    `SELECT id, nome, email, funcao, perfil, base, ativo, criado_em, par
     FROM usuarios
     WHERE email = $1`,
    [email]
  );

  if (usuarios.rows.length === 0) {
    return res.status(401).json({
      erro: "Credenciais inválidas",
    });
  }

  // Se houver mais de um usuário e nenhuma base foi escolhida,
  // retorna a lista para o frontend abrir o modal.
  if (usuarios.rows.length > 1 && !base) {
    return res.json({
      escolherBase: true,
      usuarios: usuarios.rows.map((u) => ({
        id: u.id,
        nome: u.nome,
        funcao: u.funcao,
        perfil: u.perfil,
        base: u.base,
      })),
    });
  }

  let usuario;

  if (base) {
    const result = await pool.query(
      `SELECT *
       FROM usuarios
       WHERE email = $1
       AND base = $2 AND perfil!='🔑 Administrador - Todas as bases'`,
      [email, base]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: "Base inválida.",
      });
    }

    usuario = result.rows[0];
  } else {
    usuario = usuarios.rows[0];
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
      perfil: usuario.perfil,
      base: usuario.base,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return res.json({
    token,
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    funcao: usuario.funcao,
    perfil: usuario.perfil,
    base: usuario.base,
    ativo: usuario.ativo,
    criadoEm: usuario.criado_em,
    par: usuario.par ?? [],
  });
}