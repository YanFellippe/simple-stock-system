// Script simples para testar as APIs
const baseURL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testando APIs do sistema...\n');

    try {
        // Testar produtos
        console.log('📦 Testando API de produtos...');
        const produtosResponse = await fetch(`${baseURL}/produtos`);
        const produtos = await produtosResponse.json();
        console.log(`✅ ${produtos.length} produtos encontrados`);

        // Testar pedidos
        console.log('📋 Testando API de pedidos...');
        const pedidosResponse = await fetch(`${baseURL}/pedidos`);
        const pedidos = await pedidosResponse.json();
        console.log(`✅ ${pedidos.length} pedidos encontrados`);

        // Testar dashboard
        console.log('📊 Testando API do dashboard...');
        const statsResponse = await fetch(`${baseURL}/dashboard/stats`);
        const stats = await statsResponse.json();
        console.log(`✅ Dashboard: ${stats.totalProdutos} produtos, ${stats.totalPedidos} pedidos`);

        console.log('\n🎉 Todas as APIs estão funcionando!');

    } catch (error) {
        console.error('❌ Erro ao testar APIs:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando em http://localhost:3000');
    }
}

// Executar apenas se Node.js estiver disponível
if (typeof window === 'undefined') {
    // Ambiente Node.js
    try {
        const fetch = require('node-fetch');
        testAPI();
    } catch (error) {
        console.log('💡 Para usar este script, instale node-fetch: npm install node-fetch');
        console.log('💡 Ou execute: npm run test-api');
    }
} else {
    // Ambiente browser
    console.log('Execute este script no Node.js: node test-api.js');
}