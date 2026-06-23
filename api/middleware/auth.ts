import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "samu-secret-key";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}