const pool = require('../config/database');

async function corrigirTabelaPedidos() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Corrigindo estrutura da tabela pedidos...');
    
    // Verificar se existe coluna cliente
    const checkCliente = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos' AND column_name = 'cliente';
    `);
    
    if (checkCliente.rows.length > 0) {
      console.log('⚠️ Encontrada coluna "cliente" - renomeando para "cliente_nome"');
      
      // Renomear coluna cliente para cliente_nome
      await client.query(`
        ALTER TABLE pedidos 
        RENAME COLUMN cliente TO cliente_nome;
      `);
      
      console.log('✅ Coluna renomeada com sucesso!');
    }
    
    // Verificar se existe coluna cliente_nome
    const checkClienteNome = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos' AND column_name = 'cliente_nome';
    `);
    
    if (checkClienteNome.rows.length === 0) {
      console.log('➕ Adicionando coluna cliente_nome');
      
      await client.query(`
        ALTER TABLE pedidos 
        ADD COLUMN cliente_nome VARCHAR(100) NOT NULL DEFAULT 'Cliente';
      `);
      
      console.log('✅ Coluna cliente_nome adicionada!');
    }
    
    // Adicionar outras colunas necessárias se não existirem
    await client.query(`
      ALTER TABLE pedidos 
      ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(50) DEFAULT 'dinheiro',
      ADD COLUMN IF NOT EXISTS desconto DECIMAL(10,2) DEFAULT 0;
    `);
    
    console.log('✅ Estrutura da tabela pedidos corrigida!');
    
  } catch (error) {
    console.error('❌ Erro ao corrigir tabela:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  corrigirTabelaPedidos()
    .then(() => {
      console.log('🎉 Correção concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro na correção:', error);
      process.exit(1);
    });
}

module.exports = { corrigirTabelaPedidos };