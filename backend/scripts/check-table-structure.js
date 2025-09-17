const pool = require('../config/database');

async function verificarEstruturaPedidos() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando estrutura da tabela pedidos...');
    
    // Verificar colunas da tabela pedidos
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'pedidos' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colunas da tabela pedidos:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Verificar se existe coluna cliente
    const clienteColumn = result.rows.find(row => row.column_name === 'cliente');
    if (clienteColumn) {
      console.log('⚠️ Encontrada coluna "cliente" na tabela!');
    }
    
    // Verificar se existe coluna cliente_nome
    const clienteNomeColumn = result.rows.find(row => row.column_name === 'cliente_nome');
    if (clienteNomeColumn) {
      console.log('✅ Encontrada coluna "cliente_nome" na tabela!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error);
  } finally {
    client.release();
  }
}

verificarEstruturaPedidos()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });