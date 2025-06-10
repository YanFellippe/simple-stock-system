document.addEventListener("DOMContentLoaded", () => {
  // Buscar dados do backend
  Promise.all([
    fetch("/api/estoque").then((res) => res.json()),
    fetch("/api/pedidos").then((res) => res.json()),
  ])
    .then(([produtos, pedidos]) => {
      document.getElementById(
        "totalProdutos"
      ).textContent = `Total de Produtos: ${produtos.length}`;
      document.getElementById(
        "totalPedidos"
      ).textContent = `Total de Pedidos: ${pedidos.length}`;

      const estoqueBaixo = produtos.filter((p) => p.quantidade < 10);
      document.getElementById(
        "baixoEstoque"
      ).textContent = `Itens com Estoque Baixo: ${estoqueBaixo.length}`;
    })
    .catch((err) => {
      console.error("Erro ao carregar dados do dashboard:", err);
    });
});
