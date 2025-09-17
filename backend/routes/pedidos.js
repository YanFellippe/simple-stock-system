const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Listar todos os pedidos com informações dos produtos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.cliente_nome as cliente,
                p.valor_total,
                p.status,
                p.forma_pagamento,
                p.desconto,
                p.data_pedido,
                -- Para compatibilidade com o frontend antigo
                COALESCE(
                    (SELECT pr.nome FROM itens_pedido ip 
                     JOIN produtos pr ON ip.produto_id = pr.id 
                     WHERE ip.pedido_id = p.id LIMIT 1),
                    'Múltiplos itens'
                ) as produto_nome,
                COALESCE(
                    (SELECT SUM(ip.quantidade) FROM itens_pedido ip 
                     WHERE ip.pedido_id = p.id),
                    0
                ) as quantidade,
                COALESCE(
                    (SELECT ip.preco_unitario FROM itens_pedido ip 
                     WHERE ip.pedido_id = p.id LIMIT 1),
                    0
                ) as preco_unitario
            FROM pedidos p
            ORDER BY p.data_pedido DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ erro: 'Erro ao buscar pedidos' });
    }
});

// GET - Buscar pedido por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ erro: 'Erro ao buscar pedido' });
    }
});

// POST - Criar novo pedido
router.post('/', async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { cliente, produto_id, quantidade, status = 'pendente' } = req.body;
        
        if (!cliente || !produto_id || !quantidade) {
            return res.status(400).json({ erro: 'Cliente, produto_id e quantidade são obrigatórios' });
        }
        
        // Buscar informações do produto
        const produtoResult = await client.query(
            'SELECT * FROM produtos WHERE id = $1',
            [produto_id]
        );
        
        if (produtoResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        const produto = produtoResult.rows[0];
        
        // Verificar se há estoque suficiente
        if (produto.quantidade < quantidade) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                erro: `Estoque insuficiente. Disponível: ${produto.quantidade}, Solicitado: ${quantidade}` 
            });
        }
        
        // Calcular valor total
        const preco_unitario = parseFloat(produto.preco);
        const valor_total = preco_unitario * quantidade;
        
        // Criar o pedido (nova estrutura)
        const pedidoResult = await client.query(
            'INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente, valor_total, status, 'dinheiro']
        );
        
        const pedidoId = pedidoResult.rows[0].id;
        
        // Criar item do pedido
        await client.query(
            'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
            [pedidoId, produto_id, quantidade, preco_unitario]
        );
        
        // Atualizar estoque do produto
        await client.query(
            'UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2',
            [quantidade, produto_id]
        );
        
        await client.query('COMMIT');
        
        // Retornar pedido com informações do produto para compatibilidade
        const pedidoCompleto = {
            ...pedidoResult.rows[0],
            cliente: cliente,
            produto_nome: produto.nome,
            quantidade: quantidade,
            preco_unitario: preco_unitario
        };
        
        res.status(201).json(pedidoCompleto);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ erro: 'Erro ao criar pedido' });
    } finally {
        client.release();
    }
});

// PUT - Atualizar pedido (apenas status)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ erro: 'Status é obrigatório' });
        }
        
        const result = await pool.query(
            'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({ erro: 'Erro ao atualizar pedido' });
    }
});

// DELETE - Excluir pedido (com devolução de estoque)
router.delete('/:id', async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        
        // Buscar o pedido e seus itens antes de excluir
        const pedidoResult = await client.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        
        if (pedidoResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        const pedido = pedidoResult.rows[0];
        
        // Buscar itens do pedido
        const itensResult = await client.query(
            'SELECT * FROM itens_pedido WHERE pedido_id = $1',
            [id]
        );
        
        // Devolver estoque apenas se o pedido não foi entregue
        if (pedido.status !== 'entregue' && pedido.status !== 'finalizado') {
            for (const item of itensResult.rows) {
                await client.query(
                    'UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2',
                    [item.quantidade, item.produto_id]
                );
            }
        }
        
        // Excluir itens do pedido primeiro (devido à foreign key)
        await client.query('DELETE FROM itens_pedido WHERE pedido_id = $1', [id]);
        
        // Excluir o pedido
        await client.query('DELETE FROM pedidos WHERE id = $1', [id]);
        
        await client.query('COMMIT');
        
        res.json({ 
            mensagem: 'Pedido excluído com sucesso', 
            pedido: pedido,
            estoque_devolvido: pedido.status !== 'entregue' && pedido.status !== 'finalizado'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao excluir pedido:', error);
        res.status(500).json({ erro: 'Erro ao excluir pedido' });
    } finally {
        client.release();
    }
});

// GET - Pedidos por status
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const result = await pool.query(
            'SELECT * FROM pedidos WHERE status = $1 ORDER BY data_pedido DESC',
            [status]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos por status:', error);
        res.status(500).json({ erro: 'Erro ao buscar pedidos por status' });
    }
});

module.exports = router;