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
    try {
        const { cliente, produto, quantidade, status = 'pendente' } = req.body;
        
        if (!cliente || !produto || !quantidade) {
            return res.status(400).json({ erro: 'Cliente, produto e quantidade são obrigatórios' });
        }
        
        const result = await pool.query(
            'INSERT INTO pedidos (cliente, produto, quantidade, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente, produto, quantidade, status]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ erro: 'Erro ao criar pedido' });
    }
});

// PUT - Atualizar pedido
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente, produto, quantidade, status } = req.body;
        
        const result = await pool.query(
            'UPDATE pedidos SET cliente = $1, produto = $2, quantidade = $3, status = $4 WHERE id = $5 RETURNING *',
            [cliente, produto, quantidade, status, id]
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

// DELETE - Excluir pedido
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        res.json({ mensagem: 'Pedido excluído com sucesso', pedido: result.rows[0] });
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        res.status(500).json({ erro: 'Erro ao excluir pedido' });
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