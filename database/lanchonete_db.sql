-- Criação do banco
CREATE DATABASE IF NOT EXISTS lanchonete_db;
USE lanchonete_db;

-- Tabela de produtos (estoque)
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- (Opcional) Tabela de usuários (caso queira gerenciar login)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('admin', 'funcionario') DEFAULT 'funcionario'
);

-- (Opcional) Tabela de registros de ações (log de alterações no estoque)
CREATE TABLE logs_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    acao ENUM('adicionado', 'removido', 'atualizado') NOT NULL,
    quantidade INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Dados iniciais para produtos
INSERT INTO produtos (nome, quantidade, categoria) VALUES
('Pão', 50, 'Padaria'),
('Queijo', 30, 'Laticínios'),
('Presunto', 25, 'Frios'),
('Refrigerante', 100, 'Bebidas');


SELECT * FROM produtos;