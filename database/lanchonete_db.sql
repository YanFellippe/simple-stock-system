-- 2. Tabela de produtos (estoque)
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- 3. Tabela de usuários (login opcional)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso TEXT DEFAULT 'funcionario' CHECK (nivel_acesso IN ('admin', 'funcionario'))
);

-- 4. Tabela de logs de alterações no estoque
CREATE TABLE logs_estoque (
    id SERIAL PRIMARY KEY,
    produto_id INT NOT NULL,
    acao TEXT NOT NULL CHECK (acao IN ('adicionado', 'removido', 'atualizado')),
    quantidade INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- 5. Dados iniciais de produtos
INSERT INTO produtos (nome, quantidade, categoria) VALUES
('Pão', 50, 'Padaria'),
('Queijo', 30, 'Laticínios'),
('Presunto', 25, 'Frios'),
('Refrigerante', 100, 'Bebidas');

-- Usuário administrador para login (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('Administrador', 'admin@lanchonete.com', '$2b$10$abcdefg12345678901234abcdefghijklmnopqrstuv', 'admin');

-- Visualizar produtos
SELECT * FROM produtos;

INSERT INTO produtos (nome, quantidade, categoria) VALUES
('Café', 80, 'Bebidas'),
('Leite', 40, 'Laticínios'),
('Manteiga', 20, 'Laticínios'),
('Hambúrguer', 35, 'Carnes'),
('Batata Frita', 60, 'Congelados'),
('Água Mineral', 120, 'Bebidas'),
('Suco de Laranja', 50, 'Bebidas'),
('Ketchup', 25, 'Condimentos'),
('Maionese', 20, 'Condimentos'),
('Alface', 15, 'Hortifruti');

INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('João da Silva', 'joao@lanchonete.com', '$2b$10$hashfalso1234567890abcdefghijk', 'funcionario'),
('Maria Oliveira', 'maria@lanchonete.com', '$2b$10$hashfalso2234567890abcdefghijk', 'funcionario'),
('Carlos Souza', 'carlos@lanchonete.com', '$2b$10$hashfalso3234567890abcdefghijk', 'admin');

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
