import { pool } from "../db.js";

export async function listarFrequencias(req, res) {
    try {
        const { rows } = await pool.query(`
            SELECT frequencia, instrumento_acao, responsavel
            FROM frequencia_aplicacao
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