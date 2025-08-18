# 🚀 Backend - Sistema de Estoque Lanchonete

## 📋 Sobre
Backend em Node.js com Express e PostgreSQL para o sistema de estoque da lanchonete.

## 🔧 Tecnologias
- **Node.js** + Express
- **PostgreSQL** com triggers
- **JWT** para autenticação
- **bcrypt** para criptografia
- **CORS** habilitado

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Inicializar banco de dados
npm run init-db

# Iniciar servidor
npm run dev
```

## 🌐 APIs Disponíveis

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `DELETE /api/pedidos/:id` - Excluir pedido

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/estoque-baixo` - Produtos com estoque baixo
- `GET /api/dashboard/pedidos-recentes` - Pedidos recentes

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `POST /api/usuarios/login` - Login
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Excluir usuário

## ⚙️ Configuração

### Variáveis de Ambiente (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lanchonete_db
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_jwt_secret
PORT=3000
```

## 🗄️ Banco de Dados
- **PostgreSQL** com 4 tabelas principais
- **Triggers automáticos** para logs
- **Script de inicialização** incluído

## 🔐 Autenticação
- **JWT tokens** com expiração de 24h
- **Senhas criptografadas** com bcrypt
- **Níveis de acesso**: admin, funcionario

## 📊 Logs Automáticos
O sistema registra automaticamente:
- Produtos adicionados/atualizados/removidos
- Data e hora das operações
- Usuário responsável (quando implementado)

## 🚀 Scripts Disponíveis
- `npm start` - Iniciar em produção
- `npm run dev` - Iniciar em desenvolvimento
- `npm run init-db` - Inicializar banco de dados