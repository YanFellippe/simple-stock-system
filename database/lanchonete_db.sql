-- Database: lanchonete_db

-- DROP DATABASE IF EXISTS lanchonete_db;

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

-- 2. Tabela de produtos (estoque)
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

-- 3. Tabela de pedidos
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
);

-- 4. Tabela de usuários (login opcional)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso TEXT DEFAULT 'funcionario' CHECK (nivel_acesso IN ('admin', 'funcionario'))
);

-- 5. Tabela de logs de alterações no estoque
CREATE TABLE logs_estoque (
    id SERIAL PRIMARY KEY,
    produto_id INT NOT NULL,
    acao TEXT NOT NULL CHECK (acao IN ('adicionado', 'removido', 'atualizado')),
    quantidade INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- 5. Dados iniciais de produtos
INSERT INTO produtos (nome, quantidade, categoria, preco) VALUES
('Pão', 50, 'Padaria', 2.50),
('Queijo', 30, 'Laticínios', 8.90),
('Presunto', 25, 'Frios', 12.50),
('Refrigerante', 100, 'Bebidas', 4.50);

-- Usuário administrador para login (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('Administrador', 'admin@lanchonete.com', '$2b$10$abcdefg12345678901234abcdefghijklmnopqrstuv', 'admin');

-- Visualizar produtos
SELECT * FROM produtos;

INSERT INTO produtos (nome, quantidade, categoria, preco) VALUES
('Café', 80, 'Bebidas', 3.00),
('Leite', 40, 'Laticínios', 5.50),
('Manteiga', 20, 'Laticínios', 6.80),
('Hambúrguer', 35, 'Carnes', 15.90),
('Batata Frita', 60, 'Congelados', 8.50),
('Água Mineral', 120, 'Bebidas', 2.00),
('Suco de Laranja', 50, 'Bebidas', 6.50),
('Ketchup', 25, 'Condimentos', 4.20),
('Maionese', 20, 'Condimentos', 5.80),
('Alface', 15, 'Hortifruti', 3.50);

INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('João da Silva', 'joao@lanchonete.com', '$2b$10$hashfalso1234567890abcdefghijk', 'funcionario'),
('Maria Oliveira', 'maria@lanchonete.com', '$2b$10$hashfalso2234567890abcdefghijk', 'funcionario'),
('Carlos Souza', 'carlos@lanchonete.com', '$2b$10$hashfalso3234567890abcdefghijk', 'admin');

-- Dados iniciais de pedidos
INSERT INTO pedidos (cliente, produto_id, produto_nome, quantidade, preco_unitario, valor_total, status) VALUES
('João Silva', 9, 'Hambúrguer', 2, 15.90, 31.80, 'pendente'),
('Maria Santos', 4, 'Refrigerante', 3, 4.50, 13.50, 'preparando'),
('Pedro Costa', 1, 'Pão', 5, 2.50, 12.50, 'pronto'),
('Ana Oliveira', 5, 'Café', 1, 3.00, 3.00, 'entregue'),
('Carlos Lima', 10, 'Batata Frita', 2, 8.50, 17.00, 'pendente');

INSERT INTO logs_estoque (produto_id, acao, quantidade) VALUES
(1, 'adicionado', 20),
(2, 'removido', 10),
(3, 'atualizado', 5),
(4, 'adicionado', 15),
(5, 'removido', 8),
(1, 'atualizado', 5),
(2, 'adicionado', 12);

-- 1. Função de trigger
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
        VALUES (NEW.id, 'atualizado', NEW.quantidade);
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

-- 2. Criar trigger associada à tabela produtos
DROP TRIGGER IF EXISTS trigger_log_estoque ON produtos;

CREATE TRIGGER trigger_log_estoque
AFTER INSERT OR UPDATE OR DELETE ON produtos
FOR EACH ROW
EXECUTE FUNCTION registrar_log_estoque();

-- Seleção dos itens nas tabelas:
SELECT * FROM produtos;
SELECT * FROM pedidos;
SELECT * FROM usuarios;
SELECT * FROM logs_estoque;