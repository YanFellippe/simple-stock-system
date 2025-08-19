// Variáveis globais para os gráficos
let produtosPedidosChart,
  estoqueBaixoChart,
  cadastrosPeriodoChart,
  categoriasChart,
  movimentacoesChart,
  receitaPeriodoChart,
  produtosVendidosChart,
  receitaStatusChart;
let currentPeriod = 7; // Período padrão: 7 dias

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Iniciando dashboard...");

  try {
    // Aguardar um pouco para garantir que o DOM está completamente carregado
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Carregar dados iniciais
    await carregarDadosDashboard();

    // Configurar filtros de período
    configurarFiltrosPeriodo();

    // Inicializar gráficos (apenas se Chart.js estiver disponível)
    if (typeof Chart !== "undefined") {
      await inicializarGraficos();
    } else {
      console.error("Chart.js não está carregado");
    }
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    mostrarErroCarregamento();
  }
});

// Função para carregar dados do dashboard
async function carregarDadosDashboard() {
  try {
    console.log("Carregando dados do dashboard...");

    // Buscar estatísticas gerais
    const statsResponse = await fetch("/api/dashboard/stats");

    if (!statsResponse.ok) {
      throw new Error(`Erro na API stats: ${statsResponse.status}`);
    }

    const stats = await statsResponse.json();
    console.log("Estatísticas recebidas:", stats);

    // Atualizar cards
    atualizarCards(stats);

    // Buscar produtos com estoque baixo
    const estoqueBaixoResponse = await fetch("/api/dashboard/estoque-baixo");

    if (!estoqueBaixoResponse.ok) {
      throw new Error(
        `Erro na API estoque-baixo: ${estoqueBaixoResponse.status}`
      );
    }

    const produtosEstoqueBaixo = await estoqueBaixoResponse.json();

    // Atualizar tabela de estoque baixo
    atualizarTabelaEstoqueBaixo(produtosEstoqueBaixo);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    throw error;
  }
}

// Função para atualizar os cards
function atualizarCards(stats) {
  console.log("Atualizando cards com dados:", stats);

  // Mapear dados para os cards
  const cardData = [
    { id: "totalProdutos", value: stats.totalProdutos || 0 },
    { id: "totalPedidos", value: stats.totalPedidos || 0 },
    { id: "baixoEstoque", value: stats.estoqueBaixo || 0 },
    { id: "movimentacoesHoje", value: stats.movimentacoesHoje || 0 },
  ];

  cardData.forEach(({ id, value }) => {
    const cardElement = document.getElementById(id);

    if (cardElement) {
      const numberElement = cardElement.querySelector(".card-number");

      if (numberElement) {
        numberElement.textContent = value;
        console.log(`✅ ${id}: ${value}`);
      } else {
        console.error(`❌ .card-number não encontrado em ${id}`);
        // Fallback: tentar atualizar o card inteiro
        const cardContent = cardElement.querySelector(".card-content");
        if (cardContent) {
          let numberSpan = cardContent.querySelector(".card-number");
          if (!numberSpan) {
            numberSpan = document.createElement("span");
            numberSpan.className = "card-number";
            cardContent.appendChild(numberSpan);
          }
          numberSpan.textContent = value;
        }
      }
    } else {
      console.error(`❌ Card ${id} não encontrado no DOM`);
    }
  });
}

// Função para configurar filtros de período
function configurarFiltrosPeriodo() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      // Remover classe active de todos os botões
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Adicionar classe active ao botão clicado
      button.classList.add("active");

      // Atualizar período atual
      currentPeriod = parseInt(button.dataset.period);

      // Recarregar gráficos com novo período
      await atualizarGraficos();
    });
  });
}

// Função para inicializar todos os gráficos
async function inicializarGraficos() {
  await Promise.all([
    criarGraficoProdutosPedidos(),
    criarGraficoEstoqueBaixo(),
    criarGraficoCadastrosPeriodo(),
    criarGraficoCategorias(),
    criarGraficoMovimentacoes(),
  ]);
}

// Gráfico de Produtos vs Pedidos
async function criarGraficoProdutosPedidos() {
  try {
    const [produtosRes, pedidosRes] = await Promise.all([
      fetch("/api/produtos"),
      fetch("/api/pedidos"),
    ]);

    const produtos = await produtosRes.json();
    const pedidos = await pedidosRes.json();

    const ctx = document
      .getElementById("produtosPedidosChart")
      .getContext("2d");

    produtosPedidosChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Produtos Cadastrados", "Pedidos Realizados"],
        datasets: [
          {
            data: [produtos.length, pedidos.length],
            backgroundColor: ["#ff9800", "#4caf50"],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico produtos vs pedidos:", error);
  }
}

// Gráfico de Estoque Baixo
async function criarGraficoEstoqueBaixo() {
  try {
    const response = await fetch("/api/dashboard/estoque-baixo");
    const produtosBaixo = await response.json();

    const ctx = document.getElementById("estoqueBaixoChart").getContext("2d");

    const labels = produtosBaixo.slice(0, 5).map((p) => p.nome);
    const data = produtosBaixo.slice(0, 5).map((p) => p.quantidade);

    estoqueBaixoChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Quantidade em Estoque",
            data: data,
            backgroundColor: "#f44336",
            borderColor: "#d32f2f",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico estoque baixo:", error);
  }
}

// Gráfico de Cadastros por Período
async function criarGraficoCadastrosPeriodo() {
  try {
    const response = await fetch(
      `/api/dashboard/cadastros-periodo?dias=${currentPeriod}`
    );
    const dadosCadastros = await response.json();

    const ctx = document
      .getElementById("cadastrosPeriodoChart")
      .getContext("2d");

    cadastrosPeriodoChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dadosCadastros.labels,
        datasets: [
          {
            label: "Produtos Cadastrados",
            data: dadosCadastros.data,
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y} produto(s)`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico cadastros período:", error);
  }
}

// Gráfico de Categorias
async function criarGraficoCategorias() {
  try {
    const response = await fetch("/api/dashboard/categorias");
    const categorias = await response.json();

    const ctx = document.getElementById("categoriasChart").getContext("2d");

    const labels = categorias.map((c) => c.categoria);
    const data = categorias.map((c) => c.total_quantidade);
    const cores = [
      "#ff9800",
      "#4caf50",
      "#2196f3",
      "#9c27b0",
      "#f44336",
      "#00bcd4",
    ];

    categoriasChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: cores.slice(0, labels.length),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico categorias:", error);
  }
}

// Gráfico de Movimentações
async function criarGraficoMovimentacoes() {
  try {
    const response = await fetch(
      `/api/dashboard/movimentacoes-resumo?dias=${currentPeriod}`
    );
    const movimentacoes = await response.json();

    const ctx = document.getElementById("movimentacoesChart").getContext("2d");

    movimentacoesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Adicionados", "Atualizados", "Removidos"],
        datasets: [
          {
            label: "Quantidade de Operações",
            data: [
              movimentacoes.adicionado,
              movimentacoes.atualizado,
              movimentacoes.removido,
            ],
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            borderColor: ["#388e3c", "#f57c00", "#d32f2f"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed.y} operação(ões)`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico movimentações:", error);
  }
}

// Função para atualizar tabela de estoque baixo
function atualizarTabelaEstoqueBaixo(produtos) {
  const tbody = document.querySelector("#tabelaEstoqueBaixo tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (produtos.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align: center;">Nenhum produto com estoque baixo</td></tr>';
    return;
  }

  produtos.forEach((produto) => {
    const tr = document.createElement("tr");
    const status = produto.quantidade <= 5 ? "crítico" : "baixo";

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td><span class="status-badge status-${status}">${status.toUpperCase()}</span></td>
    `;

    tbody.appendChild(tr);
  });
}

// Função para gerar dados simulados de cadastros por período
function gerarDadosCadastrosPeriodo(dias) {
  const labels = [];
  const data = [];
  const hoje = new Date();

  for (let i = dias - 1; i >= 0; i--) {
    const data_atual = new Date(hoje);
    data_atual.setDate(hoje.getDate() - i);

    if (dias <= 7) {
      labels.push(data_atual.toLocaleDateString("pt-BR", { weekday: "short" }));
    } else if (dias <= 30) {
      labels.push(
        data_atual.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        })
      );
    } else {
      labels.push(data_atual.toLocaleDateString("pt-BR", { month: "short" }));
    }

    // Simular dados aleatórios
    data.push(Math.floor(Math.random() * 10) + 1);
  }

  return { labels, data };
}

// Função para processar logs de movimentações
function processarLogsMovimentacoes(logs) {
  const movimentacoes = {
    adicionado: 0,
    atualizado: 0,
    removido: 0,
  };

  logs.forEach((log) => {
    if (movimentacoes.hasOwnProperty(log.acao)) {
      movimentacoes[log.acao]++;
    }
  });

  return movimentacoes;
}

// Função para atualizar gráficos com novo período
async function atualizarGraficos() {
  try {
    // Destruir gráficos que dependem do período e recriar
    if (cadastrosPeriodoChart) {
      cadastrosPeriodoChart.destroy();
    }
    if (movimentacoesChart) {
      movimentacoesChart.destroy();
    }

    // Recriar gráficos com novo período
    await Promise.all([
      criarGraficoCadastrosPeriodo(),
      criarGraficoMovimentacoes(),
    ]);
  } catch (error) {
    console.error("Erro ao atualizar gráficos:", error);
  }
}

// Função para mostrar erro de carregamento
function mostrarErroCarregamento() {
  const cards = [
    "totalProdutos",
    "totalPedidos",
    "baixoEstoque",
    "movimentacoesHoje",
  ];

  cards.forEach((cardId) => {
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
      const numberElement = cardElement.querySelector(".card-number");
      if (numberElement) {
        numberElement.textContent = "Erro";
      }
    }
  });
}
