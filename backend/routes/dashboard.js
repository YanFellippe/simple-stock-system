const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Estatísticas do dashboard
router.get('/stats', async (req, res) => {
    try {
        // Buscar estatísticas em paralelo
        const [produtos, pedidos, estoqueBaixo, logs] = await Promise.all([
            pool.query('SELECT COUNT(*) as total FROM produtos'),
            pool.query('SELECT COUNT(*) as total FROM pedidos'),
            pool.query('SELECT COUNT(*) as total FROM produtos WHERE quantidade < 10'),
            pool.query('SELECT COUNT(*) as total FROM logs_estoque WHERE data_hora >= CURRENT_DATE')
        ]);

        const stats = {
            totalProdutos: parseInt(produtos.rows[0].total),
            totalPedidos: parseInt(pedidos.rows[0].total),
            estoqueBaixo: parseInt(estoqueBaixo.rows[0].total),
            movimentacoesHoje: parseInt(logs.rows[0].total)
        };

        res.json(stats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
    }
});

// GET - Produtos com estoque baixo
router.get('/estoque-baixo', async (req, res) => {
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

// GET - Últimos pedidos
router.get('/pedidos-recentes', async (req, res) => {
    try {
        const limite = req.query.limite || 5;
        const result = await pool.query(
            'SELECT * FROM pedidos ORDER BY data_pedido DESC LIMIT $1',
            [limite]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos recentes:', error);
        res.status(500).json({ erro: 'Erro ao buscar pedidos recentes' });
    }
});

// GET - Logs de estoque recentes
router.get('/logs-estoque', async (req, res) => {
    try {
        const limite = req.query.limite || 10;
        const result = await pool.query(`
            SELECT l.*, p.nome as produto_nome 
            FROM logs_estoque l 
            LEFT JOIN produtos p ON l.produto_id = p.id 
            ORDER BY l.data_hora DESC 
            LIMIT $1
        `, [limite]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar logs de estoque:', error);
        res.status(500).json({ erro: 'Erro ao buscar logs de estoque' });
    }
});

// GET - Resumo por categoria
router.get('/categorias', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                categoria,
                COUNT(*) as total_produtos,
                SUM(quantidade) as total_quantidade
            FROM produtos 
            GROUP BY categoria 
            ORDER BY total_quantidade DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar resumo por categoria:', error);
        res.status(500).json({ erro: 'Erro ao buscar resumo por categoria' });
    }
});

module.exports = router;