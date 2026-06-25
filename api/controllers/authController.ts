import type { Request, Response } from "express";
import pool from "../pool";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "samu-secret-key";

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;

  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  const usuario = result.rows[0];

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
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
    { expiresIn: "8h" }
  );

  res.json({
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