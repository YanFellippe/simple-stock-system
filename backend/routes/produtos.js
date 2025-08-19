const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
});

// POST - Adicionar novo produto
router.post('/', async (req, res) => {
    try {
        const { nome, quantidade, categoria, preco } = req.body;
        
        if (!nome || quantidade === undefined || !categoria || preco === undefined) {
            return res.status(400).json({ erro: 'Nome, quantidade, categoria e preço são obrigatórios' });
        }
        
        const result = await pool.query(
            'INSERT INTO produtos (nome, quantidade, categoria, preco) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, quantidade, categoria, preco]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ erro: 'Erro ao adicionar produto' });
    }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, quantidade, categoria, preco } = req.body;
        
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, quantidade = $2, categoria = $3, preco = $4 WHERE id = $5 RETURNING *',
            [nome, quantidade, categoria, preco, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
});

// DELETE - Excluir produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json({ mensagem: 'Produto excluído com sucesso', produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ erro: 'Erro ao excluir produto' });
    }
});

// GET - Produtos com estoque baixo
router.get('/estoque/baixo', async (req, res) => {
    try {
        const limite = req.query.limite || 10;
        const result = await pool.query(
            'SELECT * FROM produtos WHERE quantidade < $1 ORDER BY quantidade ASC',
            [limite]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
        res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo' });
    }
});

module.exports = router;