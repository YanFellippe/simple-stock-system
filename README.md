# 📦 Sistema de Estoque para Lanchonete 🥪🍹
<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/YanFellippe/simple-stock-system?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/YanFellippe/simple-stock-system?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/YanFellippe/simple-stock-system?style=flat-square)

</div>
Sistema completo para <strong>gestão de estoque de uma lanchonete</strong>, com painel visual moderno, backend robusto em <strong>Node.js + PostgreSQL</strong>, e funcionalidades essenciais para controle de produtos.

---

## 🌟 Funcionalidades Principais

| Funcionalidade               | Status | Descrição                                  |
|------------------------------|--------|--------------------------------------------|
| Listagem de produtos          | ✅     | Visualização completa do estoque           |
| Adição de novos itens         | ✅     | Nome, quantidade e categoria               |
| Exclusão de produtos          | ✅     | Remoção segura com confirmação             |
| Filtro em tempo real          | ✅     | Busca instantânea por nome                 |
| Resumo total de itens         | ✅     | Contagem automática                        |
| Registro automático de ações  | ✅     | Via triggers no PostgreSQL                 |
| Painel visual moderno         | ✅     | Com Lucide Icons                           |
| Páginas separadas             | ✅     | Dashboard, Pedidos e Configurações         |

---

## 🛠️ Stack Tecnológica

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

### Banco de Dados
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Triggers](https://img.shields.io/badge/PostgreSQL-Triggers-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### UI/UX
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-FF6B6B?style=for-the-badge&logo=react&logoColor=white)
![Responsivo](https://img.shields.io/badge/Responsivo-Design-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 📁 Estrutura do Projeto

```bash
simple-stock-system/
├── database/
│   └── lanchonete_db.sql       # Script completo do PostgreSQL
├── js/
│   ├── cadastro-estoque.js     # Lógica do estoque
│   ├── configuracoes.js        # Configurações do sistema
│   ├── dashboard.js            # Dashboard principal
│   ├── pedidos.js              # Gestão de pedidos
│   ├── perfil.js               # Gestão do perfil
│   ├── login.js                # Gestão do usuario
│   ├── theme.js                # Logica dos temas
│   └── server.js               # Servidor Express
├── public/
│   ├── configuracoes.html      # Página de configurações
│   ├── dashboard.html          # Dashboard principal
│   ├── estoque.html            # Dashboard de estoque dos produtos
│   ├── perfil-usuario.html     # Pagina do usuario
│   └── pedidos.html            # Página de pedidos
├── route/
│   ├── pedidos.js              # API de pedidos
│   └── usuario.js              # Rotas de usuário (WIP)
├── src/
│   ├── logo.png                # Logo da lanchonete
│   └── sistema-example.png     # Screenshot do sistema
├── style/
│   ├── dashboard.css           # Estilo da dashboard
│   ├── pedidos.css             # Estilo de pedidos
│   ├── style.css               # Estilos globais
│   ├── configuracoes.css       # Estilos de configurações
│   ├── perfil.css              # Estilos do perfil
│   ├── theme.css               # Estilos para alterar tema (LIGHT/DARK)
│   └── login.css               # Estilo da Index
├── index.html                  # Página inicial
└── README.md                   # Documentação

```

## 🚀 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/YanFellippe/simple-stock-system.git
cd simple-stock-system

# 2. Instale as dependências
npm run install-backend

# 3. Configure o banco PostgreSQL
createdb lanchonete_db

# 4. Configure as variáveis de ambiente
# Edite backend/.env com suas configurações

# 5. Inicialize o banco de dados
npm run init-db

# 6. Inicie o servidor
npm run dev
```

### ⚙️ **Configuração Detalhada**

npm install pg

```

2. **Configurar variáveis de ambiente:**
```bash
CREATE DATABASE lanchonete_db;
\c lanchonete_db;

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  quantidade INT NOT NULL,
  categoria VARCHAR(50) NOT NULL
);

CREATE TABLE logs_estoque (
  id SERIAL PRIMARY KEY,
  produto_id INT NOT NULL,
  acao TEXT NOT NULL CHECK (acao IN ('adicionado', 'removido', 'atualizado')),
  quantidade INT NOT NULL,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Trigger para registrar automaticamente as ações
-- Consulte o arquivo SQL para detalhes completos

-- Dados de exemplo
INSERT INTO produtos (nome, quantidade, categoria) VALUES
('Pão', 50, 'Padaria'),
('Queijo', 30, 'Laticínios'),
('Refrigerante', 100, 'Bebidas');
```

## 4️⃣ Configure a conexão PostgreeSQL no server.js
```bash
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lanchonete_db',
  password: 'SUA_SENHA_AQUI',
  port: 5432,
});

```

---

## 🌐 Como Usar

### **Acessar o Sistema**
- 🏠 **Página Principal (Estoque)**: http://localhost:3000
- 📊 **Dashboard**: http://localhost:3000/public/dashboard.html
- 📋 **Pedidos**: http://localhost:3000/public/pedidos.html
- ⚙️ **Configurações**: http://localhost:3000/public/configuracoes.html

### **Credenciais Padrão**
- 📧 **Email**: admin@lanchonete.com
- 🔑 **Senha**: admin123

### **Scripts Disponíveis**
```bash
npm start              # Iniciar em produção
npm run dev            # Iniciar em desenvolvimento
npm run install-backend # Instalar dependências do backend
npm run init-db        # Inicializar/resetar banco de dados
npm run test-api       # Testar APIs
```

---

## 📊 APIs Disponíveis

### **Produtos** (`/api/produtos`)
```http
GET    /api/produtos           # Listar todos os produtos
GET    /api/produtos/:id       # Buscar produto específico
POST   /api/produtos           # Criar novo produto
PUT    /api/produtos/:id       # Atualizar produto
DELETE /api/produtos/:id       # Excluir produto
GET    /api/produtos/estoque/baixo # Produtos com estoque baixo
```

### **Pedidos** (`/api/pedidos`)
```http
GET    /api/pedidos            # Listar todos os pedidos
GET    /api/pedidos/:id        # Buscar pedido específico
POST   /api/pedidos            # Criar novo pedido
PUT    /api/pedidos/:id        # Atualizar pedido
DELETE /api/pedidos/:id        # Excluir pedido
GET    /api/pedidos/status/:status # Pedidos por status
```

### **Dashboard** (`/api/dashboard`)
```http
GET    /api/dashboard/stats           # Estatísticas gerais
GET    /api/dashboard/estoque-baixo   # Produtos com estoque baixo
GET    /api/dashboard/pedidos-recentes # Últimos pedidos
GET    /api/dashboard/logs-estoque    # Histórico de movimentações
GET    /api/dashboard/categorias      # Resumo por categoria
```

### **Usuários** (`/api/usuarios`)
```http
GET    /api/usuarios           # Listar usuários
POST   /api/usuarios           # Criar novo usuário
POST   /api/usuarios/login     # Autenticação
PUT    /api/usuarios/:id       # Atualizar usuário
DELETE /api/usuarios/:id       # Excluir usuário
```

---

## 🗄️ Banco de Dados

### **Tabelas Principais**
- **`produtos`** - Gerenciamento de estoque
- **`pedidos`** - Sistema de pedidos
- **`usuarios`** - Autenticação e controle de acesso
- **`logs_estoque`** - Auditoria automática

### **Recursos Avançados**
- ✅ **Triggers automáticos** para logs
- ✅ **Constraints** para validação
- ✅ **Índices** para performance
- ✅ **Relacionamentos** bem definidos

---

## 🔒 Segurança

- 🔐 **Senhas criptografadas** com bcrypt (salt rounds: 10)
- 🎫 **JWT tokens** com expiração de 24h
- 🛡️ **Validação de dados** no backend
- 🚫 **Sanitização** de inputs
- 🔑 **Controle de acesso** por níveis (admin/funcionário)
- 🌐 **CORS** configurado adequadamente

---

## 🧪 Testes

```bash
http://localhost:3000
```

### 🖼️ Preview
![Dashboard Estoque](./src/sistema-example.png)

### 🛠️ Funcionalidades futuras

- 🔵 Login e autenticação de usuários
- 🔵 Histórico detalhado de alterações
- 🔵 Upload de imagem por produto
- 🔵 Edição inline dos campos
- 🔵 Dashboard com gráficos (por categoria, movimentações)


### 👨‍💻 Desenvolvedor
<p>Feito com 💻 por Yan Fellippe — Desenvolvedor Fullstack</p>
<p>Sinta-se à vontade para sugerir melhorias ou abrir issues! 🚀</p>
