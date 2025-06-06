-- 1. Criar o banco de dados
CREATE DATABASE IF NOT EXISTS lanchonete_db;
USE lanchonete_db;

-- 2. Tabela de produtos (estoque)
DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- 3. Tabela de usuários (login opcional)
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('admin', 'funcionario') DEFAULT 'funcionario'
);

-- 4. Tabela de logs de alterações no estoque
DROP TABLE IF EXISTS logs_estoque;
CREATE TABLE logs_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    acao ENUM('adicionado', 'removido', 'atualizado') NOT NULL,
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

-- 6. (Opcional) Usuário administrador para login (senha: admin123)
-- Para gerar senha_hash use bcrypt no Node.js ou PHP
-- Exemplo com bcrypt (node):
-- bcrypt.hashSync("admin123", 10);
-- Digamos que gerou: $2b$10$abcdef...

INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES
('Administrador', 'admin@lanchonete.com', '$2b$10$abcdefg12345678901234abcdefghijklmnopqrstuv', 'admin');

-- 7. Verificar conteúdo da tabela produtos
SELECT * FROM produtos;