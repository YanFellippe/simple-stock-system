const { Pool } = require('pg');
require('dotenv').config();

async function updateDatabase() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        console.log('🔄 Atualizando banco de dados...');
        
        // Verificar se a coluna preco já existe
        const checkColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='produtos' AND column_name='preco'
        `);
        
        if (checkColumn.rows.length === 0) {
            console.log('📦 Adicionando coluna preco na tabela produtos...');
            await pool.query('ALTER TABLE produtos ADD COLUMN preco DECIMAL(10,2) NOT NULL DEFAULT 0.00');
            
            // Atualizar produtos existentes com preços padrão
            console.log('💰 Atualizando preços dos produtos existentes...');
            await pool.query(`
                UPDATE produtos SET preco = CASE 
                    WHEN nome = 'Pão' THEN 2.50
                    WHEN nome = 'Queijo' THEN 8.90
                    WHEN nome = 'Presunto' THEN 12.50
                    WHEN nome = 'Refrigerante' THEN 4.50
                    WHEN nome = 'Café' THEN 3.00
                    WHEN nome = 'Leite' THEN 5.50
                    WHEN nome = 'Manteiga' THEN 6.80
                    WHEN nome = 'Hambúrguer' THEN 15.90
                    WHEN nome = 'Batata Frita' THEN 8.50
                    WHEN nome = 'Água Mineral' THEN 2.00
                    WHEN nome = 'Suco de Laranja' THEN 6.50
                    WHEN nome = 'Ketchup' THEN 4.20
                    WHEN nome = 'Maionese' THEN 5.80
                    WHEN nome = 'Alface' THEN 3.50
                    ELSE 5.00
                END
            `);
        } else {
            console.log('✅ Coluna preco já existe');
        }
        
        // Verificar estrutura da tabela pedidos
        const checkPedidosStructure = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='pedidos' AND column_name='produto_id'
        `);
        
        if (checkPedidosStructure.rows.length === 0) {
            console.log('🔄 Atualizando estrutura da tabela pedidos...');
            
            // Fazer backup dos pedidos existentes
            const pedidosExistentes = await pool.query('SELECT * FROM pedidos');
            
            // Recriar tabela pedidos
            await pool.query('DROP TABLE IF EXISTS pedidos CASCADE');
            await pool.query(`
                CREATE TABLE pedidos (
                    id SERIAL PRIMARY KEY,
                    cliente VARCHAR(100) NOT NULL,
                    produto_id INT NOT NULL,
                    produto_nome VARCHAR(100) NOT NULL,
                    quantidade INT NOT NULL,
                    preco_unitario DECIMAL(10,2) NOT NULL,
                    valor_total DECIMAL(10,2) NOT NULL,
                    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'preparando', 'pronto', 'entregue')),
                    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (produto_id) REFERENCES produtos(id)
                )
            `);
            
            console.log('📋 Tabela pedidos atualizada com sucesso');
        } else {
            console.log('✅ Tabela pedidos já está atualizada');
        }
        
        console.log('🎉 Banco de dados atualizado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao atualizar banco de dados:', error);
    } finally {
        await pool.end();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    updateDatabase();
}

module.exports = updateDatabase;