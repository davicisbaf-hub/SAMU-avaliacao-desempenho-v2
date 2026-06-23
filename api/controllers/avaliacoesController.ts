import type { Request, Response } from "express";
import pool from "../pool";

export async function listar(req: Request, res: Response) {
  try {
    const { base } = req.query as { base?: string };
    const params: string[] = [];
    const whereClause = base ? `WHERE avaliado.base = $1` : "";
    if (base) params.push(base);

    const { rows } = await pool.query(`
      SELECT
        a.id,
        avaliador.nome AS avaliador_nome,
        avaliador.funcao AS avaliador_funcao,
        avaliado.nome AS avaliado_nome,
        avaliado.funcao AS avaliado_funcao,
        avaliado.funcao,
        a.tipo_avaliacao,
        a.resultado,
        a.observacoes_gerais,
        a.pontos_melhorar,
        a.plano_acao,
        a.criado_em
      FROM avaliacoes a
      JOIN usuarios avaliador ON avaliador.id = a.avaliador_id
      JOIN usuarios avaliado ON avaliado.id = a.avaliado_id
      ${whereClause}
      ORDER BY a.criado_em DESC
    `, params);

    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

export async function criar(req: Request, res: Response) {
  try {
    const {
      avaliadorId,
      avaliadoId,
      tipoAvaliacao,
      resultado,
      observacoesGerais,
      pontosMelhorar,
      planoAcao,
    } = req.body;

    const avaliacaoHoje = await pool.query(
      `
      SELECT id FROM avaliacoes 
      WHERE avaliado_id = $1 
      AND tipo_avaliacao = $2 
      AND avaliador_id = $3
      AND DATE(criado_em AT TIME ZONE 'America/Sao_Paulo') = DATE(NOW() AT TIME ZONE 'America/Sao_Paulo')
      LIMIT 1
      `,
      [avaliadoId, tipoAvaliacao, avaliadorId]
    );

    if (avaliacaoHoje.rows.length > 0) {
      return res.status(409).json({
        erro: "Você já preencheu esta ficha hoje. Tente novamente amanhã.",
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO avaliacoes
        (avaliador_id, avaliado_id, tipo_avaliacao, resultado, observacoes_gerais, pontos_melhorar, plano_acao)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [avaliadorId, avaliadoId, tipoAvaliacao, resultado, observacoesGerais, pontosMelhorar, planoAcao]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}