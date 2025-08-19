document.addEventListener("DOMContentLoaded", () => {
  const pedidoForm = document.getElementById("pedidoForm");
  const tabela = document.querySelector("#tabelaPedidos tbody");
  const produtoSelect = document.getElementById("pedidoProduto");
  const quantidadeInput = document.getElementById("pedidoQtd");
  const precoInfo = document.getElementById("precoInfo");

  let produtos = [];

  // Carregar produtos para o select
  async function carregarProdutos() {
    try {
      const response = await fetch("/api/produtos");
      produtos = await response.json();
      
      // Limpar e popular o select
      produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';
      
      produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.textContent = `${produto.nome} - R$ ${parseFloat(produto.preco).toFixed(2)} (Estoque: ${produto.quantidade})`;
        option.dataset.preco = produto.preco;
        option.dataset.estoque = produto.quantidade;
        produtoSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

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
    const dataFormatada = new Date(pedido.data_pedido).toLocaleString('pt-BR');
    
    tr.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.produto_nome}</td>
      <td>${pedido.quantidade}</td>
      <td>R$ ${parseFloat(pedido.preco_unitario).toFixed(2)}</td>
      <td>R$ ${parseFloat(pedido.valor_total).toFixed(2)}</td>
      <td>
        <select class="status-select" data-id="${pedido.id}">
          <option value="pendente" ${pedido.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="preparando" ${pedido.status === 'preparando' ? 'selected' : ''}>Preparando</option>
          <option value="pronto" ${pedido.status === 'pronto' ? 'selected' : ''}>Pronto</option>
          <option value="entregue" ${pedido.status === 'entregue' ? 'selected' : ''}>Entregue</option>
        </select>
      </td>
      <td>${dataFormatada}</td>
      <td>
        <button class="btn-delete" data-id="${pedido.id}">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  }

  // Atualizar informações de preço
  function atualizarPrecoInfo() {
    const produtoSelecionado = produtoSelect.selectedOptions[0];
    const quantidade = parseInt(quantidadeInput.value) || 0;
    
    if (produtoSelecionado && produtoSelecionado.value && quantidade > 0) {
      const preco = parseFloat(produtoSelecionado.dataset.preco);
      const estoque = parseInt(produtoSelecionado.dataset.estoque);
      const total = preco * quantidade;
      
      if (quantidade > estoque) {
        precoInfo.innerHTML = `<span style="color: red;">❌ Estoque insuficiente! Disponível: ${estoque}</span>`;
        quantidadeInput.setCustomValidity("Quantidade maior que o estoque disponível");
      } else {
        precoInfo.innerHTML = `💰 Total: R$ ${total.toFixed(2)} | Estoque disponível: ${estoque}`;
        quantidadeInput.setCustomValidity("");
      }
    } else {
      precoInfo.innerHTML = "";
      quantidadeInput.setCustomValidity("");
    }
  }

  // Event listeners para atualizar preço
  produtoSelect.addEventListener("change", atualizarPrecoInfo);
  quantidadeInput.addEventListener("input", atualizarPrecoInfo);

  // Submeter novo pedido
  pedidoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = document.getElementById("pedidoCliente").value;
    const produto_id = parseInt(produtoSelect.value);
    const quantidade = parseInt(quantidadeInput.value);

    if (!produto_id) {
      alert("Por favor, selecione um produto");
      return;
    }

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, produto_id, quantidade })
      });

      if (response.ok) {
        const novoPedido = await response.json();
        addPedidoNaTabela(novoPedido);
        pedidoForm.reset();
        precoInfo.innerHTML = "";
        
        // Recarregar produtos para atualizar estoque
        await carregarProdutos();
        
        alert("Pedido criado com sucesso!");
      } else {
        const error = await response.json();
        alert("Erro ao criar pedido: " + error.erro);
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido");
    }
  });

  // Event listener para ações na tabela
  tabela.addEventListener("click", async (e) => {
    // Excluir pedido
    if (e.target.classList.contains("btn-delete")) {
      if (!confirm("Tem certeza que deseja excluir este pedido? O estoque será devolvido se o pedido não foi entregue.")) {
        return;
      }

      const id = e.target.dataset.id;
      
      try {
        const response = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
        
        if (response.ok) {
          const result = await response.json();
          e.target.closest("tr").remove();
          
          // Recarregar produtos para atualizar estoque
          await carregarProdutos();
          
          if (result.estoque_devolvido) {
            alert("Pedido excluído e estoque devolvido!");
          } else {
            alert("Pedido excluído!");
          }
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

  // Event listener para mudança de status
  tabela.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const id = e.target.dataset.id;
      const novoStatus = e.target.value;
      
      try {
        const response = await fetch(`/api/pedidos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus })
        });

        if (response.ok) {
          console.log("Status atualizado com sucesso");
        } else {
          const error = await response.json();
          alert("Erro ao atualizar status: " + error.erro);
          // Reverter a mudança
          carregarPedidos();
        }
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Erro ao atualizar status");
        carregarPedidos();
      }
    }
  });

  // Inicializar
  carregarProdutos();
  carregarPedidos();
});