import { pool } from "../db.js";

export async function listarFluxoAvaliacao(){
    try {
        const { rows } = await pool.query(`
        SELECT *
        FROM fluxos_avaliacao
        WHERE ativo = true
        ORDER BY ordem
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}