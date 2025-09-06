document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("estoqueTable").querySelector("tbody");
    const resumo = document.getElementById("resumoEstoque");
    const form = document.getElementById("addForm");
    const filterInput = document.getElementById("filterInput");

    let produtos = [];

    // Carregar produtos da API
    async function carregarProdutos() {
        try {
            console.log('Carregando produtos da API...');
            const response = await fetch('/api/produtos');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            produtos = await response.json();
            console.log('Produtos carregados:', produtos);
            renderTabela();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            if (resumo) {
                resumo.textContent = 'Erro ao carregar produtos: ' + error.message;
            }
        }
    }

    // Renderizar tabela
    function renderTabela(filtro = "") {
        console.log('Renderizando tabela com', produtos.length, 'produtos');
        
        if (!tabela) {
            console.error('Elemento tabela não encontrado');
            return;
        }
        
        tabela.innerHTML = "";
        let total = 0;
        
        const produtosFiltrados = produtos.filter(produto => 
            produto.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        console.log('Produtos filtrados:', produtosFiltrados.length);

        produtosFiltrados.forEach(produto => {
            const row = tabela.insertRow();
            row.insertCell(0).textContent = produto.nome;
            row.insertCell(1).textContent = produto.quantidade;
            row.insertCell(2).textContent = produto.categoria;
            row.insertCell(3).textContent = `R$ ${parseFloat(produto.preco || 0).toFixed(2)}`;
            
            const actionsCell = row.insertCell(4);
            const btn = document.createElement("button");
            btn.textContent = "Excluir";
            btn.className = "btn-delete";
            btn.onclick = () => excluirProduto(produto.id);
            actionsCell.appendChild(btn);
            
            total += parseInt(produto.quantidade);
        });
        
        resumo.textContent = `Total de itens em estoque: ${total}`;
    }

    // Adicionar produto
    async function adicionarProduto(nome, quantidade, categoria, preco) {
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, quantidade, categoria, preco })
            });

            if (response.ok) {
                const novoProduto = await response.json();
                produtos.push(novoProduto);
                renderTabela(filterInput.value);
                showSuccess('Produto adicionado com sucesso!');
                return true;
            } else {
                const error = await response.json();
                showError('Erro ao adicionar produto: ' + error.erro);
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            showError('Erro ao adicionar produto');
            return false;
        }
    }

    // Excluir produto
    async function excluirProduto(id) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                produtos = produtos.filter(p => p.id !== id);
                renderTabela(filterInput.value);
                showSuccess('Produto excluído com sucesso!');
            } else {
                const error = await response.json();
                showError('Erro ao excluir produto: ' + error.erro);
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            showError('Erro ao excluir produto');
        }
    }

    // Event listeners
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("itemNome").value;
        const quantidade = parseInt(document.getElementById("itemQtd").value);
        const categoria = document.getElementById("itemCat").value;
        const preco = parseFloat(document.getElementById("itemPreco").value);
        
        const sucesso = await adicionarProduto(nome, quantidade, categoria, preco);
        if (sucesso) {
            form.reset();
        }
    });

    filterInput.addEventListener("input", (e) => {
        renderTabela(e.target.value);
    });

    // Carregar dados iniciais
    carregarProdutos();
});
// Função para resetar o formulário
function resetForm() {
  const form = document.getElementById("addForm");
  form.reset();
}