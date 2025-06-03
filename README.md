# 📦 Sistema de Estoque para Lanchonete 🥪🍹

Este projeto é um **dashboard completo** para gerenciar o **estoque de uma lanchonete**, desenvolvido com **HTML, CSS, JavaScript, Node.js e MySQL**.  

## 🌟 Funcionalidades
✅ Visualizar todos os produtos em estoque  
✅ Adicionar novos produtos (nome, quantidade, categoria)  
✅ Excluir produtos do estoque  
✅ Contagem total de itens  
✅ Filtro por nome de produto  
✅ Backend com Node.js e MySQL  
✅ Conexão via API RESTful  

---

## 🔧 Tecnologias
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, MySQL2
- **Banco de dados**: MySQL
- **Requisições HTTP**: Fetch API
- **Controle de CORS**: Middleware `cors`

---

## 🚀 Instalação e Execução

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/YanFellippe/simple-stock-system.git
cd simple-stock-system
```

## 2️⃣ Instale as dependências
```bash
npm install
```

## 3️⃣ Configure o banco de dados
Crie um banco MySQL com o nome lanchonete_db.

Execute o script SQL:
```bash
CREATE DATABASE IF NOT EXISTS lanchonete_db;
USE lanchonete_db;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

INSERT INTO produtos (nome, quantidade, categoria) VALUES
('Pão', 50, 'Padaria'),
('Queijo', 30, 'Laticínios'),
('Presunto', 25, 'Frios'),
('Refrigerante', 100, 'Bebidas');
```

## 4️⃣ Configure a conexão MySQL no server.js
```bash
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Seu usuário
    password: '',        // Sua senha
    database: 'lanchonete_db'
});
```

## 5️⃣ Inicie o servidor
```bash
node server.js
```

## 6️⃣ Acesse no navegador
```bash
http://localhost:3000
```

