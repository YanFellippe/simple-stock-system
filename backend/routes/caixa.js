const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Abrir caixa
router.post('/abrir', async (req, res) => {
  try {
    const { usuario_id, valor_inicial } = req.body;
    
    // Verificar se já existe caixa aberto
    const caixaAberto = await pool.query(
      'SELECT * FROM caixa WHERE status = $1 AND usuario_id = $2',
      ['aberto', usuario_id]
    );
    
    if (caixaAberto.rows.length > 0) {
      return res.status(400).json({ error: 'Já existe um caixa aberto para este usuário' });
    }
    
    const result = await pool.query(
      `INSERT INTO caixa (usuario_id, data_abertura, valor_inicial, valor_atual, status) 
       VALUES ($1, NOW(), $2, $2, 'aberto') RETURNING *`,
      [usuario_id, valor_inicial]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao abrir caixa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fechar caixa
router.post('/fechar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_final, observacoes } = req.body;
    
    const result = await pool.query(
      `UPDATE caixa SET 
       data_fechamento = NOW(), 
       valor_final = $1, 
       observacoes = $2, 
       status = 'fechado' 
       WHERE id = $3 AND status = 'aberto' RETURNING *`,
      [valor_final, observacoes, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Caixa não encontrado ou já fechado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao fechar caixa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Sangria (retirada de dinheiro)
router.post('/sangria', async (req, res) => {
  try {
    const { caixa_id, valor, motivo, usuario_id } = req.body;
    
    // Registrar sangria
    const sangria = await pool.query(
      `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id, data_hora) 
       VALUES ($1, 'sangria', $2, $3, $4, NOW()) RETURNING *`,
      [caixa_id, valor, motivo, usuario_id]
    );
    
    // Atualizar valor atual do caixa
    await pool.query(
      'UPDATE caixa SET valor_atual = valor_atual - $1 WHERE id = $2',
      [valor, caixa_id]
    );
    
    res.json(sangria.rows[0]);
  } catch (error) {
    console.error('Erro ao fazer sangria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Suprimento (adição de dinheiro)
router.post('/suprimento', async (req, res) => {
  try {
    const { caixa_id, valor, motivo, usuario_id } = req.body;
    
    // Registrar suprimento
    const suprimento = await pool.query(
      `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id, data_hora) 
       VALUES ($1, 'suprimento', $2, $3, $4, NOW()) RETURNING *`,
      [caixa_id, valor, motivo, usuario_id]
    );
    
    // Atualizar valor atual do caixa
    await pool.query(
      'UPDATE caixa SET valor_atual = valor_atual + $1 WHERE id = $2',
      [valor, caixa_id]
    );
    
    res.json(suprimento.rows[0]);
  } catch (error) {
    console.error('Erro ao fazer suprimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar venda no caixa
router.post('/venda', async (req, res) => {
  try {
    const { 
      caixa_id, 
      produtos, 
      total, 
      forma_pagamento, 
      desconto = 0, 
      cliente_nome = null,
      usuario_id 
    } = req.body;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Criar pedido
      const pedido = await client.query(
        `INSERT INTO pedidos (cliente_nome, total, status, data_pedido, forma_pagamento, desconto) 
         VALUES ($1, $2, 'finalizado', NOW(), $3, $4) RETURNING *`,
        [cliente_nome || 'Cliente Balcão', total, forma_pagamento, desconto]
      );
      
      const pedido_id = pedido.rows[0].id;
      
      // Adicionar itens do pedido e atualizar estoque
      for (const item of produtos) {
        // Inserir item do pedido
        await client.query(
          `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) 
           VALUES ($1, $2, $3, $4)`,
          [pedido_id, item.produto_id, item.quantidade, item.preco_unitario]
        );
        
        // Atualizar estoque
        await client.query(
          'UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2',
          [item.quantidade, item.produto_id]
        );
      }
      
      // Registrar movimentação no caixa
      await client.query(
        `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id, data_hora, pedido_id) 
         VALUES ($1, 'venda', $2, $3, $4, NOW(), $5)`,
        [caixa_id, total, `Venda - Pedido #${pedido_id}`, usuario_id, pedido_id]
      );
      
      // Atualizar valor atual do caixa
      await client.query(
        'UPDATE caixa SET valor_atual = valor_atual + $1 WHERE id = $2',
        [total, caixa_id]
      );
      
      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        pedido: pedido.rows[0],
        message: 'Venda registrada com sucesso' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter caixa atual do usuário
router.get('/atual/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, u.nome as usuario_nome 
       FROM caixa c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.usuario_id = $1 AND c.status = 'aberto' 
       ORDER BY c.data_abertura DESC LIMIT 1`,
      [usuario_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum caixa aberto encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar caixa atual:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter movimentações do caixa
router.get('/movimentacoes/:caixa_id', async (req, res) => {
  try {
    const { caixa_id } = req.params;
    
    const result = await pool.query(
      `SELECT m.*, u.nome as usuario_nome 
       FROM movimentacoes_caixa m 
       JOIN usuarios u ON m.usuario_id = u.id 
       WHERE m.caixa_id = $1 
       ORDER BY m.data_hora DESC`,
      [caixa_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Relatório de caixa
router.get('/relatorio/:caixa_id', async (req, res) => {
  try {
    const { caixa_id } = req.params;
    
    // Dados do caixa
    const caixa = await pool.query(
      `SELECT c.*, u.nome as usuario_nome 
       FROM caixa c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.id = $1`,
      [caixa_id]
    );
    
    // Resumo por forma de pagamento
    const formasPagamento = await pool.query(
      `SELECT 
         p.forma_pagamento,
         COUNT(*) as quantidade_vendas,
         SUM(p.total) as total_vendas
       FROM pedidos p
       JOIN movimentacoes_caixa m ON m.pedido_id = p.id
       WHERE m.caixa_id = $1 AND m.tipo = 'venda'
       GROUP BY p.forma_pagamento`,
      [caixa_id]
    );
    
    // Total de vendas
    const totalVendas = await pool.query(
      `SELECT 
         COUNT(*) as quantidade_vendas,
         COALESCE(SUM(valor), 0) as total_vendas
       FROM movimentacoes_caixa 
       WHERE caixa_id = $1 AND tipo = 'venda'`,
      [caixa_id]
    );
    
    // Sangrias e suprimentos
    const sangrias = await pool.query(
      `SELECT COALESCE(SUM(valor), 0) as total_sangrias
       FROM movimentacoes_caixa 
       WHERE caixa_id = $1 AND tipo = 'sangria'`,
      [caixa_id]
    );
    
    const suprimentos = await pool.query(
      `SELECT COALESCE(SUM(valor), 0) as total_suprimentos
       FROM movimentacoes_caixa 
       WHERE caixa_id = $1 AND tipo = 'suprimento'`,
      [caixa_id]
    );
    
    res.json({
      caixa: caixa.rows[0],
      formas_pagamento: formasPagamento.rows,
      total_vendas: totalVendas.rows[0],
      total_sangrias: sangrias.rows[0].total_sangrias,
      total_suprimentos: suprimentos.rows[0].total_suprimentos
    });
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar status atual do caixa
router.get('/status/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, u.nome as usuario_nome 
       FROM caixa c
       LEFT JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.usuario_id = $1 AND c.status = 'aberto'
       ORDER BY c.data_abertura DESC
       LIMIT 1`,
      [usuario_id]
    );
    
    if (result.rows.length > 0) {
      res.json({ 
        caixaAberto: true, 
        caixa: result.rows[0] 
      });
    } else {
      res.json({ 
        caixaAberto: false, 
        caixa: null 
      });
    }
  } catch (error) {
    console.error('Erro ao verificar status do caixa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar venda
router.post('/venda', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      caixa_id, 
      usuario_id, 
      itens, 
      subtotal, 
      desconto, 
      total, 
      forma_pagamento 
    } = req.body;
    
    // 1. Criar pedido (estrutura corrigida)
    const pedidoResult = await client.query(
      `INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento, desconto)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Cliente Balcão', total, 'entregue', forma_pagamento, desconto]
    );
    
    const pedidoId = pedidoResult.rows[0].id;
    
    // 2. Inserir itens do pedido e atualizar estoque
    for (const item of itens) {
      // Inserir item do pedido
      await client.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
      );
      
      // Atualizar estoque
      await client.query(
        `UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2`,
        [item.quantidade, item.produto_id]
      );
    }
    
    // 3. Registrar movimentação no caixa
    await client.query(
      `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id, pedido_id)
       VALUES ($1, 'venda', $2, $3, $4, $5)`,
      [caixa_id, total, `Venda #${pedidoId}`, usuario_id, pedidoId]
    );
    
    // 4. Atualizar valor atual do caixa
    await client.query(
      `UPDATE caixa SET valor_atual = valor_atual + $1 WHERE id = $2`,
      [total, caixa_id]
    );
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      pedido_id: pedidoId,
      message: 'Venda registrada com sucesso' 
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  } finally {
    client.release();
  }
});

// Buscar histórico de caixas
router.get('/historico', async (req, res) => {
  try {
    const { periodo = 30 } = req.query;
    
    let query, params;
    
    if (periodo > 0) {
      query = `
        SELECT 
          c.id,
          c.data_abertura,
          c.data_fechamento,
          c.valor_inicial,
          c.valor_atual,
          c.valor_final,
          c.observacoes,
          u.nome as usuario_nome,
          COALESCE(SUM(CASE WHEN m.tipo = 'venda' THEN m.valor ELSE 0 END), 0) as total_vendas,
          COUNT(CASE WHEN m.tipo = 'venda' THEN 1 END) as total_vendas_count,
          COALESCE(SUM(CASE WHEN m.tipo = 'sangria' THEN m.valor ELSE 0 END), 0) as total_sangrias,
          COALESCE(SUM(CASE WHEN m.tipo = 'suprimento' THEN m.valor ELSE 0 END), 0) as total_suprimentos
        FROM caixa c
        LEFT JOIN usuarios u ON c.usuario_id = u.id
        LEFT JOIN movimentacoes_caixa m ON c.id = m.caixa_id
        WHERE c.status = 'fechado' AND c.data_fechamento >= NOW() - INTERVAL ($1 || ' days')::INTERVAL
        GROUP BY c.id, c.data_abertura, c.data_fechamento, c.valor_inicial, c.valor_atual, c.valor_final, c.observacoes, u.nome
        ORDER BY c.data_fechamento DESC
        LIMIT 50
      `;
      params = [periodo];
    } else {
      query = `
        SELECT 
          c.id,
          c.data_abertura,
          c.data_fechamento,
          c.valor_inicial,
          c.valor_atual,
          c.valor_final,
          c.observacoes,
          u.nome as usuario_nome,
          COALESCE(SUM(CASE WHEN m.tipo = 'venda' THEN m.valor ELSE 0 END), 0) as total_vendas,
          COUNT(CASE WHEN m.tipo = 'venda' THEN 1 END) as total_vendas_count,
          COALESCE(SUM(CASE WHEN m.tipo = 'sangria' THEN m.valor ELSE 0 END), 0) as total_sangrias,
          COALESCE(SUM(CASE WHEN m.tipo = 'suprimento' THEN m.valor ELSE 0 END), 0) as total_suprimentos
        FROM caixa c
        LEFT JOIN usuarios u ON c.usuario_id = u.id
        LEFT JOIN movimentacoes_caixa m ON c.id = m.caixa_id
        WHERE c.status = 'fechado'
        GROUP BY c.id, c.data_abertura, c.data_fechamento, c.valor_inicial, c.valor_atual, c.valor_final, c.observacoes, u.nome
        ORDER BY c.data_fechamento DESC
        LIMIT 50
      `;
      params = [];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar sangria
router.post('/sangria', async (req, res) => {
  try {
    const { caixa_id, valor, motivo, usuario_id } = req.body;
    
    // Registrar movimentação
    await pool.query(
      `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id)
       VALUES ($1, 'sangria', $2, $3, $4)`,
      [caixa_id, valor, motivo, usuario_id]
    );
    
    // Atualizar valor do caixa
    const result = await pool.query(
      `UPDATE caixa SET valor_atual = valor_atual - $1 WHERE id = $2 RETURNING valor_atual`,
      [valor, caixa_id]
    );
    
    res.json({ 
      success: true, 
      novo_valor: result.rows[0].valor_atual,
      message: 'Sangria registrada com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro ao registrar sangria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar suprimento
router.post('/suprimento', async (req, res) => {
  try {
    const { caixa_id, valor, motivo, usuario_id } = req.body;
    
    // Registrar movimentação
    await pool.query(
      `INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id)
       VALUES ($1, 'suprimento', $2, $3, $4)`,
      [caixa_id, valor, motivo, usuario_id]
    );
    
    // Atualizar valor do caixa
    const result = await pool.query(
      `UPDATE caixa SET valor_atual = valor_atual + $1 WHERE id = $2 RETURNING valor_atual`,
      [valor, caixa_id]
    );
    
    res.json({ 
      success: true, 
      novo_valor: result.rows[0].valor_atual,
      message: 'Suprimento registrado com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro ao registrar suprimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fechar caixa
router.post('/fechar', async (req, res) => {
  try {
    const { caixa_id, valor_final, observacoes } = req.body;
    
    const result = await pool.query(
      `UPDATE caixa 
       SET status = 'fechado', 
           data_fechamento = NOW(), 
           valor_final = $1, 
           observacoes = $2
       WHERE id = $3 AND status = 'aberto'
       RETURNING *`,
      [valor_final, observacoes, caixa_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Caixa não encontrado ou já fechado' });
    }
    
    res.json({ 
      success: true, 
      caixa: result.rows[0],
      message: 'Caixa fechado com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro ao fechar caixa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;