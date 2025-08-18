document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Buscar estatísticas do dashboard
    const response = await fetch("/api/dashboard/stats");
    const stats = await response.json();

    // Atualizar elementos do dashboard
    document.getElementById("totalProdutos").textContent = `Total de Produtos: ${stats.totalProdutos}`;
    document.getElementById("totalPedidos").textContent = `Total de Pedidos: ${stats.totalPedidos}`;
    document.getElementById("baixoEstoque").textContent = `Itens com Estoque Baixo: ${stats.estoqueBaixo}`;

    // Buscar produtos com estoque baixo para exibir detalhes
    const estoqueBaixoResponse = await fetch("/api/dashboard/estoque-baixo");
    const produtosEstoqueBaixo = await estoqueBaixoResponse.json();

    // Se houver produtos com estoque baixo, mostrar alerta
    if (produtosEstoqueBaixo.length > 0) {
      console.log("Produtos com estoque baixo:", produtosEstoqueBaixo);
    }

  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    document.getElementById("totalProdutos").textContent = "Erro ao carregar";
    document.getElementById("totalPedidos").textContent = "Erro ao carregar";
    document.getElementById("baixoEstoque").textContent = "Erro ao carregar";
  }
});
