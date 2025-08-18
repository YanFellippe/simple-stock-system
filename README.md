# 📦 Sistema de Estoque para Lanchonete 🥪🍹

<div align="center">

![Logo](src/Blue%20and%20Beige%20Vintage%20Retro%20Illustration%20Sweet%20Pancake%20Badge%20Logo.png)

**Sistema completo de gerenciamento de estoque para lanchonetes**  
*Desenvolvido com Node.js, PostgreSQL e tecnologias web modernas*

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Sobre o Projeto

Este é um **sistema completo de gestão de estoque** desenvolvido especificamente para lanchonetes e pequenos estabelecimentos alimentícios. O sistema oferece controle total sobre produtos, pedidos, usuários e relatórios em tempo real.

### 🎯 Objetivo
Facilitar o gerenciamento diário de estoque, pedidos e operações de uma lanchonete através de uma interface web intuitiva e um backend robusto.

---

## ✨ Funcionalidades Principais

### 📦 **Gestão de Estoque**
- ✅ Visualizar todos os produtos em estoque
- ✅ Adicionar novos produtos (nome, quantidade, categoria)
- ✅ Editar informações de produtos existentes
- ✅ Excluir produtos do estoque
- ✅ Filtro avançado por nome de produto
- ✅ Alertas automáticos para estoque baixo
- ✅ Contagem total de itens em tempo real

### 📋 **Sistema de Pedidos**
- ✅ Criar novos pedidos de clientes
- ✅ Visualizar todos os pedidos
- ✅ Controle de status (pendente, preparando, pronto, entregue)
- ✅ Histórico completo de pedidos
- ✅ Exclusão de pedidos

### 📊 **Dashboard Inteligente**
- ✅ Estatísticas em tempo real
- ✅ Total de produtos cadastrados
- ✅ Total de pedidos realizados
- ✅ Produtos com estoque baixo
- ✅ Movimentações do dia
- ✅ Resumo por categorias

### 👥 **Sistema de Usuários**
- ✅ Autenticação segura com JWT
- ✅ Cadastro de novos usuários
- ✅ Níveis de acesso (admin/funcionário)
- ✅ Senhas criptografadas com bcrypt
- ✅ Controle de sessões

### 📈 **Logs e Auditoria**
- ✅ Registro automático de todas as operações
- ✅ Histórico de movimentações de estoque
- ✅ Triggers automáticos no banco de dados
- ✅ Rastreabilidade completa

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização responsiva
- **JavaScript (ES6+)** - Interatividade e requisições
- **Fetch API** - Comunicação com backend

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação de usuários
- **bcrypt** - Criptografia de senhas
- **CORS** - Controle de acesso

### **Banco de Dados**
- **PostgreSQL 12+** - Sistema de gerenciamento
- **Triggers** - Automação de logs
- **Constraints** - Validação de dados
- **Índices** - Otimização de consultas

---

## � Estsrutura do Projeto

```
lanchonete-estoque-system/
├── 🚀 backend/                    # Backend Node.js + PostgreSQL
│   ├── server.js                 # Servidor principal
│   ├── package.json              # Dependências do backend
│   ├── .env                      # Configurações (configure!)
│   ├── .env.example              # Exemplo de configuração
│   ├── config/
│   │   └── database.js           # Conexão PostgreSQL
│   ├── routes/
│   │   ├── produtos.js           # API de produtos
│   │   ├── pedidos.js            # API de pedidos
│   │   ├── usuarios.js           # API de usuários
│   │   └── dashboard.js          # API do dashboard
│   ├── scripts/
│   │   └── init-db.js            # Inicialização do banco
│   └── README.md                 # Documentação do backend
├── 🎨 Frontend/
│   ├── index.html                # Página principal (estoque)
│   ├── js/
│   │   ├── cadastro-estoque.js   # Lógica do estoque
│   │   ├── dashboard.js          # Lógica do dashboard
│   │   ├── pedidos.js            # Lógica dos pedidos
│   │   └── configuracoes.js      # Lógica das configurações
│   ├── public/
│   │   ├── dashboard.html        # Página do dashboard
│   │   ├── pedidos.html          # Página de pedidos
│   │   └── configuracoes.html    # Página de configurações
│   ├── style/
│   │   ├── style.css             # Estilos principais
│   │   ├── dashboard.css         # Estilos do dashboard
│   │   └── pedidos.css           # Estilos dos pedidos
│   └── src/
│       └── logo.png              # Logo da lanchonete
├── 🗄️ database/
│   └── lanchonete_db.sql         # Script completo do banco
├── 📚 Documentação/
│   ├── README.md                 # Este arquivo
│   ├── SETUP.md                  # Guia de instalação detalhado
│   ├── IMPLEMENTACAO.md          # Detalhes da implementação
│   └── INICIO-RAPIDO.md          # Guia de início rápido
├── package.json                  # Scripts principais do projeto
└── test-api.js                   # Script de teste das APIs
```

---

## 🚀 Instalação e Configuração

### 📋 **Pré-requisitos**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://postgresql.org/))
- **npm** ou **yarn**

### ⚡ **Instalação Rápida**

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

1. **Configurar PostgreSQL:**
```sql
-- Criar banco de dados
CREATE DATABASE lanchonete_db;

-- Criar usuário (opcional)
CREATE USER lanchonete_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE lanchonete_db TO lanchonete_user;
```

2. **Configurar variáveis de ambiente:**
```bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Edite com suas configurações
nano backend/.env
```

3. **Arquivo backend/.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lanchonete_db
DB_USER=postgres
DB_PASSWORD=sua_senha_postgresql
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
PORT=3000
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
# Testar APIs
npm run test-api

# Testar conexão com banco
npm run init-db

# Verificar logs do servidor
npm run dev
```

---

## 📈 Melhorias Futuras

- [ ] **Dashboard avançado** com gráficos
- [ ] **Relatórios em PDF**
- [ ] **Sistema de notificações**
- [ ] **App mobile** com React Native
- [ ] **Integração com impressoras**
- [ ] **Backup automático**
- [ ] **Multi-tenancy**
- [ ] **API de pagamentos**

---

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Yan Fellippe**
- GitHub: [@YanFellippe](https://github.com/YanFellippe)
- LinkedIn: [Yan Fellippe](https://linkedin.com/in/yanfellippe)

---

## 📞 Suporte

Encontrou algum problema? Precisa de ajuda?

1. **Verifique** a documentação em `SETUP.md`
2. **Consulte** os logs do servidor
3. **Abra** uma issue no GitHub
4. **Entre em contato** através do LinkedIn

---

## 🙏 Agradecimentos

- **PostgreSQL** pela robustez do banco de dados
- **Node.js** pela versatilidade do runtime
- **Express.js** pela simplicidade do framework
- **Comunidade open source** pelo suporte

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

*Desenvolvido para facilitar a gestão de lanchonetes*

</div>