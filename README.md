# 🍔 Sistema de Gestão para Lanchonete

Sistema completo de **gestão para lanchonetes** com interface moderna, sistema de notificações personalizadas, tema escuro/claro dinâmico, e funcionalidades essenciais para controle de estoque, pedidos e configurações do usuário.

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/YanFellippe/simple-stock-system?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/YanFellippe/simple-stock-system?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/YanFellippe/simple-stock-system?style=flat-square)

</div>

---

## 🌟 Funcionalidades Implementadas

### 📦 **Gestão de Estoque**
✅ Listagem completa de produtos com filtro em tempo real
✅ Adição de novos itens (nome, quantidade, categoria, preço)
✅ Exclusão de produtos com confirmação
✅ Alertas de estoque baixo com notificações personalizadas
✅ Interface responsiva e intuitiva

### 📋 **Sistema de Pedidos**
✅ Criação de pedidos com interface moderna
✅ Controle de status (Pendente, Em preparo, Pronto, Entregue)
✅ Histórico completo de pedidos
✅ Integração automática com controle de estoque

### ⚙️ **Configurações Avançadas**
✅ **Tema dinâmico**: Alternância suave entre modo claro e escuro
✅ **Aplicação imediata**: Tema aplicado instantaneamente sem reload
✅ Configurações da lanchonete (nome, endereço, telefone)
✅ Configurações de estoque e alertas
✅ Sistema de backup e restauração
✅ Relatórios de vendas e produtos

### 🔔 **Sistema de Notificações Personalizado**
✅ **NotificationSystem class** com animações CSS modernas
✅ **Tipos variados**: Sucesso, erro, aviso, informação
✅ **Auto-dismiss**: Desaparecem automaticamente após 5 segundos
✅ **Tema responsivo**: Adapta-se automaticamente ao tema ativo
✅ **Substituição completa**: Eliminou todos os alerts nativos do navegador

### 👤 **Gestão de Usuário**
✅ Perfil do usuário com edição de dados pessoais
✅ Sistema de autenticação seguro
✅ Controle de sessão com logout automático

### 🎨 **Interface e UX**
✅ **Correções de tema**: Sidebar sempre visível durante mudanças
✅ **Estilos otimizados**: Botões com ícones corrigidos no tema escuro
✅ **Layout responsivo**: Conteúdo ajustado para não sobrepor sidebar
✅ **Formulários melhorados**: Checkboxes e inputs com estilos consistentes

---

## 🛠️ Stack Tecnológica

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Recursos Especiais
![Notificações](https://img.shields.io/badge/Sistema_de-Notificações-FF6B6B?style=for-the-badge)
![Tema Dinâmico](https://img.shields.io/badge/Tema-Dinâmico-9B59B6?style=for-the-badge)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-00BCD4?style=for-the-badge)

---

## 📁 Estrutura do Projeto

```
simple-stock-system/
├── js/
│   ├── cadastro-estoque.js     # Lógica do estoque
│   ├── configuracoes.js        # Configurações com tema dinâmico
│   ├── dashboard.js            # Dashboard principal
│   ├── pedidos.js              # Gestão de pedidos
│   ├── perfil.js               # Gestão do perfil
│   ├── login.js                # Sistema de login
│   ├── theme.js                # Controle de temas
│   └── notifications.js        # Sistema de notificações
├── public/
│   ├── configuracoes.html      # Página de configurações
│   ├── dashboard.html          # Dashboard principal
│   ├── estoque.html            # Gestão de estoque
│   ├── perfil-usuario.html     # Perfil do usuário
│   └── pedidos.html            # Gestão de pedidos
├── style/
│   ├── style.css               # Estilos globais
│   ├── configuracoes.css       # Estilos de configurações
│   ├── dashboard.css           # Estilos do dashboard
│   ├── pedidos.css             # Estilos de pedidos
│   ├── perfil.css              # Estilos do perfil
│   ├── login.css               # Estilos de login
│   ├── theme.css               # Estilos de tema
│   ├── form-fixes.css          # Correções de formulários
│   └── notifications.css       # Estilos das notificações
├── src/
│   └── logo.png                # Logo da lanchonete
├── index.html                  # Página inicial
└── README.md                   # Documentação
```

---

## 🚀 Como Usar

### **Páginas Disponíveis**
🏠 **Página Principal**: `index.html` - Sistema de login
📊 **Dashboard**: `public/dashboard.html` - Visão geral do sistema
📦 **Estoque**: `public/estoque.html` - Gestão de produtos
📋 **Pedidos**: `public/pedidos.html` - Controle de pedidos
⚙️ **Configurações**: `public/configuracoes.html` - Configurações e tema
👤 **Perfil**: `public/perfil-usuario.html` - Dados do usuário

### **Funcionalidades Principais**

#### 🎨 **Sistema de Temas**
Alternância entre modo claro e escuro
Aplicação imediata sem necessidade de reload
Persistência da preferência do usuário
Estilos otimizados para ambos os temas

#### 🔔 **Sistema de Notificações**
```javascript
// Exemplos de uso das notificações
NotificationSystem.success('Produto adicionado com sucesso!');
NotificationSystem.error('Erro ao salvar produto');
NotificationSystem.warning('Estoque baixo detectado');
NotificationSystem.info('Configurações atualizadas');
```

#### 📦 **Gestão de Estoque**
Filtro em tempo real por nome do produto
Alertas automáticos para estoque baixo
Interface intuitiva para adição/remoção
Validação de dados integrada

---

## 🔧 Melhorias Implementadas

### **Correções de Interface**
✅ **Sidebar sempre visível**: Corrigido problema de invisibilidade durante troca de tema
✅ **Ícones otimizados**: Removido fundo verde indesejado dos ícones no tema escuro
✅ **Layout responsivo**: Ajustado margin-left para evitar sobreposição de conteúdo
✅ **Formulários consistentes**: Corrigidos checkboxes duplicados e estilos conflitantes

### **Sistema de Notificações**
✅ **Substituição completa**: Eliminados todos os `alert()` nativos
✅ **Design moderno**: Animações suaves de entrada e saída
✅ **Tipos diferenciados**: Cores e ícones específicos para cada tipo
✅ **Responsividade**: Adapta-se automaticamente ao tema ativo

### **Otimização de Código**
✅ **Limpeza de arquivos**: Removidos arquivos não utilizados
✅ **Código organizado**: Separação clara de responsabilidades
✅ **Performance melhorada**: Aplicação imediata de temas

---

## 🎯 Próximas Funcionalidades

🔵 Backend com Node.js e PostgreSQL
🔵 Sistema de autenticação JWT
🔵 API REST completa
🔵 Relatórios avançados com gráficos
🔵 Upload de imagens para produtos
🔵 Sistema de backup automático

---

## 👨‍💻 Desenvolvedor

<p>Desenvolvido com 💻 e ☕ para facilitar a gestão de lanchonetes</p>
<p>Sistema focado em usabilidade, performance e experiência do usuário</p>

---

**Versão atual**: Frontend completo com sistema de notificações e temas dinâmicos