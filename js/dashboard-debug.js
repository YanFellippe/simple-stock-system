// Versão de debug do dashboard
console.log("Dashboard debug carregado");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM carregado, iniciando dashboard...");
  
  try {
    // Testar se os elementos existem
    const totalProdutos = document.getElementById('totalProdutos');
    const totalPedidos = document.getElementById('totalPedidos');
    const baixoEstoque = document.getElementById('baixoEstoque');
    const movimentacoesHoje = document.getElementById('movimentacoesHoje');
    
    console.log("Elementos encontrados:", {
      totalProdutos: !!totalProdutos,
      totalPedidos: !!totalPedidos,
      baixoEstoque: !!baixoEstoque,
      movimentacoesHoje: !!movimentacoesHoje
    });
    
    // Testar API
    console.log("Testando API...");
    const response = await fetch('/api/dashboard/stats');
    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Dados recebidos:", data);
      
      // Atualizar cards manualmente
      if (totalProdutos) {
        const numberEl = totalProdutos.querySelector('.card-number');
        if (numberEl) {
          numberEl.textContent = data.totalProdutos;
          console.log("Total produtos atualizado:", data.totalProdutos);
        }
      }
      
      if (totalPedidos) {
        const numberEl = totalPedidos.querySelector('.card-number');
        if (numberEl) {
          numberEl.textContent = data.totalPedidos;
          console.log("Total pedidos atualizado:", data.totalPedidos);
        }
      }
      
      if (baixoEstoque) {
        const numberEl = baixoEstoque.querySelector('.card-number');
        if (numberEl) {
          numberEl.textContent = data.estoqueBaixo;
          console.log("Estoque baixo atualizado:", data.estoqueBaixo);
        }
      }
      
      if (movimentacoesHoje) {
        const numberEl = movimentacoesHoje.querySelector('.card-number');
        if (numberEl) {
          numberEl.textContent = data.movimentacoesHoje;
          console.log("Movimentações hoje atualizado:", data.movimentacoesHoje);
        }
      }
      
    } else {
      console.error("Erro na API:", response.status, response.statusText);
    }
    
  } catch (error) {
    console.error("Erro geral:", error);
  }
});