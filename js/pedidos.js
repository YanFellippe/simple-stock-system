document.addEventListener("DOMContentLoaded", () => {
  const pedidoForm = document.getElementById("pedidoForm");
  const tabela = document.querySelector("#tabelaPedidos tbody");

  fetch("/api/pedidos")
    .then(res => res.json())
    .then(data => {
      data.forEach(addPedidoNaTabela);
    });

  pedidoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cliente = document.getElementById("pedidoCliente").value;
    const produto = document.getElementById("pedidoItem").value;
    const quantidade = parseInt(document.getElementById("pedidoQtd").value);

    fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente, produto, quantidade })
    })
    .then(res => res.json())
    .then(novo => {
      addPedidoNaTabela(novo);
      pedidoForm.reset();
    });
  });

  function addPedidoNaTabela(pedido) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.produto}</td>
      <td>${pedido.quantidade}</td>
      <td><button class="btn-delete" data-id="${pedido.id}">Excluir</button></td>
    `;
    tabela.appendChild(tr);
  }

  tabela.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const id = e.target.dataset.id;
      fetch(`/api/pedidos/${id}`, { method: "DELETE" })
        .then(() => {
          e.target.closest("tr").remove();
        });
    }
  });
});