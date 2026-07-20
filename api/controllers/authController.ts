import type { Request, Response } from "express";
import pool from "../pool";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "samu-secret-key";

export async function login(req: Request, res: Response) {
  let { cpf, base } = req.body;

  // Busca todos os usuários com o CPF informado
  const usuarios = await pool.query(
    `SELECT *
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

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  });

  return res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    senha_master: usuario.senha_master,
    funcao: usuario.funcao,
    perfil: usuario.perfil,
    base: usuario.base,
    ativo: usuario.ativo,
    criadoEm: usuario.criado_em,
    par: usuario.par ?? [],
  });
}

export async function logout(req: Request,  res: Response) {
  res.clearCookie('token');
  return res.json({ ok: true });
}

export async function loginWithEmail(req: Request, res: Response) {
  let { email, cpf, base } = req.body;

  if (!email) {
    return res.status(400).json({
      erro: "Email é obrigatório",
    });
  }


  const usuarios = await pool.query(
    `SELECT *
     FROM usuarios
     WHERE email = $1
     AND cpf = $2
     `,
    [email, cpf]
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
       AND cpf = $2
       AND base = $3`,
      [email, cpf, base]
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
      cpf: usuario.cpf,
      funcao: usuario.funcao,
      perfil: usuario.perfil,
      base: usuario.base,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  // Set token as HttpOnly cookie instead of returning it in the response body
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });

  return res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    senha_master: usuario.senha_master,
    funcao: usuario.funcao,
    perfil: usuario.perfil,
    base: usuario.base,
    ativo: usuario.ativo,
    criadoEm: usuario.criado_em,
    par: usuario.par ?? [],
  });
}