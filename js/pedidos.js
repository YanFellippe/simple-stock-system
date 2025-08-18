document.addEventListener("DOMContentLoaded", () => {
  const pedidoForm = document.getElementById("pedidoForm");
  const tabela = document.querySelector("#tabelaPedidos tbody");

  // Carregar pedidos existentes
  async function carregarPedidos() {
    try {
      const response = await fetch("/api/pedidos");
      const pedidos = await response.json();
      
      // Limpar tabela
      tabela.innerHTML = "";
      
      // Adicionar cada pedido na tabela
      pedidos.forEach(addPedidoNaTabela);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  }

  // Adicionar pedido na tabela
  function addPedidoNaTabela(pedido) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.produto}</td>
      <td>${pedido.quantidade}</td>
      <td>
        <button class="btn-delete" data-id="${pedido.id}">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  }

  // Submeter novo pedido
  pedidoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = document.getElementById("pedidoCliente").value;
    const produto = document.getElementById("pedidoItem").value;
    const quantidade = parseInt(document.getElementById("pedidoQtd").value);

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, produto, quantidade })
      });

      if (response.ok) {
        const novoPedido = await response.json();
        addPedidoNaTabela(novoPedido);
        pedidoForm.reset();
      } else {
        const error = await response.json();
        alert("Erro ao criar pedido: " + error.erro);
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido");
    }
  });

  // Excluir pedido
  tabela.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
      if (!confirm("Tem certeza que deseja excluir este pedido?")) {
        return;
      }

      const id = e.target.dataset.id;
      
      try {
        const response = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
        
        if (response.ok) {
          e.target.closest("tr").remove();
        } else {
          const error = await response.json();
          alert("Erro ao excluir pedido: " + error.erro);
        }
      } catch (error) {
        console.error("Erro ao excluir pedido:", error);
        alert("Erro ao excluir pedido");
      }
    }
  });

  // Carregar pedidos ao inicializar
  carregarPedidos();
});