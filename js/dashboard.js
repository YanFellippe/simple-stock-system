// Variáveis globais para os gráficos
let produtosPedidosChart,
  estoqueBaixoChart,
  cadastrosPeriodoChart,
  categoriasChart,
  movimentacoesChart,
  comprasReceitaChart,
  statusPedidosChart,
  produtosVendidosChart;
let currentPeriod = 7; // Período padrão: 7 dias

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Iniciando dashboard...");

  try {
    // Aguardar um pouco para garantir que o DOM está completamente carregado
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Carregar dados iniciais
    await carregarDadosDashboard();

    // Configurar filtros de período
    configurarFiltrosPeriodo();

    // Inicializar gráficos (apenas se Chart.js estiver disponível)
    if (typeof Chart !== "undefined") {
      console.log("Chart.js carregado, inicializando gráficos...");
      await inicializarGraficos();
    } else {
      console.error("Chart.js não está carregado");
    }
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    mostrarErroCarregamento();
  }
});

// Função para obter configurações de tema para gráficos
function obterConfiguracoesGrafico() {
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  if (isDarkTheme) {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#eee'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#eee'
          },
          grid: {
            color: '#444'
          }
        },
        y: {
          ticks: {
            color: '#eee'
          },
          grid: {
            color: '#444'
          }
        },
        y1: {
          ticks: {
            color: '#eee'
          },
          grid: {
            color: '#444'
          }
        }
      }
    };
  } else {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#666'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#ddd'
          }
        },
        y: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#ddd'
          }
        },
        y1: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#ddd'
          }
        }
      }
    };
  }
}

// Função para carregar dados do dashboard
async function carregarDadosDashboard() {
  try {
    console.log("Carregando dados do dashboard...");

    let stats, receita, produtosEstoqueBaixo, pedidos;

    try {
      // Tentar buscar dados reais da API
      const [statsResponse, receitaResponse] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/resumo-receita")
      ]);

      if (statsResponse.ok) {
        stats = await statsResponse.json();
        receita = receitaResponse.ok ? await receitaResponse.json() : { receitaHoje: 0 };
        console.log("Dados reais carregados da API");
      } else {
        throw new Error("API não disponível");
      }
    } catch (error) {
      console.log("API não disponível, usando dados simulados");
      // Dados simulados
      stats = {
        totalProdutos: 14,
        totalPedidos: 25,
        estoqueBaixo: 3,
        movimentacoesHoje: 8
      };
      receita = {
        receitaHoje: 1250.75
      };
    }

    // Combinar dados
    const dadosCompletos = { ...stats, ...receita };

    // Atualizar cards
    atualizarCards(dadosCompletos);

    try {
      // Buscar produtos com estoque baixo
      const estoqueBaixoResponse = await fetch("/api/dashboard/estoque-baixo");
      if (estoqueBaixoResponse.ok) {
        produtosEstoqueBaixo = await estoqueBaixoResponse.json();
      } else {
        throw new Error("API estoque baixo não disponível");
      }
    } catch (error) {
      // Dados simulados para estoque baixo
      produtosEstoqueBaixo = [
        { nome: "Pão", categoria: "Padaria", quantidade: 5 },
        { nome: "Leite", categoria: "Laticínios", quantidade: 3 },
        { nome: "Alface", categoria: "Hortifruti", quantidade: 2 }
      ];
    }

    // Atualizar tabela de estoque baixo
    atualizarTabelaEstoqueBaixo(produtosEstoqueBaixo);

    try {
      // Buscar pedidos recentes
      const pedidosResponse = await fetch("/api/pedidos");
      if (pedidosResponse.ok) {
        pedidos = await pedidosResponse.json();
      } else {
        throw new Error("API pedidos não disponível");
      }
    } catch (error) {
      // Dados simulados para pedidos
      pedidos = [
        {
          cliente: "João Silva",
          produto_nome: "Hambúrguer",
          quantidade: 2,
          valor_total: 31.80,
          status: "pendente",
          data_pedido: new Date().toISOString()
        },
        {
          cliente: "Maria Santos",
          produto_nome: "Refrigerante",
          quantidade: 3,
          valor_total: 13.50,
          status: "preparando",
          data_pedido: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }

    atualizarTabelaPedidosRecentes(pedidos.slice(0, 10));

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    // Não relançar o erro para não quebrar o dashboard
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
    { id: "receitaHoje", value: `R$ ${(stats.receitaHoje || 0).toFixed(2)}` },
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
  const graficos = [
    { nome: 'Produtos vs Pedidos', funcao: criarGraficoProdutosPedidos },
    { nome: 'Estoque Baixo', funcao: criarGraficoEstoqueBaixo },
    { nome: 'Cadastros Período', funcao: criarGraficoCadastrosPeriodo },
    { nome: 'Categorias', funcao: criarGraficoCategorias },
    { nome: 'Movimentações', funcao: criarGraficoMovimentacoes },
    { nome: 'Compras e Receita', funcao: criarGraficoComprasReceita },
    { nome: 'Status Pedidos', funcao: criarGraficoStatusPedidos },
    { nome: 'Produtos Vendidos', funcao: criarGraficoProdutosVendidos }
  ];

  for (const grafico of graficos) {
    try {
      console.log(`Criando gráfico: ${grafico.nome}`);
      await grafico.funcao();
      console.log(`✅ Gráfico ${grafico.nome} criado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao criar gráfico ${grafico.nome}:`, error);
    }
  }
}

// Gráfico de Produtos vs Pedidos
async function criarGraficoProdutosPedidos() {
  try {
    const canvas = document.getElementById("produtosPedidosChart");
    if (!canvas) {
      console.error("Canvas produtosPedidosChart não encontrado");
      return;
    }

    const [produtosRes, pedidosRes] = await Promise.all([
      fetch("/api/produtos"),
      fetch("/api/pedidos"),
    ]);

    if (!produtosRes.ok || !pedidosRes.ok) {
      throw new Error("Erro ao buscar dados da API");
    }

    const produtos = await produtosRes.json();
    const pedidos = await pedidosRes.json();

    const ctx = canvas.getContext("2d");

    const configTema = obterConfiguracoesGrafico();
    
    produtosPedidosChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Produtos Cadastrados", "Pedidos Realizados"],
        datasets: [
          {
            data: [produtos.length, pedidos.length],
            backgroundColor: ["#ff9800", "#4caf50"],
            borderWidth: 2,
            borderColor: document.body.classList.contains('dark-theme') ? "#333" : "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: configTema.plugins.legend.labels
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
    const canvas = document.getElementById("estoqueBaixoChart");
    if (!canvas) {
      console.error("Canvas estoqueBaixoChart não encontrado");
      return;
    }

    const response = await fetch("/api/dashboard/estoque-baixo");
    if (!response.ok) {
      throw new Error("Erro ao buscar dados de estoque baixo");
    }
    
    const produtosBaixo = await response.json();
    const ctx = canvas.getContext("2d");

    const labels = produtosBaixo.slice(0, 5).map((p) => p.nome);
    const data = produtosBaixo.slice(0, 5).map((p) => p.quantidade);

    const configTema = obterConfiguracoesGrafico();
    
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
            ticks: configTema.scales.y.ticks,
            grid: configTema.scales.y.grid
          },
          x: {
            ticks: configTema.scales.x.ticks,
            grid: configTema.scales.x.grid
          }
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

    const configTema = obterConfiguracoesGrafico();
    
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
              color: configTema.scales.y.ticks.color
            },
            grid: configTema.scales.y.grid
          },
          x: {
            ticks: configTema.scales.x.ticks,
            grid: configTema.scales.x.grid
          }
        },
        plugins: {
          legend: {
            labels: configTema.plugins.legend.labels
          },
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

    const configTema = obterConfiguracoesGrafico();
    
    categoriasChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: cores.slice(0, labels.length),
            borderWidth: 2,
            borderColor: document.body.classList.contains('dark-theme') ? "#333" : "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: configTema.plugins.legend.labels
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

    const configTema = obterConfiguracoesGrafico();
    
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
              color: configTema.scales.y.ticks.color
            },
            grid: configTema.scales.y.grid
          },
          x: {
            ticks: configTema.scales.x.ticks,
            grid: configTema.scales.x.grid
          }
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

// Gráfico de Compras e Receita por Período
async function criarGraficoComprasReceita() {
  try {
    const canvas = document.getElementById("comprasReceitaChart");
    if (!canvas) {
      console.error("Canvas comprasReceitaChart não encontrado");
      return;
    }

    let labels, dadosPedidos, dadosReceita;
    
    try {
      const response = await fetch(`/api/dashboard/compras-receita?dias=${currentPeriod}`);
      if (response.ok) {
        const dados = await response.json();
        labels = dados.labels;
        dadosPedidos = dados.pedidos;
        dadosReceita = dados.receita;
      } else {
        throw new Error("API não disponível");
      }
    } catch (error) {
      console.log("Usando dados simulados para compras e receita");
      // Dados simulados
      labels = ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01'];
      dadosPedidos = [5, 8, 12, 7, 15, 10, 9];
      dadosReceita = [150.50, 240.80, 360.90, 210.30, 450.75, 300.60, 270.45];
    }

    const ctx = canvas.getContext("2d");

    const configTema = obterConfiguracoesGrafico();
    
    comprasReceitaChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Número de Pedidos",
            data: dadosPedidos,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            borderWidth: 2,
            fill: false,
            yAxisID: 'y',
          },
          {
            label: "Receita (R$)",
            data: dadosReceita,
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Data',
              color: configTema.scales.x.ticks.color
            },
            ticks: configTema.scales.x.ticks,
            grid: configTema.scales.x.grid
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Número de Pedidos',
              color: configTema.scales.y.ticks.color
            },
            ticks: configTema.scales.y.ticks,
            grid: configTema.scales.y.grid
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Receita (R$)',
              color: configTema.scales.y1.ticks.color
            },
            ticks: configTema.scales.y1.ticks,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            labels: configTema.plugins.legend.labels
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (context.datasetIndex === 0) {
                  return `Pedidos: ${context.parsed.y}`;
                } else {
                  return `Receita: R$ ${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          }
        }
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico compras e receita:", error);
  }
}

// Gráfico de Status dos Pedidos
async function criarGraficoStatusPedidos() {
  try {
    const response = await fetch("/api/pedidos");
    const pedidos = await response.json();

    // Contar pedidos por status
    const statusCount = {};
    pedidos.forEach(pedido => {
      const status = pedido.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const labels = Object.keys(statusCount);
    const data = Object.values(statusCount);
    const cores = {
      'pendente': '#ff9800',
      'preparando': '#2196f3',
      'pronto': '#4caf50',
      'entregue': '#9c27b0'
    };

    const ctx = document.getElementById("statusPedidosChart").getContext("2d");

    const configTema = obterConfiguracoesGrafico();
    
    statusPedidosChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.map(status => status.charAt(0).toUpperCase() + status.slice(1)),
        datasets: [
          {
            data: data,
            backgroundColor: labels.map(status => cores[status] || '#757575'),
            borderWidth: 2,
            borderColor: document.body.classList.contains('dark-theme') ? "#333" : "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: configTema.plugins.legend.labels
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico status pedidos:", error);
  }
}

// Gráfico de Produtos Mais Vendidos
async function criarGraficoProdutosVendidos() {
  try {
    const response = await fetch("/api/dashboard/produtos-vendidos");
    const produtos = await response.json();

    const labels = produtos.slice(0, 5).map(p => p.produto_nome);
    const data = produtos.slice(0, 5).map(p => parseInt(p.total_vendido));

    const ctx = document.getElementById("produtosVendidosChart").getContext("2d");

    const configTema = obterConfiguracoesGrafico();
    
    produtosVendidosChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Quantidade Vendida",
            data: data,
            backgroundColor: "#4caf50",
            borderColor: "#388e3c",
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
              color: configTema.scales.y.ticks.color
            },
            grid: configTema.scales.y.grid
          },
          x: {
            ticks: configTema.scales.x.ticks,
            grid: configTema.scales.x.grid
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed.y} unidades`;
              }
            }
          }
        },
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico produtos vendidos:", error);
  }
}

// Função para atualizar tabela de pedidos recentes
function atualizarTabelaPedidosRecentes(pedidos) {
  const tbody = document.querySelector("#tabelaPedidosRecentes tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (pedidos.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center;">Nenhum pedido encontrado</td></tr>';
    return;
  }

  pedidos.forEach((pedido) => {
    const tr = document.createElement("tr");
    const data = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');
    const statusClass = `status-${pedido.status}`;

    tr.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.produto_nome}</td>
      <td>${pedido.quantidade}</td>
      <td>R$ ${parseFloat(pedido.valor_total).toFixed(2)}</td>
      <td><span class="status-badge ${statusClass}">${pedido.status.toUpperCase()}</span></td>
      <td>${data}</td>
    `;

    tbody.appendChild(tr);
  });
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
    if (comprasReceitaChart) {
      comprasReceitaChart.destroy();
    }

    // Recriar gráficos com novo período
    await Promise.all([
      criarGraficoCadastrosPeriodo(),
      criarGraficoMovimentacoes(),
      criarGraficoComprasReceita(),
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
    "receitaHoje",
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

// Função para recriar gráficos quando o tema mudar
function recriarGraficosParaTema() {
  setTimeout(async () => {
    try {
      console.log("Recriando gráficos para novo tema...");
      
      // Destruir gráficos existentes
      const graficos = [
        produtosPedidosChart, estoqueBaixoChart, cadastrosPeriodoChart, 
        categoriasChart, movimentacoesChart, comprasReceitaChart, 
        statusPedidosChart, produtosVendidosChart
      ];
      
      graficos.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      
      // Limpar variáveis
      produtosPedidosChart = null;
      estoqueBaixoChart = null;
      cadastrosPeriodoChart = null;
      categoriasChart = null;
      movimentacoesChart = null;
      comprasReceitaChart = null;
      statusPedidosChart = null;
      produtosVendidosChart = null;
      
      // Recriar gráficos
      await inicializarGraficos();
      console.log("Gráficos recriados com sucesso!");
      
    } catch (error) {
      console.error("Erro ao recriar gráficos após mudança de tema:", error);
    }
  }, 300);
}

// Observar mudanças de tema
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      recriarGraficosParaTema();
    }
  });
});

// Observar mudanças na classe do body
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});
