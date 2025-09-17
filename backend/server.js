const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (pasta pai)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));
app.use('/style', express.static(path.join(frontendPath, 'style')));
app.use('/js', express.static(path.join(frontendPath, 'js')));
app.use('/src', express.static(path.join(frontendPath, 'src')));
app.use('/public', express.static(path.join(frontendPath, 'public')));

// Importar rotas
const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');
const dashboardRoutes = require('./routes/dashboard');
const caixaRoutes = require('./routes/caixa');

// Usar rotas
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/caixa', caixaRoutes);

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Rotas para compatibilidade com o frontend existente
app.get('/api/estoque', (req, res) => {
    res.redirect('/api/produtos');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/public/dashboard.html`);
    console.log(`📦 Estoque: http://localhost:${PORT}`);
    console.log(`📋 Pedidos: http://localhost:${PORT}/public/pedidos.html`);
});