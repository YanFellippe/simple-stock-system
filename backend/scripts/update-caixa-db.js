const pool = require('../config/database');

async function criarTabelasCaixa() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Criando tabelas do sistema de caixa...');
    
    // Tabela de caixa
    await client.query(`
      CREATE TABLE IF NOT EXISTS caixa (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        data_abertura TIMESTAMP DEFAULT NOW(),
        data_fechamento TIMESTAMP,
        valor_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
        valor_atual DECIMAL(10,2) NOT NULL DEFAULT 0,
        valor_final DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Tabela de movimentações do caixa
    await client.query(`
      CREATE TABLE IF NOT EXISTS movimentacoes_caixa (
        id SERIAL PRIMARY KEY,
        caixa_id INTEGER REFERENCES caixa(id),
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('venda', 'sangria', 'suprimento')),
        valor DECIMAL(10,2) NOT NULL,
        motivo TEXT,
        usuario_id INTEGER REFERENCES usuarios(id),
        pedido_id INTEGER REFERENCES pedidos(id),
        data_hora TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Adicionar campos de forma de pagamento e desconto na tabela pedidos se não existirem
    await client.query(`
      ALTER TABLE pedidos 
      ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(50) DEFAULT 'dinheiro',
      ADD COLUMN IF NOT EXISTS desconto DECIMAL(10,2) DEFAULT 0;
    `);
    
    // Criar tabela de itens do pedido se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
        produto_id INTEGER REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        preco_unitario DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Índices para performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_caixa_usuario_status ON caixa(usuario_id, status);
      CREATE INDEX IF NOT EXISTS idx_movimentacoes_caixa_id ON movimentacoes_caixa(caixa_id);
      CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_caixa(data_hora);
      CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
    `);
    
    console.log('✅ Tabelas do sistema de caixa criadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas do caixa:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  criarTabelasCaixa()
    .then(() => {
      console.log('🎉 Sistema de caixa configurado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro na configuração:', error);
      process.exit(1);
    });
}

module.exports = { criarTabelasCaixa };