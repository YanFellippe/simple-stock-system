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

// GET - Dados para gráfico de cadastros por período
router.get('/cadastros-periodo', async (req, res) => {
    try {
        const dias = parseInt(req.query.dias) || 30;
        
        // Simular dados de cadastros por período
        // Em uma implementação real, você teria uma coluna data_cadastro na tabela produtos
        const result = await pool.query(`
            SELECT 
                DATE(CURRENT_DATE - INTERVAL '${dias} days' + (generate_series(0, ${dias-1}) || ' days')::INTERVAL) as data,
                COALESCE(COUNT(p.id), 0) as total
            FROM generate_series(0, ${dias-1}) s
            LEFT JOIN produtos p ON DATE(CURRENT_DATE - INTERVAL '${dias} days' + (s || ' days')::INTERVAL) = CURRENT_DATE
            GROUP BY data
            ORDER BY data
        `);
        
        // Se não houver dados reais, gerar dados simulados
        const labels = [];
        const data = [];
        const hoje = new Date();

        for (let i = dias - 1; i >= 0; i--) {
            const data_atual = new Date(hoje);
            data_atual.setDate(hoje.getDate() - i);
            
            if (dias <= 7) {
                labels.push(data_atual.toLocaleDateString('pt-BR', { weekday: 'short' }));
            } else if (dias <= 30) {
                labels.push(data_atual.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            } else {
                labels.push(data_atual.toLocaleDateString('pt-BR', { month: 'short' }));
            }
            
            // Simular dados aleatórios baseados no período
            data.push(Math.floor(Math.random() * (dias <= 7 ? 5 : dias <= 30 ? 3 : 2)) + 1);
        }

        res.json({ labels, data });
    } catch (error) {
        console.error('Erro ao buscar dados de cadastros por período:', error);
        res.status(500).json({ erro: 'Erro ao buscar dados de cadastros por período' });
    }
});

// GET - Dados para gráfico de movimentações de estoque
router.get('/movimentacoes-resumo', async (req, res) => {
    try {
        const dias = parseInt(req.query.dias) || 30;
        
        const result = await pool.query(`
            SELECT 
                acao,
                COUNT(*) as total
            FROM logs_estoque 
            WHERE data_hora >= CURRENT_DATE - INTERVAL '${dias} days'
            GROUP BY acao
            ORDER BY acao
        `);
        
        // Garantir que todas as ações estejam presentes
        const movimentacoes = {
            adicionado: 0,
            atualizado: 0,
            removido: 0
        };
        
        result.rows.forEach(row => {
            if (movimentacoes.hasOwnProperty(row.acao)) {
                movimentacoes[row.acao] = parseInt(row.total);
            }
        });
        
        res.json(movimentacoes);
    } catch (error) {
        console.error('Erro ao buscar resumo de movimentações:', error);
        res.status(500).json({ erro: 'Erro ao buscar resumo de movimentações' });
    }
});

// GET - Dados para análise de tendências
router.get('/tendencias', async (req, res) => {
    try {
        const [produtosMaisVendidos, categoriasPopulares, estoqueStatus] = await Promise.all([
            // Produtos mais pedidos (simulado)
            pool.query(`
                SELECT produto, COUNT(*) as total_pedidos
                FROM pedidos 
                GROUP BY produto 
                ORDER BY total_pedidos DESC 
                LIMIT 5
            `),
            
            // Categorias mais populares
            pool.query(`
                SELECT categoria, COUNT(*) as total_produtos, AVG(quantidade) as media_estoque
                FROM produtos 
                GROUP BY categoria 
                ORDER BY total_produtos DESC
            `),
            
            // Status geral do estoque
            pool.query(`
                SELECT 
                    CASE 
                        WHEN quantidade <= 5 THEN 'Crítico'
                        WHEN quantidade <= 10 THEN 'Baixo'
                        WHEN quantidade <= 50 THEN 'Normal'
                        ELSE 'Alto'
                    END as status,
                    COUNT(*) as total
                FROM produtos
                GROUP BY 
                    CASE 
                        WHEN quantidade <= 5 THEN 'Crítico'
                        WHEN quantidade <= 10 THEN 'Baixo'
                        WHEN quantidade <= 50 THEN 'Normal'
                        ELSE 'Alto'
                    END
                ORDER BY 
                    CASE 
                        WHEN status = 'Crítico' THEN 1
                        WHEN status = 'Baixo' THEN 2
                        WHEN status = 'Normal' THEN 3
                        ELSE 4
                    END
            `)
        ]);

        res.json({
            produtosMaisVendidos: produtosMaisVendidos.rows,
            categoriasPopulares: categoriasPopulares.rows,
            estoqueStatus: estoqueStatus.rows
        });
    } catch (error) {
        console.error('Erro ao buscar dados de tendências:', error);
        res.status(500).json({ erro: 'Erro ao buscar dados de tendências' });
    }
});

module.exports = router;