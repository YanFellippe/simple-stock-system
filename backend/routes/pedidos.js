const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
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
        
        // Criar o pedido
        const pedidoResult = await client.query(
            'INSERT INTO pedidos (cliente, produto_id, produto_nome, quantidade, preco_unitario, valor_total, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [cliente, produto_id, produto.nome, quantidade, preco_unitario, valor_total, status]
        );
        
        // Atualizar estoque do produto
        await client.query(
            'UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2',
            [quantidade, produto_id]
        );
        
        await client.query('COMMIT');
        
        res.status(201).json(pedidoResult.rows[0]);
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
        
        // Buscar o pedido antes de excluir
        const pedidoResult = await client.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        
        if (pedidoResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        const pedido = pedidoResult.rows[0];
        
        // Devolver estoque apenas se o pedido não foi entregue
        if (pedido.status !== 'entregue') {
            await client.query(
                'UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2',
                [pedido.quantidade, pedido.produto_id]
            );
        }
        
        // Excluir o pedido
        await client.query('DELETE FROM pedidos WHERE id = $1', [id]);
        
        await client.query('COMMIT');
        
        res.json({ 
            mensagem: 'Pedido excluído com sucesso', 
            pedido: pedido,
            estoque_devolvido: pedido.status !== 'entregue'
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