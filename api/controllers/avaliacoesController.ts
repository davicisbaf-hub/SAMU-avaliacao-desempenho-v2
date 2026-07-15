import type { Request, Response } from "express";
import pool from "../pool";

/**
 * Determina o nível de experiência do usuário baseado em dias desde criação
 * Busca os níveis da tabela frequencia_por_nivel
 */
async function determinarNivel(criadoEm: Date): Promise<string> {
  const agora = new Date();
  const diasDesdeInicio = Math.floor((agora.getTime() - criadoEm.getTime()) / (1000 * 60 * 60 * 24));

  // Busca todos os níveis ativos ordenados por dias_minimos
  const { rows } = await pool.query(
    `
    SELECT nivel, dias_minimos, dias_maximos
    FROM frequencia_por_nivel
    WHERE ativo = TRUE
    ORDER BY dias_minimos ASC
    `
  );

  if (rows.length === 0) {
    throw new Error("Nenhum nível de frequência configurado.");
  }

  // Encontra o nível que corresponde aos dias do usuário
  for (const nivel of rows) {
    if (diasDesdeInicio >= nivel.dias_minimos && diasDesdeInicio <= nivel.dias_maximos) {
      return nivel.nivel;
    }
  }

  // Se não encontrou nenhum nível, retorna o último (mais experiente)
  return rows[rows.length - 1].nivel;
}

export async function listar(req: Request, res: Response) {
  try {
    const { base } = req.query as { base?: string };
    const params: string[] = [];
    const whereClause = base ? `WHERE avaliado.base = $1` : "";
    if (base) params.push(base);

    const { rows } = await pool.query(`
      SELECT
        a.id,
        avaliador.id AS avaliador_id,
        avaliador.nome AS avaliador_nome,
        avaliador.base AS avaliador_base,
        avaliador.funcao AS avaliador_funcao,
        avaliado.id AS avaliado_id,
        avaliado.nome AS avaliado_nome,
        avaliado.base AS avaliado_base,
        avaliado.funcao AS avaliado_funcao,
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
      return res.status(400).json({
        erro: "Campo 'modalidade' é obrigatório para verificar a frequência da avaliação.",
      });
    }

    if (!tipoAvaliacao) {
      return res.status(400).json({
        erro: "Campo 'tipo_avaliacao' é obrigatório.",
      });
    }

    // ========== Buscar dados do usuário avaliado ==========
    const usuarioResult = await pool.query(
      `SELECT id, criado_em FROM usuarios WHERE id = $1`,
      [avaliadoId]
    );

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário avaliado não encontrado." });
    }

    const usuarioAvaliado = usuarioResult.rows[0];
    
    // ========== Determina o nível dinamicamente ==========
    let nivel: string;
    try {
      nivel = await determinarNivel(new Date(usuarioAvaliado.criado_em));
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }

    // ========== Buscar frequência por NÍVEL ==========
    const freqResult = await pool.query(
      `
      SELECT dias, semanas, meses, anos
      FROM frequencia_por_nivel
      WHERE nivel = $1 AND ativo = TRUE
      LIMIT 1
      `,
      [nivel]
    );

    if (freqResult.rows.length === 0) {
      return res.status(500).json({
        erro: `Configuração de frequência não encontrada para o nível '${nivel}'.`,
      });
    }

    const freq = freqResult.rows[0];
    const semRestricao =
      freq.dias === 0 &&
      freq.semanas === 0 &&
      freq.meses === 0 &&
      freq.anos === 0;

    // ========== Verifica bloqueio baseado no nível E tipo_avaliacao ==========
    if (!semRestricao) {
      // Verifica se existe avaliação do mesmo avaliador para o mesmo avaliado 
      // com a MESMA modalidade E MESMO tipo_avaliacao
      const bloqueio = await pool.query(
        `
        SELECT id, criado_em,
          (criado_em + make_interval(days => $5, weeks => $6, months => $7, years => $8)) AS libera_em
        FROM avaliacoes
        WHERE avaliado_id = $1
          AND avaliador_id = $2
          AND modalidade = $3
          AND tipo_avaliacao = $4
          AND (criado_em + make_interval(days => $5, weeks => $6, months => $7, years => $8)) > NOW()
        ORDER BY criado_em DESC
        LIMIT 1
        `,
        [
          avaliadoId, 
          avaliadorId, 
          modalidade, 
          tipoAvaliacao, 
          freq.dias, 
          freq.semanas, 
          freq.meses, 
          freq.anos
        ]
      );

      if (bloqueio.rows.length > 0) {
        const liberaEm = new Date(bloqueio.rows[0].libera_em);
        return res.status(409).json({
          erro: `Você já avaliou este usuário como "${tipoAvaliacao}" na modalidade "${modalidade}" recentemente. Próxima avaliação liberada em ${liberaEm.toLocaleDateString("pt-BR")} às ${liberaEm.toLocaleTimeString("pt-BR")}.`,
          nivel,
          modalidade,
          tipoAvaliacao,
          liberaEm,
        });
      }
    }

    // ========== Cria a avaliação normalmente ==========
    const { rows } = await pool.query(
      `
      INSERT INTO avaliacoes
        (avaliador_id, avaliado_id, modalidade, tipo_avaliacao, resultado, observacoes_gerais, pontos_melhorar, plano_acao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [avaliadorId, avaliadoId, modalidade, tipoAvaliacao, resultado, observacoesGerais, pontosMelhorar, planoAcao]
    );

    res.status(201).json({
      ...rows[0],
      nivel, // Retorna o nível calculado
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

/**
 * Lista as configurações de frequência por nível
 */
export async function frequenciaAvaliacoes(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        nivel,
        dias_minimos,
        dias_maximos,
        dias,
        semanas,
        meses,
        anos,
        ativo,
        atualizado_em
      FROM frequencia_por_nivel
      ORDER BY dias_minimos;
    `);

    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

/**
 * Cria um novo nível de frequência
 */
export async function criarNivelFrequencia(req: Request, res: Response) {
  try {
    const { nivel, dias_minimos, dias_maximos, dias, semanas, meses, anos, ativo } = req.body;

    // Verifica se o nível já existe
    const existe = await pool.query(
      `SELECT id FROM frequencia_por_nivel WHERE nivel = $1`,
      [nivel]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ 
        erro: `Nível '${nivel}' já existe. Use PUT para atualizar.` 
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO frequencia_por_nivel 
        (nivel, dias_minimos, dias_maximos, dias, semanas, meses, anos, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [nivel, dias_minimos, dias_maximos, dias, semanas, meses, anos, ativo]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

/**
 * Atualiza a configuração de frequência por ID
 */
export async function definirFrequencia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nivel, dias, semanas, meses, anos, dias_minimos, dias_maximos, ativo } = req.body;

    // Verifica se o registro existe
    const existe = await pool.query(
      `SELECT id FROM frequencia_por_nivel WHERE id = $1`,
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ 
        erro: `Registro com ID '${id}' não encontrado.` 
      });
    }

    const { rows } = await pool.query(
      `
      UPDATE frequencia_por_nivel
      SET
        nivel = $1,
        dias = $2,
        semanas = $3,
        meses = $4,
        anos = $5,
        dias_minimos = $6,
        dias_maximos = $7,
        ativo = $8,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
      `,
      [nivel, dias, semanas, meses, anos, dias_minimos, dias_maximos, ativo, id]
    );

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

/**
 * Remove um nível de frequência (desativa)
 */
export async function removerNivelFrequencia(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      UPDATE frequencia_por_nivel
      SET ativo = FALSE, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: `Registro com ID '${id}' não encontrado.` });
    }

    res.json({ message: `Nível desativado com sucesso.`, nivel: rows[0] });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}

/**
 * Endpoint adicional: Obter informações sobre um usuário específico
 * (nível calculado + próxima avaliação permitida)
 */
export async function infosUsuario(req: Request, res: Response) {
  try {
    const { usuarioId, avaliadorId, modalidade, tipoAvaliacao } = req.query as {
      usuarioId?: string;
      avaliadorId?: string;
      modalidade?: string;
      tipoAvaliacao?: string;
    };

    if (!usuarioId) {
      return res.status(400).json({ erro: "Parâmetro 'usuarioId' é obrigatório." });
    }

    // Busca dados do usuário (incluindo nome)
    const usuarioResult = await pool.query(
      `SELECT id, nome, criado_em FROM usuarios WHERE id = $1`,
      [usuarioId]
    );

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const usuario = usuarioResult.rows[0];
    
    // ========== Determina o nível dinamicamente ==========
    let nivel: string;
    try {
      nivel = await determinarNivel(new Date(usuario.criado_em));
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }

    // Busca frequência do nível
    const freqResult = await pool.query(
      `SELECT * FROM frequencia_por_nivel WHERE nivel = $1 AND ativo = TRUE`,
      [nivel]
    );

    // Busca todos os níveis para contexto
    const todosNiveis = await pool.query(
      `SELECT nivel, dias_minimos, dias_maximos FROM frequencia_por_nivel WHERE ativo = TRUE ORDER BY dias_minimos`
    );

    const infoResposta: any = {
      usuarioId,
      nome: usuario.nome,
      nivel,
      dias_desde_criacao: Math.floor(
        (new Date().getTime() - new Date(usuario.criado_em).getTime()) / (1000 * 60 * 60 * 24)
      ),
      frequencia: freqResult.rows[0] || null,
      niveis_disponiveis: todosNiveis.rows,
    };

    // Se informou avaliador, modalidade e tipo_avaliacao, busca última avaliação
    if (avaliadorId && modalidade && tipoAvaliacao) {
      const ultimaResult = await pool.query(
        `
        SELECT id, criado_em,
          (criado_em + make_interval(
            days => (SELECT dias FROM frequencia_por_nivel WHERE nivel = $4 AND ativo = TRUE),
            weeks => (SELECT semanas FROM frequencia_por_nivel WHERE nivel = $4 AND ativo = TRUE),
            months => (SELECT meses FROM frequencia_por_nivel WHERE nivel = $4 AND ativo = TRUE),
            years => (SELECT anos FROM frequencia_por_nivel WHERE nivel = $4 AND ativo = TRUE)
          )) AS proxima_liberacao
        FROM avaliacoes
        WHERE avaliado_id = $1 
          AND avaliador_id = $2 
          AND modalidade = $3 
          AND tipo_avaliacao = $5
        ORDER BY criado_em DESC
        LIMIT 1
        `,
        [usuarioId, avaliadorId, modalidade, nivel, tipoAvaliacao]
      );

      if (ultimaResult.rows.length > 0) {
        infoResposta.ultima_avaliacao = ultimaResult.rows[0].criado_em;
        infoResposta.proxima_liberacao = ultimaResult.rows[0].proxima_liberacao;
        infoResposta.pode_avaliar = new Date(ultimaResult.rows[0].proxima_liberacao) <= new Date();
        infoResposta.modalidade_verificada = modalidade;
        infoResposta.tipo_avaliacao_verificado = tipoAvaliacao;
      } else {
        infoResposta.pode_avaliar = true;
        infoResposta.modalidade_verificada = modalidade;
        infoResposta.tipo_avaliacao_verificado = tipoAvaliacao;
      }
    }

    // Busca todas as avaliações do usuário agrupadas por modalidade e tipo_avaliacao
    const todasAvaliacoes = await pool.query(
      `
      SELECT modalidade, tipo_avaliacao, COUNT(*) as total, MAX(criado_em) as ultima
      FROM avaliacoes
      WHERE avaliado_id = $1
      GROUP BY modalidade, tipo_avaliacao
      ORDER BY modalidade, tipo_avaliacao
      `,
      [usuarioId]
    );

    infoResposta.avaliacoes_por_modalidade_tipo = todasAvaliacoes.rows;

    res.json(infoResposta);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
}