import { pool } from "../db/pool.js";

export async function listarFichasAvaliacao(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM fichas_avaliacao
      WHERE ativo = true
      ORDER BY ordem
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
