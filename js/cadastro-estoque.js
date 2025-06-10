const tabela = document.getElementById("estoqueTable").querySelector("tbody");
const resumo = document.getElementById("resumoEstoque");
const form = document.getElementById("addForm");
const filterInput = document.getElementById("filterInput");

let estoque = JSON.parse(localStorage.getItem("estoque")) || [
  { nome: "Pão", qtd: 50, cat: "Padaria" },
  { nome: "Queijo", qtd: 30, cat: "Laticínios" },
  { nome: "Presunto", qtd: 25, cat: "Frios" },
  { nome: "Refrigerante", qtd: 100, cat: "Bebidas" },
];

function salvarEstoque() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
}

function renderTabela(filtro = "") {
  tabela.innerHTML = "";
  let total = 0;
  estoque.forEach((item, index) => {
    if (item.nome.toLowerCase().includes(filtro.toLowerCase())) {
      const row = tabela.insertRow();
      row.insertCell(0).textContent = item.nome;
      row.insertCell(1).textContent = item.qtd;
      row.insertCell(2).textContent = item.cat;
      const actionsCell = row.insertCell(3);
      const btn = document.createElement("button");
      btn.textContent = "Excluir";
      btn.className = "btn-delete";
      btn.onclick = () => {
        estoque.splice(index, 1);
        salvarEstoque();
        renderTabela(filterInput.value);
      };
      actionsCell.appendChild(btn);
      total += parseInt(item.qtd);
    }
  });
  resumo.textContent = `Total de itens em estoque: ${total}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("itemNome").value;
  const qtd = parseInt(document.getElementById("itemQtd").value);
  const cat = document.getElementById("itemCat").value;
  estoque.push({ nome, qtd, cat });
  salvarEstoque();
  form.reset();
  renderTabela(filterInput.value);
});

filterInput.addEventListener("input", (e) => {
  renderTabela(e.target.value);
});

renderTabela();