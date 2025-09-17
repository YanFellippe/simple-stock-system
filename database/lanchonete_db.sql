CREATE DATABASE lanchonete_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Tabela de usuários (login)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso TEXT DEFAULT 'funcionario' CHECK (nivel_acesso IN ('admin', 'funcionario'))
);

-- Tabela de produtos (estoque)
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

-- Tabela de pedidos (versão normalizada)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL DEFAULT 'Cliente Balcão',
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'preparando', 'pronto', 'entregue', 'finalizado')),
    forma_pagamento VARCHAR(50) DEFAULT 'dinheiro',
    desconto DECIMAL(10,2) DEFAULT 0.00,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido (relaciona pedidos e produtos)
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de logs de alterações no estoque
CREATE TABLE IF NOT EXISTS logs_estoque (
    id SERIAL PRIMARY KEY,
    produto_id INT NOT NULL REFERENCES produtos(id),
    acao TEXT NOT NULL CHECK (acao IN ('adicionado', 'removido', 'atualizado')),
    quantidade INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de controle de caixas
CREATE TABLE IF NOT EXISTS caixa (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    data_abertura TIMESTAMP DEFAULT NOW(),
    data_fechamento TIMESTAMP,
    valor_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_atual DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_final DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
    observacoes TEXT
);

-- Tabela de movimentações do caixa
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


-- Parte 3: Funções e Triggers
CREATE OR REPLACE FUNCTION registrar_log_estoque()
RETURNS TRIGGER AS $$
BEGIN
    -- Ação: inserção de novo produto
    IF TG_OP = 'INSERT' THEN
        INSERT INTO logs_estoque (produto_id, acao, quantidade)
        VALUES (NEW.id, 'adicionado', NEW.quantidade);
        RETURN NEW;

    -- Ação: alteração de produto existente
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO logs_estoque (produto_id, acao, quantidade)
        VALUES (NEW.id, 'atualizado', NEW.quantidade - OLD.quantidade); -- Registra a diferença
        RETURN NEW;

    -- Ação: remoção de produto
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO logs_estoque (produto_id, acao, quantidade)
        VALUES (OLD.id, 'removido', OLD.quantidade);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Associa o trigger à tabela 'produtos'
DROP TRIGGER IF EXISTS trigger_log_estoque ON produtos;
CREATE TRIGGER trigger_log_estoque
AFTER INSERT OR UPDATE OR DELETE ON produtos
FOR EACH ROW
EXECUTE FUNCTION registrar_log_estoque();


-- Parte 4: Criação de Índices para Performance
CREATE INDEX IF NOT EXISTS idx_caixa_usuario_status ON caixa(usuario_id, status);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_caixa_id ON movimentacoes_caixa(caixa_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_caixa(data_hora);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(data_pedido);


-- Parte 5: Inserção de Dados Iniciais (Seed Data)

-- Inserir usuários (senhas: admin123, joao123, maria123, carlos123)
INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('Administrador', 'admin@lanchonete.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('João da Silva', 'joao@lanchonete.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'funcionario'),
('Maria Oliveira', 'maria@lanchonete.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'funcionario'),
('Carlos Souza', 'carlos@lanchonete.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir produtos
INSERT INTO produtos (nome, quantidade, categoria, preco) VALUES
('Pão Francês', 50, 'Padaria', 2.50),
('Queijo Mussarela', 30, 'Laticínios', 8.90),
('Presunto', 25, 'Frios', 12.50),
('Coca-Cola 350ml', 100, 'Bebidas', 4.50),
('Café Expresso', 80, 'Bebidas', 3.00),
('Leite Integral', 40, 'Laticínios', 5.50),
('Manteiga', 20, 'Laticínios', 6.80),
('Hambúrguer Artesanal', 35, 'Carnes', 15.90),
('Batata Frita Porção', 60, 'Acompanhamentos', 8.50),
('Água Mineral 500ml', 120, 'Bebidas', 2.00),
('Suco de Laranja Natural', 50, 'Bebidas', 6.50),
('Ketchup Sachê', 25, 'Condimentos', 0.50),
('Maionese Sachê', 20, 'Condimentos', 0.50),
('Alface Americana', 15, 'Hortifruti', 3.50),
('X-Burger Completo', 20, 'Lanches', 18.90),
('X-Salada', 25, 'Lanches', 16.50),
('Misto Quente', 30, 'Lanches', 12.00),
('Pastel de Queijo', 40, 'Salgados', 7.50),
('Coxinha', 35, 'Salgados', 6.00),
('Guaraná Antarctica 350ml', 80, 'Bebidas', 4.00),
('Suco de Uva', 30, 'Bebidas', 5.50),
('Pão de Açúcar', 25, 'Padaria', 3.00),
('Torta de Frango', 15, 'Salgados', 9.50),
('Empada de Palmito', 20, 'Salgados', 8.00),
('Café com Leite', 50, 'Bebidas', 4.50);

-- Inserir pedidos e seus itens de exemplo
-- Pedido 1 - X-Burger Completo + Batata + Coca
INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES 
('João Silva', 31.40, 'entregue', 'dinheiro');
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(1, 15, 1, 18.90), -- X-Burger Completo
(1, 9, 1, 8.50),   -- Batata Frita
(1, 4, 1, 4.50);   -- Coca-Cola

-- Pedido 2 - Misto Quente + Café
INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES 
('Maria Santos', 16.50, 'entregue', 'cartão');
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(2, 17, 1, 12.00), -- Misto Quente
(2, 25, 1, 4.50);  -- Café com Leite

-- Pedido 3 - Coxinha + Pastel + Guaraná
INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES 
('Pedro Costa', 17.50, 'entregue', 'pix');
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(3, 19, 2, 6.00),  -- 2x Coxinha
(3, 18, 1, 7.50),  -- Pastel de Queijo
(3, 20, 1, 4.00);  -- Guaraná

-- Pedido 4 - X-Salada + Suco
INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES 
('Ana Oliveira', 22.00, 'entregue', 'dinheiro');
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(4, 16, 1, 16.50), -- X-Salada
(4, 21, 1, 5.50);  -- Suco de Uva

-- Pedido 5 - Torta de Frango + Empada + Água
INSERT INTO pedidos (cliente_nome, valor_total, status, forma_pagamento) VALUES 
('Carlos Lima', 19.50, 'entregue', 'cartão');
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(5, 23, 1, 9.50),  -- Torta de Frango
(5, 24, 1, 8.00),  -- Empada de Palmito
(5, 10, 1, 2.00);  -- Água Mineral

-- Exemplo de caixas fechados (histórico)
INSERT INTO caixa (usuario_id, valor_inicial, valor_atual, valor_final, status, data_abertura, data_fechamento, observacoes) VALUES
(1, 100.00, 206.90, 206.90, 'fechado', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', 'Caixa do dia anterior - Movimento normal'),
(2, 50.00, 156.90, 156.90, 'fechado', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', 'Funcionamento normal - Boa movimentação');

-- Exemplo de movimentações de caixa (baseadas nos pedidos inseridos)
INSERT INTO movimentacoes_caixa (caixa_id, tipo, valor, motivo, usuario_id, pedido_id, data_hora) VALUES
-- Movimentações do primeiro caixa
(1, 'venda', 31.40, 'Venda - X-Burger + Batata + Coca', 1, 1, NOW() - INTERVAL '2 days' + INTERVAL '2 hours'),
(1, 'venda', 16.50, 'Venda - Misto Quente + Café', 1, 2, NOW() - INTERVAL '2 days' + INTERVAL '3 hours'),
(1, 'venda', 17.50, 'Venda - Coxinha + Pastel + Guaraná', 1, 3, NOW() - INTERVAL '2 days' + INTERVAL '4 hours'),
(1, 'sangria', 20.00, 'Retirada para troco', 1, NULL, NOW() - INTERVAL '2 days' + INTERVAL '5 hours'),
(1, 'venda', 22.00, 'Venda - X-Salada + Suco', 1, 4, NOW() - INTERVAL '2 days' + INTERVAL '6 hours'),
(1, 'venda', 19.50, 'Venda - Torta + Empada + Água', 1, 5, NOW() - INTERVAL '2 days' + INTERVAL '7 hours'),

-- Movimentações do segundo caixa
(2, 'suprimento', 30.00, 'Suprimento inicial para troco', 2, NULL, NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
(2, 'venda', 45.50, 'Vendas diversas manhã', 2, NULL, NOW() - INTERVAL '1 day' + INTERVAL '4 hours'),
(2, 'venda', 31.40, 'Vendas diversas tarde', 2, NULL, NOW() - INTERVAL '1 day' + INTERVAL '6 hours');


-- Parte 6: Verificação Final

SELECT 'Script executado com sucesso!' as status;

-- Mostrar contagem de registros em tabelas chave
SELECT
  (SELECT COUNT(*) FROM usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM produtos) as total_produtos,
  (SELECT COUNT(*) FROM pedidos) as total_pedidos,
  (SELECT COUNT(*) FROM itens_pedido) as total_itens_pedido,
  (SELECT COUNT(*) FROM caixa) as total_caixas,
  (SELECT COUNT(*) FROM movimentacoes_caixa) as total_movimentacoes,
  (SELECT COUNT(*) FROM logs_estoque) as total_logs_estoque;
-- Part
e 7: Configurações Adicionais e Otimizações

-- Configurar sequências para IDs (caso necessário)
SELECT setval('usuarios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM usuarios));
SELECT setval('produtos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM produtos));
SELECT setval('pedidos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pedidos));
SELECT setval('caixa_id_seq', (SELECT COALESCE(MAX(id), 1) FROM caixa));

-- Criar view para relatórios de vendas
CREATE OR REPLACE VIEW vw_vendas_detalhadas AS
SELECT 
    p.id as pedido_id,
    p.cliente_nome,
    p.valor_total,
    p.status,
    p.forma_pagamento,
    p.desconto,
    p.data_pedido,
    ip.produto_id,
    pr.nome as produto_nome,
    pr.categoria,
    ip.quantidade,
    ip.preco_unitario,
    (ip.quantidade * ip.preco_unitario) as subtotal
FROM pedidos p
JOIN itens_pedido ip ON p.id = ip.pedido_id
JOIN produtos pr ON ip.produto_id = pr.id;

-- Criar view para resumo de caixas
CREATE OR REPLACE VIEW vw_resumo_caixas AS
SELECT 
    c.id,
    c.data_abertura,
    c.data_fechamento,
    c.valor_inicial,
    c.valor_final,
    c.status,
    u.nome as usuario_nome,
    COALESCE(SUM(CASE WHEN m.tipo = 'venda' THEN m.valor ELSE 0 END), 0) as total_vendas,
    COALESCE(SUM(CASE WHEN m.tipo = 'sangria' THEN m.valor ELSE 0 END), 0) as total_sangrias,
    COALESCE(SUM(CASE WHEN m.tipo = 'suprimento' THEN m.valor ELSE 0 END), 0) as total_suprimentos,
    COUNT(CASE WHEN m.tipo = 'venda' THEN 1 END) as qtd_vendas
FROM caixa c
LEFT JOIN usuarios u ON c.usuario_id = u.id
LEFT JOIN movimentacoes_caixa m ON c.id = m.caixa_id
GROUP BY c.id, c.data_abertura, c.data_fechamento, c.valor_inicial, c.valor_final, c.status, u.nome;

-- Função para backup automático de logs (opcional)
CREATE OR REPLACE FUNCTION limpar_logs_antigos()
RETURNS void AS $$
BEGIN
    -- Remove logs de estoque com mais de 6 meses
    DELETE FROM logs_estoque 
    WHERE data_hora < NOW() - INTERVAL '6 months';
    
    RAISE NOTICE 'Logs antigos removidos com sucesso';
END;
$$ LANGUAGE plpgsql;

-- Comentários finais
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema com controle de acesso';
COMMENT ON TABLE produtos IS 'Catálogo de produtos com controle de estoque';
COMMENT ON TABLE pedidos IS 'Registro de todos os pedidos realizados';
COMMENT ON TABLE itens_pedido IS 'Itens detalhados de cada pedido';
COMMENT ON TABLE caixa IS 'Controle de abertura e fechamento de caixas';
COMMENT ON TABLE movimentacoes_caixa IS 'Histórico de todas as movimentações financeiras';
COMMENT ON TABLE logs_estoque IS 'Log de alterações no estoque para auditoria';