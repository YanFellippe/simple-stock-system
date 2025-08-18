document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("estoqueTable").querySelector("tbody");
    const resumo = document.getElementById("resumoEstoque");
    const form = document.getElementById("addForm");
    const filterInput = document.getElementById("filterInput");

    let produtos = [];

    // Carregar produtos da API
    async function carregarProdutos() {
        try {
            const response = await fetch('/api/produtos');
            produtos = await response.json();
            renderTabela();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            resumo.textContent = 'Erro ao carregar produtos';
        }
    }

    // Renderizar tabela
    function renderTabela(filtro = "") {
        tabela.innerHTML = "";
        let total = 0;
        
        const produtosFiltrados = produtos.filter(produto => 
            produto.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        produtosFiltrados.forEach(produto => {
            const row = tabela.insertRow();
            row.insertCell(0).textContent = produto.nome;
            row.insertCell(1).textContent = produto.quantidade;
            row.insertCell(2).textContent = produto.categoria;
            
            const actionsCell = row.insertCell(3);
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
    async function adicionarProduto(nome, quantidade, categoria) {
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, quantidade, categoria })
            });

            if (response.ok) {
                const novoProduto = await response.json();
                produtos.push(novoProduto);
                renderTabela(filterInput.value);
                return true;
            } else {
                const error = await response.json();
                alert('Erro ao adicionar produto: ' + error.erro);
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao adicionar produto');
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
            } else {
                const error = await response.json();
                alert('Erro ao excluir produto: ' + error.erro);
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            alert('Erro ao excluir produto');
        }
    }

    // Event listeners
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("itemNome").value;
        const quantidade = parseInt(document.getElementById("itemQtd").value);
        const categoria = document.getElementById("itemCat").value;
        
        const sucesso = await adicionarProduto(nome, quantidade, categoria);
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