const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        console.log('🔄 Conectando ao PostgreSQL...');
        
        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, '..', '..', 'database', 'lanchonete_db.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Executar o script SQL
        console.log('📊 Executando script de inicialização...');
        await pool.query(sqlContent);
        
        console.log('✅ Banco de dados inicializado com sucesso!');
        console.log('📋 Tabelas criadas:');
        console.log('   - produtos');
        console.log('   - usuarios');
        console.log('   - pedidos');
        console.log('   - logs_estoque');
        console.log('🔐 Usuário admin criado: admin@lanchonete.com / admin123');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
    } finally {
        await pool.end();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;