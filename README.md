# 🍔 Sistema de Gestão para Lanchonete

Sistema **completo de gestão para lanchonetes** com arquitetura full-stack, interface moderna, dashboard interativo com gráficos, sistema de notificações personalizadas, múltiplos temas dinâmicos, e API REST robusta com PostgreSQL.

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white)

</div>

---

## 🌟 Funcionalidades Implementadas

### 🚀 **Backend Completo (Node.js + PostgreSQL)**
✅ **API REST** com Express.js e rotas organizadas
✅ **Banco PostgreSQL** com triggers automáticos e logs
✅ **Autenticação JWT** com bcrypt para senhas
✅ **CORS habilitado** para integração frontend/backend
✅ **Middleware de validação** e tratamento de erros
✅ **Scripts de inicialização** do banco de dados

### 📊 **Dashboard Interativo**
✅ **Gráficos dinâmicos** com Chart.js (8 tipos diferentes)
✅ **Estatísticas em tempo real** (produtos, pedidos, receita)
✅ **Filtros por período** (7, 15, 30 dias)
✅ **Produtos com estoque baixo** em tempo real
✅ **Análise de tendências** e produtos mais vendidos
✅ **Gráficos responsivos** que se adaptam ao tema

### 📦 **Gestão de Estoque Avançada**
✅ **CRUD completo** via API REST
✅ **Filtros em tempo real** por nome e categoria
✅ **Alertas automáticos** de estoque baixo
✅ **Logs automáticos** de todas as operações
✅ **Validação de dados** no frontend e backend
✅ **Interface responsiva** e intuitiva

### 📋 **Sistema de Pedidos Completo**
✅ **Gestão completa** de pedidos via API
✅ **Status dinâmicos** (Pendente, Preparando, Pronto, Entregue)
✅ **Histórico detalhado** com filtros
✅ **Cálculo automático** de valores totais
✅ **Integração com estoque** para controle de disponibilidade

### 🎨 **Sistema de Temas Múltiplos**
✅ **5 temas disponíveis**: Claro, Escuro, Pastel, Pastel Verde, Pastel Laranja
✅ **Aplicação instantânea** sem reload da página
✅ **Persistência** da preferência do usuário
✅ **Detecção automática** da preferência do sistema
✅ **Gráficos adaptativos** que mudam com o tema

### 🔔 **Sistema de Notificações Avançado**
✅ **NotificationSystem class** com animações CSS modernas
✅ **4 tipos**: Sucesso, erro, aviso, informação
✅ **Auto-dismiss** configurável (4-6 segundos)
✅ **Tema responsivo** que se adapta automaticamente
✅ **Limite de notificações** simultâneas (máx. 5)
✅ **Substituição completa** dos alerts nativos

### 👤 **Sistema de Usuários**
✅ **Autenticação segura** com JWT e bcrypt
✅ **Níveis de acesso** (admin, funcionário)
✅ **Perfil editável** com dados pessoais
✅ **Controle de sessão** com logout automático
✅ **Validação de email** único no cadastro

### 🔧 **Recursos Técnicos**
✅ **Triggers PostgreSQL** para logs automáticos
✅ **Conexão pooling** para performance
✅ **Middleware de CORS** configurado
✅ **Variáveis de ambiente** (.env)
✅ **Scripts NPM** para desenvolvimento e produção
✅ **Teste de APIs** automatizado

---

## 🛠️ Stack Tecnológica

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

### Recursos Especiais
![Notificações](https://img.shields.io/badge/Sistema_de-Notificações-FF6B6B?style=for-the-badge)
![Temas Múltiplos](https://img.shields.io/badge/Temas-Múltiplos-9B59B6?style=for-the-badge)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-00BCD4?style=for-the-badge)
![Dashboard](https://img.shields.io/badge/Dashboard-Interativo-4CAF50?style=for-the-badge)

---

## 📁 Estrutura do Projeto

```
lanchonete-estoque-system/
├── backend/                    # 🚀 Backend Node.js + Express
│   ├── config/
│   │   └── database.js         # Configuração PostgreSQL
│   ├── routes/
│   │   ├── produtos.js         # API de produtos/estoque
│   │   ├── pedidos.js          # API de pedidos
│   │   ├── usuarios.js         # API de usuários/auth
│   │   └── dashboard.js        # API do dashboard
│   ├── scripts/
│   │   ├── init-db.js          # Inicialização do banco
│   │   └── update-db.js        # Atualizações do banco
│   ├── .env.example            # Exemplo de variáveis de ambiente
│   ├── .env                    # Variáveis de ambiente (não versionado)
│   ├── package.json            # Dependências do backend
│   ├── server.js               # Servidor principal
│   └── README.md               # Documentação do backend
├── database/
│   └── lanchonete_db.sql       # 🗄️ Schema PostgreSQL completo
├── js/                         # 📱 JavaScript Frontend
│   ├── auth-check.js           # Verificação de autenticação
│   ├── cadastro-estoque.js     # Lógica do estoque
│   ├── configuracoes.js        # Configurações e temas
│   ├── dashboard.js            # Dashboard com gráficos
│   ├── login.js                # Sistema de login
│   ├── notifications.js        # Sistema de notificações
│   ├── pedidos.js              # Gestão de pedidos
│   ├── perfil.js               # Gestão do perfil
│   └── theme.js                # Controle de temas múltiplos
├── public/                     # 🌐 Páginas HTML
│   ├── configuracoes.html      # Configurações e temas
│   ├── dashboard.html          # Dashboard interativo
│   ├── estoque.html            # Gestão de estoque
│   ├── pedidos.html            # Gestão de pedidos
│   └── perfil-usuario.html     # Perfil do usuário
├── style/                      # 🎨 Estilos CSS
│   ├── configuracoes.css       # Estilos de configurações
│   ├── dashboard.css           # Estilos do dashboard
│   ├── form-fixes.css          # Correções de formulários
│   ├── login.css               # Estilos de login
│   ├── notifications.css       # Estilos das notificações
│   ├── pedidos.css             # Estilos de pedidos
│   ├── perfil.css              # Estilos do perfil
│   ├── style.css               # Estilos globais
│   └── theme.css               # Temas múltiplos
├── src/                        # 🖼️ Recursos
│   ├── Blue and Beige Vintage Retro Illustration Sweet Pancake Badge Logo.png
│   └── sistema-example.png     # Screenshot do sistema
├── node_modules/               # Dependências (não versionado)
├── .gitignore                  # Arquivos ignorados pelo Git
├── index.html                  # 🏠 Página inicial com login
├── package.json                # Configuração do projeto
├── test-api.js                 # 🧪 Testes das APIs
└── README.md                   # 📖 Esta documentação
```

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### **1. Clonagem e Instalação**
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd lanchonete-estoque-system

# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
npm run install-backend
```

### **2. Configuração do Banco de Dados**
```bash
# Criar banco PostgreSQL
createdb lanchonete_db

# Configurar variáveis de ambiente
cd backend
cp .env.example .env
# Editar .env com suas configurações

# Inicializar banco com dados de exemplo
npm run init-db
```

### **3. Executar o Sistema**
```bash
# Iniciar backend (desenvolvimento)
npm run dev

# Ou iniciar backend (produção)
npm start

# Testar APIs
npm run test-api
```

### **4. Acessar o Sistema**
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/public/dashboard.html
- **API**: http://localhost:3000/api

---

## 🌐 Páginas e Funcionalidades

### **Páginas Disponíveis**
🏠 **Login** (`index.html`) - Autenticação com animação de fundo
📊 **Dashboard** (`public/dashboard.html`) - Gráficos interativos e estatísticas
📦 **Estoque** (`public/estoque.html`) - CRUD completo de produtos
📋 **Pedidos** (`public/pedidos.html`) - Gestão completa de pedidos
⚙️ **Configurações** (`public/configuracoes.html`) - Temas e configurações
👤 **Perfil** (`public/perfil-usuario.html`) - Dados do usuário

### **APIs REST Disponíveis**

#### 📦 **Produtos/Estoque**
```bash
GET    /api/produtos              # Listar produtos
POST   /api/produtos              # Criar produto
PUT    /api/produtos/:id          # Atualizar produto
DELETE /api/produtos/:id          # Excluir produto
GET    /api/produtos/estoque/baixo # Produtos com estoque baixo
```

#### 📋 **Pedidos**
```bash
GET    /api/pedidos               # Listar pedidos
POST   /api/pedidos               # Criar pedido
PUT    /api/pedidos/:id           # Atualizar pedido
DELETE /api/pedidos/:id           # Excluir pedido
```

#### 👤 **Usuários**
```bash
GET    /api/usuarios              # Listar usuários
POST   /api/usuarios              # Criar usuário
POST   /api/usuarios/login        # Login
PUT    /api/usuarios/:id          # Atualizar usuário
DELETE /api/usuarios/:id          # Excluir usuário
```

#### 📊 **Dashboard**
```bash
GET    /api/dashboard/stats                # Estatísticas gerais
GET    /api/dashboard/estoque-baixo        # Produtos com estoque baixo
GET    /api/dashboard/pedidos-recentes     # Pedidos recentes
GET    /api/dashboard/categorias           # Resumo por categoria
GET    /api/dashboard/produtos-vendidos    # Produtos mais vendidos
GET    /api/dashboard/resumo-receita       # Resumo de receita
```

### **Funcionalidades Principais**

#### 🎨 **Sistema de Temas Múltiplos**
```javascript
// 5 temas disponíveis
applyTheme('light');        // Tema claro
applyTheme('dark');         // Tema escuro
applyTheme('pastel');       // Tema pastel
applyTheme('pastel-green'); // Tema pastel verde
applyTheme('pastel-orange');// Tema pastel laranja
```

#### 🔔 **Sistema de Notificações Avançado**
```javascript
// Tipos de notificação disponíveis
NotificationSystem.success('Produto adicionado com sucesso!');
NotificationSystem.error('Erro ao salvar produto');
NotificationSystem.warning('Estoque baixo detectado');
NotificationSystem.info('Configurações atualizadas');

// Com opções personalizadas
NotificationSystem.show('Mensagem', 'success', {
  title: 'Título personalizado',
  duration: 6000,
  closable: true
});
```

#### 📊 **Dashboard Interativo**
- **8 tipos de gráficos** diferentes com Chart.js
- **Filtros por período** (7, 15, 30 dias)
- **Estatísticas em tempo real**
- **Gráficos adaptativos** ao tema
- **Dados simulados** quando API não disponível

---

## 🔧 Recursos Técnicos Avançados

### **Backend Robusto**
✅ **Arquitetura MVC** com rotas organizadas
✅ **Pool de conexões** PostgreSQL para performance
✅ **Triggers automáticos** para logs de estoque
✅ **Middleware de validação** e tratamento de erros
✅ **CORS configurado** para desenvolvimento e produção
✅ **Variáveis de ambiente** para configuração segura

### **Frontend Moderno**
✅ **Sistema de notificações** sem dependências externas
✅ **Gráficos interativos** com Chart.js responsivo
✅ **Temas múltiplos** com transições suaves
✅ **Interface responsiva** para desktop e mobile
✅ **Validação de formulários** em tempo real
✅ **Gerenciamento de estado** local com localStorage

### **Banco de Dados Inteligente**
✅ **Schema normalizado** com relacionamentos
✅ **Triggers PostgreSQL** para auditoria automática
✅ **Índices otimizados** para consultas rápidas
✅ **Dados de exemplo** para desenvolvimento
✅ **Scripts de migração** e atualização
✅ **Backup e restore** via SQL

### **Segurança e Performance**
✅ **Autenticação JWT** com expiração configurável
✅ **Senhas criptografadas** com bcrypt
✅ **Validação de entrada** no frontend e backend
✅ **Sanitização de dados** para prevenir SQL injection
✅ **Rate limiting** implícito via pool de conexões
✅ **Logs de auditoria** automáticos

---

## 🧪 Testes e Desenvolvimento

### **Scripts Disponíveis**
```bash
# Desenvolvimento
npm run dev                 # Inicia backend em modo desenvolvimento
npm run install-backend     # Instala dependências do backend
npm run init-db            # Inicializa banco com dados de exemplo
npm run setup              # Setup completo (install + init-db)

# Produção
npm start                  # Inicia backend em modo produção

# Testes
npm run test-api           # Testa todas as APIs automaticamente
node test-api.js           # Teste manual das APIs
```

### **Configuração de Desenvolvimento**
```env
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lanchonete_db
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_jwt_secret_super_seguro
PORT=3000
```

### **Dados de Teste**
- **Usuário Admin**: admin@lanchonete.com / admin123
- **14 produtos** de exemplo em diferentes categorias
- **5 pedidos** de exemplo com diferentes status
- **Logs de estoque** automáticos via triggers

---

## 🎯 Roadmap e Melhorias Futuras

### **Versão 2.0 (Planejado)**
🔵 **Upload de imagens** para produtos
🔵 **Relatórios em PDF** com gráficos
🔵 **Sistema de backup** automático
🔵 **Notificações push** em tempo real
🔵 **App mobile** com React Native
🔵 **Integração com impressoras** térmicas

### **Versão 2.1 (Planejado)**
🔵 **Multi-tenancy** para várias lanchonetes
🔵 **Sistema de delivery** integrado
🔵 **Pagamentos online** (PIX, cartão)
🔵 **Analytics avançados** com BI
🔵 **API pública** para integrações
🔵 **Modo offline** com sincronização

### **Melhorias Técnicas**
🔵 **Testes automatizados** (Jest, Cypress)
🔵 **Docker** para containerização
🔵 **CI/CD** com GitHub Actions
🔵 **Monitoramento** com logs estruturados
🔵 **Cache Redis** para performance
🔵 **WebSockets** para atualizações em tempo real

---

## 📸 Screenshots

### Dashboard Interativo
![Dashboard](src/sistema-example.png)

### Temas Múltiplos
- **Tema Claro**: Interface limpa e moderna
- **Tema Escuro**: Reduz fadiga visual
- **Temas Pastel**: Cores suaves e agradáveis

---

## 🤝 Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- **JavaScript**: ES6+ com async/await
- **CSS**: BEM methodology para classes
- **SQL**: Nomenclatura em português para tabelas
- **Commits**: Conventional Commits

### **Reportar Bugs**
Use as [Issues do GitHub](../../issues) para reportar bugs ou sugerir melhorias.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Sobre o Projeto

<div align="center">

**Desenvolvido com 💻 e ☕ para facilitar a gestão de lanchonetes**

Sistema focado em **usabilidade**, **performance** e **experiência do usuário**

---

### **Versão Atual**: 1.0.0 - Full Stack Completo
**Backend**: Node.js + Express + PostgreSQL  
**Frontend**: HTML5 + CSS3 + JavaScript + Chart.js  
**Recursos**: Dashboard interativo, temas múltiplos, notificações avançadas

---

⭐ **Se este projeto foi útil, considere dar uma estrela!** ⭐

</div>