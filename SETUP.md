# 🚀 Configuração do Sistema de Estoque - PostgreSQL

## 📋 Pré-requisitos

1. **Node.js** (versão 14 ou superior)
2. **PostgreSQL** (versão 12 ou superior)
3. **npm** ou **yarn**

## 🔧 Instalação

### 1. Instalar dependências
```bash
# Da raiz do projeto
npm run install-backend

# Ou manualmente
cd backend && npm install
```

### 2. Configurar PostgreSQL

#### Criar banco de dados:
```sql
CREATE DATABASE lanchonete_db;
```

#### Executar o script SQL:
```bash
# Manualmente
psql -U postgres -d lanchonete_db -f database/lanchonete_db.sql

# Ou usando o script automatizado
npm run init-db
```

### 3. Configurar variáveis de ambiente

Edite o arquivo `backend/.env` com suas configurações:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lanchonete_db
DB_USER=postgres
DB_PASSWORD=sua_senha_postgresql
JWT_SECRET=seu_jwt_secret_muito_seguro
PORT=3000
```

### 4. Iniciar o servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## 🌐 Acessar o sistema

- **Página Principal (Estoque)**: http://localhost:3000
- **Dashboard**: http://localhost:3000/public/dashboard.html
- **Pedidos**: http://localhost:3000/public/pedidos.html
- **Configurações**: http://localhost:3000/public/configuracoes.html

## 📊 APIs Disponíveis

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

## 🔐 Usuário Padrão

- **Email**: admin@lanchonete.com
- **Senha**: admin123

## 🛠️ Funcionalidades Implementadas

✅ **Backend completo com PostgreSQL**
✅ **CRUD de produtos**
✅ **CRUD de pedidos**
✅ **Sistema de usuários com autenticação**
✅ **Dashboard com estatísticas**
✅ **Logs automáticos de estoque**
✅ **API RESTful completa**
✅ **Frontend integrado com backend**

## 📝 Notas Importantes

1. **Segurança**: Altere o JWT_SECRET em produção
2. **Banco**: Configure corretamente as credenciais do PostgreSQL
3. **Logs**: O sistema registra automaticamente mudanças no estoque
4. **Triggers**: Implementados para auditoria automática

## 🐛 Solução de Problemas

### Erro de conexão com PostgreSQL:
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U postgres -d lanchonete_db`

### Porta já em uso:
- Altere a PORT no arquivo `.env`
- Ou mate o processo: `lsof -ti:3000 | xargs kill -9`

### Dependências:
```bash
npm install --force
```