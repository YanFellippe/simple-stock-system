document.addEventListener("DOMContentLoaded", () => {
  // Aplicar tema salvo imediatamente
  aplicarTemaSalvo();
  
  // Inicializar configurações
  inicializarConfiguracoes();
  carregarConfiguracoesSalvas();
  carregarLogs();
  atualizarInfoBackup();
  
  // Event listeners para formulários
  setupFormListeners();
  setupThemeSelector();
});

// Função para aplicar tema salvo
function aplicarTemaSalvo() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Remover todas as classes de tema
  document.body.classList.remove('dark-theme', 'pastel-theme', 'pastel-green-theme', 'pastel-orange-theme');
  
  // Aplicar tema salvo
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'pastel') {
    document.body.classList.add('pastel-theme');
    document.documentElement.setAttribute('data-theme', 'pastel');
  } else if (savedTheme === 'pastel-green') {
    document.body.classList.add('pastel-green-theme');
    document.documentElement.setAttribute('data-theme', 'pastel-green');
  } else if (savedTheme === 'pastel-orange') {
    document.body.classList.add('pastel-orange-theme');
    document.documentElement.setAttribute('data-theme', 'pastel-orange');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Aplicação suave do tema
  document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

// ===== INICIALIZAÇÃO ===== //
function inicializarConfiguracoes() {
  // Verificar se é primeira execução
  if (!localStorage.getItem('configInicialized')) {
    const configPadrao = {
      lanchonete: {
        nome: 'Minha Lanchonete',
        endereco: '',
        telefone: ''
      },
      estoque: {
        limiteBaixo: 10,
        limiteCritico: 5,
        notificacoesEmail: false
      },
      pedidos: {
        tempoPreparoPadrao: 15,
        autoConfirmar: false,
        permitirSemEstoque: false
      }
    };
    
    localStorage.setItem('lanchoneteConfig', JSON.stringify(configPadrao));
    localStorage.setItem('configInicialized', 'true');
    addLog('Configurações inicializadas com valores padrão', 'info');
  }
}

function carregarConfiguracoesSalvas() {
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  
  // Carregar dados da lanchonete
  if (config.lanchonete) {
    document.getElementById('nomeLanchonete').value = config.lanchonete.nome || '';
    document.getElementById('enderecoLanchonete').value = config.lanchonete.endereco || '';
    document.getElementById('telefoneLanchonete').value = config.lanchonete.telefone || '';
  }
  
  // Carregar configurações de estoque
  if (config.estoque) {
    document.getElementById('limiteEstoqueBaixo').value = config.estoque.limiteBaixo || 10;
    document.getElementById('limiteEstoqueCritico').value = config.estoque.limiteCritico || 5;
    document.getElementById('notificacoesEmail').checked = config.estoque.notificacoesEmail || false;
  }
  
  // Carregar configurações de pedidos
  if (config.pedidos) {
    document.getElementById('tempoPreparoPadrao').value = config.pedidos.tempoPreparoPadrao || 15;
    document.getElementById('autoConfirmarPedidos').checked = config.pedidos.autoConfirmar || false;
    document.getElementById('permitirPedidosSemEstoque').checked = config.pedidos.permitirSemEstoque || false;
  }
}

// ===== SETUP DE EVENT LISTENERS ===== //
function setupFormListeners() {
  // Formulário da lanchonete
  document.getElementById('lanchoneteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    salvarConfiguracoesLanchonete();
  });
  
  // Formulário de estoque
  document.getElementById('estoqueForm').addEventListener('submit', (e) => {
    e.preventDefault();
    salvarConfiguracoesEstoque();
  });
  
  // Formulário de pedidos
  document.getElementById('pedidosForm').addEventListener('submit', (e) => {
    e.preventDefault();
    salvarConfiguracoesPedidos();
  });
}

function setupThemeSelector() {
  const themeInputs = document.querySelectorAll('input[name="theme"]');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Marcar tema atual - tratamento especial para temas compostos
  let themeRadioId;
  if (currentTheme === 'pastel-green') {
    themeRadioId = 'themePastelGreen';
  } else if (currentTheme === 'pastel-orange') {
    themeRadioId = 'themePastelOrange';
  } else {
    themeRadioId = `theme${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
  }
  
  const themeRadio = document.getElementById(themeRadioId);
  if (themeRadio) {
    themeRadio.checked = true;
  }
  
  // Event listeners para mudança de tema
  themeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        const newTheme = e.target.value;
        localStorage.setItem('theme', newTheme);
        
        // Remover todas as classes de tema
        document.body.classList.remove('dark-theme', 'pastel-theme', 'pastel-green-theme', 'pastel-orange-theme');
        
        // Aplicar novo tema
        if (newTheme === 'dark') {
          document.body.classList.add('dark-theme');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (newTheme === 'pastel') {
          document.body.classList.add('pastel-theme');
          document.documentElement.setAttribute('data-theme', 'pastel');
        } else if (newTheme === 'pastel-green') {
          document.body.classList.add('pastel-green-theme');
          document.documentElement.setAttribute('data-theme', 'pastel-green');
        } else if (newTheme === 'pastel-orange') {
          document.body.classList.add('pastel-orange-theme');
          document.documentElement.setAttribute('data-theme', 'pastel-orange');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // Aplicação suave do tema
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const themeNames = {
          'light': 'claro',
          'dark': 'escuro',
          'pastel': 'pastel azul',
          'pastel-green': 'pastel verde',
          'pastel-orange': 'pastel laranja'
        };
        
        addLog(`Tema alterado para ${themeNames[newTheme]}`, 'info');
        
        if (window.NotificationSystem) {
          NotificationSystem.success(`Tema ${themeNames[newTheme]} aplicado com sucesso! 🎨`);
        } else {
          showAlert(`Tema ${themeNames[newTheme]} aplicado!`, 'success');
        }
      }
    });
  });
}

// ===== FUNÇÕES DE SALVAMENTO ===== //
function salvarConfiguracoesLanchonete() {
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  
  config.lanchonete = {
    nome: document.getElementById('nomeLanchonete').value,
    endereco: document.getElementById('enderecoLanchonete').value,
    telefone: document.getElementById('telefoneLanchonete').value
  };
  
  localStorage.setItem('lanchoneteConfig', JSON.stringify(config));
  addLog(`Dados da lanchonete atualizados: ${config.lanchonete.nome}`, 'success');
  showAlert('Informações da lanchonete salvas com sucesso!', 'success');
}

function salvarConfiguracoesEstoque() {
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  
  const limiteBaixo = parseInt(document.getElementById('limiteEstoqueBaixo').value);
  const limiteCritico = parseInt(document.getElementById('limiteEstoqueCritico').value);
  
  if (limiteCritico >= limiteBaixo) {
    showAlert('O limite crítico deve ser menor que o limite de estoque baixo!', 'error');
    return;
  }
  
  config.estoque = {
    limiteBaixo: limiteBaixo,
    limiteCritico: limiteCritico,
    notificacoesEmail: document.getElementById('notificacoesEmail').checked
  };
  
  localStorage.setItem('lanchoneteConfig', JSON.stringify(config));
  addLog(`Configurações de estoque atualizadas - Baixo: ${limiteBaixo}, Crítico: ${limiteCritico}`, 'success');
  showAlert('Configurações de estoque salvas com sucesso!', 'success');
}

function salvarConfiguracoesPedidos() {
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  
  config.pedidos = {
    tempoPreparoPadrao: parseInt(document.getElementById('tempoPreparoPadrao').value),
    autoConfirmar: document.getElementById('autoConfirmarPedidos').checked,
    permitirSemEstoque: document.getElementById('permitirPedidosSemEstoque').checked
  };
  
  localStorage.setItem('lanchoneteConfig', JSON.stringify(config));
  addLog(`Configurações de pedidos atualizadas - Tempo: ${config.pedidos.tempoPreparoPadrao}min`, 'success');
  showAlert('Configurações de pedidos salvas com sucesso!', 'success');
}

// ===== FUNÇÕES DE BACKUP ===== //
async function exportarBackup() {
  try {
    showAlert('Gerando backup...', 'info');
    
    // Coletar dados do sistema
    const backupData = {
      timestamp: new Date().toISOString(),
      versao: '1.0.0',
      configuracoes: JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}'),
      tema: localStorage.getItem('theme') || 'light',
      logs: JSON.parse(localStorage.getItem('systemLogs') || '[]'),
      // Simular dados do banco (em produção, viria da API)
      produtos: await buscarDadosProdutos(),
      pedidos: await buscarDadosPedidos(),
      usuarios: await buscarDadosUsuarios()
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `backup-lanchonete-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Salvar info do último backup
    localStorage.setItem('ultimoBackup', new Date().toISOString());
    atualizarInfoBackup();
    
    addLog('Backup completo exportado com sucesso', 'success');
    showAlert('Backup exportado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao exportar backup:', error);
    addLog('Erro ao exportar backup: ' + error.message, 'error');
    showAlert('Erro ao exportar backup!', 'error');
  }
}

function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  showConfirmDialog(
    '⚠️ Restaurar Backup',
    'Esta ação irá sobrescrever todas as configurações atuais. Deseja continuar?',
    () => {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const backupData = JSON.parse(e.target.result);
          
          // Validar estrutura do backup
          if (!backupData.timestamp || !backupData.configuracoes) {
            throw new Error('Arquivo de backup inválido');
          }
          
          // Restaurar configurações
          if (backupData.configuracoes) {
            localStorage.setItem('lanchoneteConfig', JSON.stringify(backupData.configuracoes));
          }
          
          if (backupData.tema) {
            localStorage.setItem('theme', backupData.tema);
            if (backupData.tema === 'dark') {
              document.body.classList.add('dark-theme');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.body.classList.remove('dark-theme');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          }
          
          if (backupData.logs) {
            localStorage.setItem('systemLogs', JSON.stringify(backupData.logs));
          }
          
          addLog(`Backup restaurado: ${file.name} (${backupData.timestamp})`, 'success');
          showAlert('Backup restaurado com sucesso! Recarregue a página.', 'success');
          
          // Recarregar configurações
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } catch (error) {
          console.error('Erro ao restaurar backup:', error);
          addLog('Erro ao restaurar backup: ' + error.message, 'error');
          showAlert('Erro ao restaurar backup. Verifique se o arquivo é válido.', 'error');
        }
      };
      reader.readAsText(file);
    }
  );
  
  // Resetar input
  event.target.value = '';
}

// ===== FUNÇÕES DE RELATÓRIO ===== //
async function gerarRelatorioGeral() {
  const periodo = document.getElementById('periodoRelatorio').value;
  showAlert(`Gerando relatório geral completo dos últimos ${periodo} dias...`, 'info');
  
  try {
    // Mostrar progresso
    const progressDialog = criarDialogoProgresso();
    document.body.appendChild(progressDialog);
    
    // Buscar todos os dados necessários
    atualizarProgresso(progressDialog, 20, 'Coletando dados de produtos...');
    const produtos = await buscarDadosProdutos();
    
    atualizarProgresso(progressDialog, 40, 'Coletando dados de pedidos...');
    const pedidos = await buscarDadosPedidos();
    
    atualizarProgresso(progressDialog, 60, 'Calculando estatísticas...');
    const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
    
    // Calcular estatísticas
    const stats = calcularEstatisticasGerais(produtos, pedidos, periodo);
    
    atualizarProgresso(progressDialog, 80, 'Gerando relatório...');
    
    // Gerar relatório completo
    let relatorio = gerarCabecalhoRelatorio();
    relatorio += gerarSecaoResumoExecutivo(stats, periodo);
    relatorio += gerarSecaoVendas(stats);
    relatorio += gerarSecaoEstoque(produtos, config);
    relatorio += gerarSecaoProdutosMaisVendidos(stats.produtosMaisVendidos);
    relatorio += gerarSecaoAnaliseFinanceira(stats);
    relatorio += gerarSecaoRecomendacoes(stats, produtos, config);
    relatorio += gerarRodapeRelatorio();
    
    atualizarProgresso(progressDialog, 100, 'Finalizando...');
    
    // Aguardar um pouco para mostrar o progresso completo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remover diálogo de progresso
    progressDialog.remove();
    
    // Baixar arquivo
    const nomeArquivo = `relatorio-geral-${new Date().toISOString().split('T')[0]}.txt`;
    baixarArquivo(relatorio, nomeArquivo);
    
    addLog(`Relatório geral completo gerado (${periodo} dias)`, 'success');
    showAlert('Relatório geral completo gerado com sucesso! 📊', 'success');
    
  } catch (error) {
    console.error('Erro ao gerar relatório geral:', error);
    showAlert('Erro ao gerar relatório geral!', 'error');
    
    // Remover diálogo de progresso se existir
    const progressDialog = document.querySelector('.progress-dialog');
    if (progressDialog) {
      progressDialog.remove();
    }
  }
}

async function gerarRelatorioVendas() {
  const periodo = document.getElementById('periodoRelatorio').value;
  showAlert(`Gerando relatório de vendas dos últimos ${periodo} dias...`, 'info');
  
  try {
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const relatorio = {
      periodo: `${periodo} dias`,
      totalVendas: Math.floor(Math.random() * 10000) + 5000,
      totalPedidos: Math.floor(Math.random() * 500) + 100,
      ticketMedio: 0
    };
    
    relatorio.ticketMedio = (relatorio.totalVendas / relatorio.totalPedidos).toFixed(2);
    
    const dataStr = `RELATÓRIO DE VENDAS - ${new Date().toLocaleDateString()}\n\n` +
                   `Período: Últimos ${relatorio.periodo}\n` +
                   `Total de Vendas: R$ ${relatorio.totalVendas.toFixed(2)}\n` +
                   `Total de Pedidos: ${relatorio.totalPedidos}\n` +
                   `Ticket Médio: R$ ${relatorio.ticketMedio}\n`;
    
    baixarArquivo(dataStr, `relatorio-vendas-${new Date().toISOString().split('T')[0]}.txt`);
    addLog(`Relatório de vendas gerado (${periodo} dias)`, 'info');
    showAlert('Relatório de vendas gerado com sucesso!', 'success');
  } catch (error) {
    showAlert('Erro ao gerar relatório de vendas!', 'error');
  }
}

async function gerarRelatorioEstoque() {
  showAlert('Gerando relatório de estoque...', 'info');
  
  try {
    const produtos = await buscarDadosProdutos();
    const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
    const limiteBaixo = config.estoque?.limiteBaixo || 10;
    
    let relatorio = `RELATÓRIO DE ESTOQUE - ${new Date().toLocaleDateString()}\n\n`;
    relatorio += `Total de Produtos: ${produtos.length}\n`;
    relatorio += `Limite Estoque Baixo: ${limiteBaixo} unidades\n\n`;
    
    relatorio += 'PRODUTOS:\n';
    produtos.forEach(produto => {
      const status = produto.quantidade <= limiteBaixo ? ' [BAIXO]' : '';
      relatorio += `- ${produto.nome}: ${produto.quantidade} unidades${status}\n`;
    });
    
    baixarArquivo(relatorio, `relatorio-estoque-${new Date().toISOString().split('T')[0]}.txt`);
    addLog('Relatório de estoque gerado', 'info');
    showAlert('Relatório de estoque gerado com sucesso!', 'success');
  } catch (error) {
    showAlert('Erro ao gerar relatório de estoque!', 'error');
  }
}

async function gerarRelatorioProdutos() {
  showAlert('Gerando relatório de produtos mais vendidos...', 'info');
  
  try {
    // Simular dados de produtos mais vendidos
    const produtosMaisVendidos = [
      { nome: 'Hambúrguer Clássico', vendas: 150 },
      { nome: 'Batata Frita', vendas: 120 },
      { nome: 'Refrigerante', vendas: 200 },
      { nome: 'Sanduíche Natural', vendas: 80 },
      { nome: 'Suco de Laranja', vendas: 90 }
    ].sort((a, b) => b.vendas - a.vendas);
    
    let relatorio = `PRODUTOS MAIS VENDIDOS - ${new Date().toLocaleDateString()}\n\n`;
    
    produtosMaisVendidos.forEach((produto, index) => {
      relatorio += `${index + 1}º ${produto.nome}: ${produto.vendas} vendas\n`;
    });
    
    baixarArquivo(relatorio, `produtos-mais-vendidos-${new Date().toISOString().split('T')[0]}.txt`);
    addLog('Relatório de produtos mais vendidos gerado', 'info');
    showAlert('Relatório gerado com sucesso!', 'success');
  } catch (error) {
    showAlert('Erro ao gerar relatório!', 'error');
  }
}

// ===== FUNÇÕES DE ZONA DE PERIGO ===== //
function limparTodosDados() {
  showConfirmDialog(
    '🚨 ATENÇÃO - ZONA DE PERIGO',
    'Esta ação irá APAGAR TODOS OS DADOS do sistema, incluindo produtos, pedidos, configurações e logs. Esta ação é IRREVERSÍVEL!\n\nTem certeza absoluta que deseja continuar?',
    () => {
      showConfirmDialog(
        '⚠️ CONFIRMAÇÃO FINAL',
        'Digite "CONFIRMAR" para prosseguir com a exclusão de todos os dados:',
        () => {
          // Limpar todos os dados
          const keysToKeep = ['authToken', 'userData']; // Manter dados de autenticação
          const allKeys = Object.keys(localStorage);
          
          allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          });
          
          addLog('TODOS OS DADOS DO SISTEMA FORAM APAGADOS', 'error');
          showAlert('Todos os dados foram apagados! Recarregando...', 'error');
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        true // Requer confirmação por texto
      );
    }
  );
}

function resetarConfiguracoes() {
  showConfirmDialog(
    '🔄 Resetar Configurações',
    'Esta ação irá restaurar todas as configurações para os valores padrão. Os dados (produtos, pedidos) serão mantidos.',
    () => {
      localStorage.removeItem('lanchoneteConfig');
      localStorage.removeItem('theme');
      
      // Aplicar tema padrão
      document.body.classList.remove('dark-theme');
      document.documentElement.setAttribute('data-theme', 'light');
      
      addLog('Configurações resetadas para valores padrão', 'warning');
      showAlert('Configurações resetadas! Recarregando...', 'success');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  );
}

// ===== FUNÇÕES AUXILIARES ===== //
function limparLogs() {
  showConfirmDialog(
    'Limpar Logs',
    'Deseja limpar todos os logs de atividade do sistema?',
    () => {
      localStorage.removeItem('systemLogs');
      document.getElementById('logRecentes').innerHTML = '<li class="log-info">Logs limpos</li>';
      addLog('Logs do sistema foram limpos', 'info');
      showAlert('Logs limpos com sucesso!', 'success');
    }
  );
}

function addLog(message, type = 'info') {
  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
  const timestamp = new Date().toLocaleString('pt-BR');
  const newLog = {
    timestamp,
    message,
    type
  };
  
  logs.unshift(newLog);
  
  // Manter apenas os últimos 100 logs
  if (logs.length > 100) {
    logs.splice(100);
  }
  
  localStorage.setItem('systemLogs', JSON.stringify(logs));
  carregarLogs();
}

function carregarLogs() {
  const logContainer = document.getElementById('logRecentes');
  if (!logContainer) return;
  
  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
  
  if (logs.length === 0) {
    logContainer.innerHTML = '<li class="log-info">Nenhuma atividade registrada</li>';
    return;
  }
  
  logContainer.innerHTML = '';
  logs.slice(0, 15).forEach(log => {
    const li = document.createElement('li');
    li.className = `log-${log.type}`;
    li.textContent = `[${log.timestamp}] ${log.message}`;
    logContainer.appendChild(li);
  });
}

function atualizarInfoBackup() {
  const ultimoBackup = localStorage.getItem('ultimoBackup');
  const ultimoBackupElement = document.getElementById('ultimoBackup');
  
  if (ultimoBackup && ultimoBackupElement) {
    const data = new Date(ultimoBackup);
    ultimoBackupElement.textContent = data.toLocaleString('pt-BR');
  }
  
  // Simular tamanho do banco
  const tamanhoElement = document.getElementById('tamanhoBanco');
  if (tamanhoElement) {
    const tamanhoSimulado = Math.floor(Math.random() * 50) + 10;
    tamanhoElement.textContent = `${tamanhoSimulado} MB`;
  }
}

// ===== FUNÇÕES DE DADOS (SIMULADAS) ===== //
async function buscarDadosProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Usando dados simulados para produtos');
  }
  
  // Dados simulados se API não estiver disponível
  return [
    { id: 1, nome: 'Hambúrguer', quantidade: 50, categoria: 'Lanches', preco: 15.90 },
    { id: 2, nome: 'Batata Frita', quantidade: 30, categoria: 'Acompanhamentos', preco: 8.50 },
    { id: 3, nome: 'Refrigerante', quantidade: 100, categoria: 'Bebidas', preco: 4.50 }
  ];
}

async function buscarDadosPedidos() {
  try {
    const response = await fetch('/api/pedidos');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Usando dados simulados para pedidos');
  }
  
  return [];
}

async function buscarDadosUsuarios() {
  // Por segurança, não incluir senhas no backup
  return [
    { id: 1, nome: 'Administrador', email: 'admin@lanchonete.com', nivel_acesso: 'admin' }
  ];
}

function baixarArquivo(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();
}

// ===== FUNÇÕES AUXILIARES PARA RELATÓRIO GERAL ===== //
function calcularEstatisticasGerais(produtos, pedidos, periodo) {
  const agora = new Date();
  const dataLimite = new Date(agora.getTime() - (periodo * 24 * 60 * 60 * 1000));
  
  // Filtrar pedidos do período
  const pedidosPeriodo = pedidos.filter(pedido => {
    const dataPedido = new Date(pedido.data_pedido || agora);
    return dataPedido >= dataLimite;
  });
  
  // Calcular estatísticas de vendas
  const totalVendas = pedidosPeriodo.reduce((sum, pedido) => sum + (parseFloat(pedido.valor_total) || 0), 0);
  const totalPedidos = pedidosPeriodo.length;
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;
  
  // Produtos mais vendidos
  const produtosVendidos = {};
  pedidosPeriodo.forEach(pedido => {
    const nome = pedido.produto_nome || pedido.produto;
    const quantidade = parseInt(pedido.quantidade) || 0;
    produtosVendidos[nome] = (produtosVendidos[nome] || 0) + quantidade;
  });
  
  const produtosMaisVendidos = Object.entries(produtosVendidos)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);
  
  // Análise de estoque
  const totalProdutos = produtos.length;
  const valorTotalEstoque = produtos.reduce((sum, produto) => {
    return sum + (parseFloat(produto.preco) || 0) * (parseInt(produto.quantidade) || 0);
  }, 0);
  
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  const limiteBaixo = config.estoque?.limiteBaixo || 10;
  const limiteCritico = config.estoque?.limiteCritico || 5;
  
  const produtosEstoqueBaixo = produtos.filter(p => p.quantidade <= limiteBaixo && p.quantidade > limiteCritico);
  const produtosEstoqueCritico = produtos.filter(p => p.quantidade <= limiteCritico);
  
  // Análise por categoria
  const categorias = {};
  produtos.forEach(produto => {
    const categoria = produto.categoria || 'Sem categoria';
    if (!categorias[categoria]) {
      categorias[categoria] = { produtos: 0, quantidade: 0, valor: 0 };
    }
    categorias[categoria].produtos++;
    categorias[categoria].quantidade += parseInt(produto.quantidade) || 0;
    categorias[categoria].valor += (parseFloat(produto.preco) || 0) * (parseInt(produto.quantidade) || 0);
  });
  
  // Status dos pedidos
  const statusPedidos = {};
  pedidosPeriodo.forEach(pedido => {
    const status = pedido.status || 'pendente';
    statusPedidos[status] = (statusPedidos[status] || 0) + 1;
  });
  
  return {
    periodo,
    totalVendas,
    totalPedidos,
    ticketMedio,
    produtosMaisVendidos,
    totalProdutos,
    valorTotalEstoque,
    produtosEstoqueBaixo: produtosEstoqueBaixo.length,
    produtosEstoqueCritico: produtosEstoqueCritico.length,
    categorias,
    statusPedidos,
    produtosDetalhes: produtos,
    pedidosDetalhes: pedidosPeriodo
  };
}

function gerarCabecalhoRelatorio() {
  const config = JSON.parse(localStorage.getItem('lanchoneteConfig') || '{}');
  const nomeLanchonete = config.lanchonete?.nome || 'Lanchonete';
  const endereco = config.lanchonete?.endereco || 'Endereço não informado';
  const telefone = config.lanchonete?.telefone || 'Telefone não informado';
  
  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           RELATÓRIO GERAL COMPLETO                          ║
║                              ${nomeLanchonete.padEnd(42)}║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Endereço: ${endereco.padEnd(63)}║
║ Telefone: ${telefone.padEnd(63)}║
║ Data de Geração: ${new Date().toLocaleString('pt-BR').padEnd(55)}║
║ Sistema: Lanchonete Management v1.0                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

`;
}

function gerarSecaoResumoExecutivo(stats, periodo) {
  return `
┌─ RESUMO EXECUTIVO ─────────────────────────────────────────────────────────┐
│                                                                            │
│ Período Analisado: Últimos ${periodo} dias                                      │
│                                                                            │
│ 💰 VENDAS                                                                  │
│   • Total de Vendas: R$ ${stats.totalVendas.toFixed(2).padStart(10)}                              │
│   • Total de Pedidos: ${stats.totalPedidos.toString().padStart(6)}                                    │
│   • Ticket Médio: R$ ${stats.ticketMedio.toFixed(2).padStart(10)}                                 │
│                                                                            │
│ 📦 ESTOQUE                                                                 │
│   • Total de Produtos: ${stats.totalProdutos.toString().padStart(6)}                                  │
│   • Valor Total em Estoque: R$ ${stats.valorTotalEstoque.toFixed(2).padStart(10)}                 │
│   • Produtos com Estoque Baixo: ${stats.produtosEstoqueBaixo.toString().padStart(3)}                          │
│   • Produtos com Estoque Crítico: ${stats.produtosEstoqueCritico.toString().padStart(3)}                        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

`;
}

function gerarSecaoVendas(stats) {
  let secao = `
┌─ ANÁLISE DE VENDAS ────────────────────────────────────────────────────────┐
│                                                                            │
│ Status dos Pedidos:                                                        │
`;

  Object.entries(stats.statusPedidos).forEach(([status, quantidade]) => {
    const statusFormatado = status.charAt(0).toUpperCase() + status.slice(1);
    const porcentagem = ((quantidade / stats.totalPedidos) * 100).toFixed(1);
    secao += `│   • ${statusFormatado.padEnd(12)}: ${quantidade.toString().padStart(3)} pedidos (${porcentagem.padStart(5)}%)                    │\n`;
  });

  const vendaDiaria = stats.totalVendas / parseInt(stats.periodo);
  const pedidosDiarios = stats.totalPedidos / parseInt(stats.periodo);

  secao += `│                                                                            │
│ Médias Diárias:                                                            │
│   • Vendas por dia: R$ ${vendaDiaria.toFixed(2).padStart(10)}                                 │
│   • Pedidos por dia: ${pedidosDiarios.toFixed(1).padStart(8)}                                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

`;

  return secao;
}

function gerarSecaoEstoque(produtos, config) {
  const limiteBaixo = config.estoque?.limiteBaixo || 10;
  const limiteCritico = config.estoque?.limiteCritico || 5;
  
  let secao = `
┌─ ANÁLISE DE ESTOQUE ───────────────────────────────────────────────────────┐
│                                                                            │
│ Configurações:                                                             │
│   • Limite Estoque Baixo: ${limiteBaixo.toString().padStart(3)} unidades                                │
│   • Limite Estoque Crítico: ${limiteCritico.toString().padStart(3)} unidades                              │
│                                                                            │
│ Produtos com Estoque Crítico (≤ ${limiteCritico}):                                   │
`;

  const produtosCriticos = produtos.filter(p => p.quantidade <= limiteCritico);
  if (produtosCriticos.length === 0) {
    secao += `│   ✅ Nenhum produto com estoque crítico                                   │\n`;
  } else {
    produtosCriticos.forEach(produto => {
      secao += `│   🚨 ${produto.nome.padEnd(30)} - ${produto.quantidade.toString().padStart(3)} unidades                    │\n`;
    });
  }

  secao += `│                                                                            │
│ Produtos com Estoque Baixo (≤ ${limiteBaixo}):                                     │
`;

  const produtosBaixos = produtos.filter(p => p.quantidade <= limiteBaixo && p.quantidade > limiteCritico);
  if (produtosBaixos.length === 0) {
    secao += `│   ✅ Nenhum produto com estoque baixo                                     │\n`;
  } else {
    produtosBaixos.forEach(produto => {
      secao += `│   ⚠️  ${produto.nome.padEnd(30)} - ${produto.quantidade.toString().padStart(3)} unidades                    │\n`;
    });
  }

  secao += `│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

`;

  return secao;
}

function gerarSecaoProdutosMaisVendidos(produtosMaisVendidos) {
  let secao = `
┌─ PRODUTOS MAIS VENDIDOS ───────────────────────────────────────────────────┐
│                                                                            │
`;

  if (produtosMaisVendidos.length === 0) {
    secao += `│   Nenhuma venda registrada no período                                     │\n`;
  } else {
    produtosMaisVendidos.forEach((produto, index) => {
      const posicao = `${index + 1}º`.padStart(3);
      const nome = produto.nome.padEnd(35);
      const quantidade = produto.quantidade.toString().padStart(4);
      secao += `│ ${posicao} ${nome} ${quantidade} vendas                              │\n`;
    });
  }

  secao += `│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

`;

  return secao;
}

function gerarSecaoAnaliseFinanceira(stats) {
  const projecaoMensal = (stats.totalVendas / parseInt(stats.periodo)) * 30;
  const projecaoAnual = (stats.totalVendas / parseInt(stats.periodo)) * 365;
  
  return `
┌─ ANÁLISE FINANCEIRA ───────────────────────────────────────────────────────┐
│                                                                            │
│ Receitas do Período:                                                       │
│   • Total: R$ ${stats.totalVendas.toFixed(2).padStart(15)}                                        │
│   • Ticket Médio: R$ ${stats.ticketMedio.toFixed(2).padStart(10)}                                 │
│                                                                            │
│ Projeções (baseadas no período atual):                                    │
│   • Projeção Mensal: R$ ${projecaoMensal.toFixed(2).padStart(12)}                                │
│   • Projeção Anual: R$ ${projecaoAnual.toFixed(2).padStart(13)}                               │
│                                                                            │
│ Valor em Estoque:                                                          │
│   • Total Investido: R$ ${stats.valorTotalEstoque.toFixed(2).padStart(12)}                                │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

`;
}

function gerarSecaoRecomendacoes(stats, produtos, config) {
  let recomendacoes = [];
  
  // Recomendações baseadas em estoque
  if (stats.produtosEstoqueCritico > 0) {
    recomendacoes.push('🚨 URGENTE: Reabastecer produtos com estoque crítico');
  }
  
  if (stats.produtosEstoqueBaixo > 0) {
    recomendacoes.push('⚠️  Planejar reabastecimento de produtos com estoque baixo');
  }
  
  // Recomendações baseadas em vendas
  if (stats.totalPedidos === 0) {
    recomendacoes.push('📈 Implementar estratégias de marketing para aumentar vendas');
  } else if (stats.ticketMedio < 20) {
    recomendacoes.push('💰 Considerar estratégias para aumentar o ticket médio');
  }
  
  // Recomendações baseadas em produtos mais vendidos
  if (stats.produtosMaisVendidos.length > 0) {
    const maisVendido = stats.produtosMaisVendidos[0];
    recomendacoes.push(`⭐ Manter estoque adequado de "${maisVendido.nome}" (produto mais vendido)`);
  }
  
  // Recomendações gerais
  if (stats.totalProdutos < 5) {
    recomendacoes.push('📦 Considerar expandir o catálogo de produtos');
  }
  
  if (recomendacoes.length === 0) {
    recomendacoes.push('✅ Sistema funcionando adequadamente');
  }
  
  let secao = `
┌─ RECOMENDAÇÕES ────────────────────────────────────────────────────────────┐
│                                                                            │
`;

  recomendacoes.forEach(recomendacao => {
    // Quebrar linhas longas
    const linhas = quebrarLinha(recomendacao, 74);
    linhas.forEach((linha, index) => {
      if (index === 0) {
        secao += `│ ${linha.padEnd(74)} │\n`;
      } else {
        secao += `│   ${linha.padEnd(72)} │\n`;
      }
    });
    secao += `│                                                                            │\n`;
  });

  secao += `└────────────────────────────────────────────────────────────────────────────┘

`;

  return secao;
}

function gerarRodapeRelatorio() {
  return `
┌─ INFORMAÇÕES TÉCNICAS ─────────────────────────────────────────────────────┐
│                                                                            │
│ Sistema: Lanchonete Management System v1.0                                │
│ Gerado em: ${new Date().toLocaleString('pt-BR').padEnd(58)} │
│ Formato: Relatório Geral Completo                                         │
│                                                                            │
│ Este relatório foi gerado automaticamente pelo sistema e contém           │
│ informações consolidadas sobre vendas, estoque e performance geral.        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                              FIM DO RELATÓRIO
═══════════════════════════════════════════════════════════════════════════════
`;
}

function quebrarLinha(texto, maxLength) {
  const palavras = texto.split(' ');
  const linhas = [];
  let linhaAtual = '';
  
  palavras.forEach(palavra => {
    if ((linhaAtual + palavra).length <= maxLength) {
      linhaAtual += (linhaAtual ? ' ' : '') + palavra;
    } else {
      if (linhaAtual) {
        linhas.push(linhaAtual);
      }
      linhaAtual = palavra;
    }
  });
  
  if (linhaAtual) {
    linhas.push(linhaAtual);
  }
  
  return linhas;
}

function criarDialogoProgresso() {
  const dialog = document.createElement('div');
  dialog.className = 'progress-dialog';
  dialog.innerHTML = `
    <div class="progress-content">
      <h3>Gerando Relatório Geral</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <p class="progress-text">Iniciando...</p>
    </div>
  `;
  return dialog;
}

function atualizarProgresso(dialog, porcentagem, texto) {
  const fill = dialog.querySelector('.progress-fill');
  const textElement = dialog.querySelector('.progress-text');
  
  fill.style.width = `${porcentagem}%`;
  textElement.textContent = texto;
}

// ===== FUNÇÕES DE UI ===== //
function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(alert);
  lucide.createIcons();
  
  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 500);
  }, 4000);
}

function showConfirmDialog(title, message, confirmCallback, requireTextConfirm = false) {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
  const textInput = requireTextConfirm ? 
    '<input type="text" id="confirmText" placeholder="Digite CONFIRMAR" style="width: 100%; padding: 0.5rem; margin: 1rem 0; border: 1px solid #ccc; border-radius: 4px;">' : '';
  
  dialog.innerHTML = `
    <div class="dialog-content">
      <h3 style="margin-top: 0; color: #dc2626;">${title}</h3>
      <p style="margin: 1rem 0; line-height: 1.5;">${message}</p>
      ${textInput}
      <div class="dialog-buttons">
        <button class="btn-secondary cancel-btn">Cancelar</button>
        <button class="btn-danger confirm-btn">Confirmar</button>
      </div>
    </div>
  `;
  
  const cancelBtn = dialog.querySelector('.cancel-btn');
  const confirmBtn = dialog.querySelector('.confirm-btn');
  
  cancelBtn.addEventListener('click', () => {
    dialog.remove();
  });
  
  confirmBtn.addEventListener('click', () => {
    if (requireTextConfirm) {
      const textInput = dialog.querySelector('#confirmText');
      if (textInput.value !== 'CONFIRMAR') {
        showAlert('Digite "CONFIRMAR" para prosseguir', 'error');
        return;
      }
    }
    confirmCallback();
    dialog.remove();
  });
  
  document.body.appendChild(dialog);
  
  // Focar no input se necessário
  if (requireTextConfirm) {
    setTimeout(() => {
      dialog.querySelector('#confirmText').focus();
    }, 100);
  }
}

// ===== ESTILOS DINÂMICOS ===== //
const style = document.createElement('style');
style.textContent = `
  .alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    z-index: 1000;
    animation: slide-in 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px;
  }
  
  .alert-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
  .alert-error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
  .alert-info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
  .alert-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
  
  .fade-out {
    animation: fade-out 0.5s ease-out forwards;
  }
  
  .confirm-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }
  
  .dialog-content {
    background: var(--card-bg, white);
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    color: var(--text-primary, #1f2937);
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fade-out {
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  .progress-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    backdrop-filter: blur(4px);
  }
  
  .progress-content {
    background: var(--card-bg, white);
    padding: 2rem;
    border-radius: 12px;
    min-width: 400px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    color: var(--text-primary, #1f2937);
    text-align: center;
  }
  
  .progress-content h3 {
    margin: 0 0 1.5rem 0;
    color: var(--text-primary, #1f2937);
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #06b6d4);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    margin: 0;
    color: var(--text-secondary, #6b7280);
    font-size: 0.9rem;
  }
  
  [data-theme="dark"] .dialog-content,
  [data-theme="dark"] .progress-content {
    background: #1f2937;
    color: #f9fafb;
  }
  
  [data-theme="dark"] .progress-content h3 {
    color: #f9fafb;
  }
  
  [data-theme="dark"] .progress-text {
    color: #d1d5db;
  }
  
  [data-theme="dark"] .progress-bar {
    background-color: #374151;
  }
  
  [data-theme="dark"] .progress-fill {
    background: linear-gradient(90deg, #f59e0b, #d97706);
  }
`;
document.head.appendChild(style);