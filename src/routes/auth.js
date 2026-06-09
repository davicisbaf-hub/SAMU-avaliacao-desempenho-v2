import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    const usuario = result.rows[0];

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({
        erro: "Credenciais inválidas",
      });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
      perfil: usuario.perfil,
    });
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
});

export default router;