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
        a.modalidade,
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
      modalidade,
      tipoAvaliacao,
      resultado,
      observacoesGerais,
      pontosMelhorar,
      planoAcao,
    } = req.body;

    if (!modalidade) {
      return res.status(400).json({ erro: "Campo 'modalidade' é obrigatório para verificar a frequência da avaliação." });
    }

    // 1) Busca a frequência configurada usando MODALIDADE (não tipoAvaliacao)
    const freqResult = await pool.query(
      `
      SELECT dia, semana, mes, ano
      FROM frequencia_avaliacao
      WHERE tipo_avaliacao = $1 AND ativo = TRUE
      LIMIT 1
      `,
      [modalidade]
    );

    const freq = freqResult.rows[0] ?? { dia: 0, semana: 0, mes: 0, ano: 0 };
    const semRestricao = freq.dia === 0 && freq.semana === 0 && freq.mes === 0 && freq.ano === 0;

    // 2) Só checa bloqueio se houver alguma frequência configurada
    if (!semRestricao) {
      const bloqueio = await pool.query(
        `
        SELECT id, criado_em,
          (criado_em + make_interval(years => $4, months => $5, weeks => $6, days => $7)) AS libera_em
          FROM avaliacoes
          WHERE avaliado_id = $1
          AND modalidade = $2
          AND avaliador_id = $3
          AND (criado_em + make_interval(years => $4, months => $5, weeks => $6, days => $7)) > NOW()
          ORDER BY criado_em DESC
          LIMIT 1
        `,
        [avaliadoId, modalidade, avaliadorId, freq.ano, freq.mes, freq.semana, freq.dia]
      );

      if (bloqueio.rows.length > 0) {
        const liberaEm = new Date(bloqueio.rows[0].libera_em);
        return res.status(409).json({
          erro: `Você já avaliou esta ficha recentemente. Próxima avaliação liberada em ${liberaEm.toLocaleDateString("pt-BR")} às ${liberaEm.toLocaleTimeString("pt-BR")}.`,
          liberaEm,
        });
      }
    }

    // 3) Cria a avaliação normalmente
    const { rows } = await pool.query(
      `
      INSERT INTO avaliacoes
        (avaliador_id, avaliado_id, modalidade, tipo_avaliacao, resultado, observacoes_gerais, pontos_melhorar, plano_acao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [avaliadorId, avaliadoId, modalidade, tipoAvaliacao, resultado, observacoesGerais, pontosMelhorar, planoAcao]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

export async function frequenciaAvaliacoes(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        tipo_avaliacao,
        dia,
        semana,
        mes,
        ano,
        ativo
      FROM frequencia_avaliacao
      ORDER BY tipo_avaliacao;
    `);

    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}
export async function definirFrequencia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { dia, semana, mes, ano, ativo } = req.body;

    const { rows } = await pool.query(
      `
      UPDATE frequencia_avaliacao
      SET
        dia = $1,
        semana = $2,
        mes = $3,
        ano = $4,
        ativo = $5
      WHERE id = $6
      RETURNING *;
      `,
      [dia, semana, mes, ano, ativo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Frequência não encontrada." });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}