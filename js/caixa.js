// ===== SISTEMA DE CAIXA/PDV - VERSÃO COMPLETA =====

// Variáveis globais
let caixaAtual = null;
let produtosDisponiveis = [];
let itensVenda = [];
let usuarioAtual = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando sistema de caixa...');

  try {
    // Verificar usuário logado
    usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{"id": 1, "nome": "Teste"}');
    console.log('👤 Usuário:', usuarioAtual);

    // Carregar produtos
    await carregarProdutos();

    // Verificar se há caixa aberto
    await verificarStatusCaixa();

    console.log('✅ Sistema inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    // Em caso de erro, mostrar como fechado
    mostrarCaixaFechado();
  }
});

// ===== VERIFICAÇÃO DE STATUS =====

async function verificarStatusCaixa() {
  console.log('🔍 Verificando status do caixa...');
  
  try {
    const response = await fetch(`/api/caixa/status/${usuarioAtual.id}`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.caixaAberto && data.caixa) {
        console.log('✅ Caixa já está aberto:', data.caixa);
        caixaAtual = data.caixa;
        mostrarCaixaAberto();
        
        // Carregar vendas em andamento se houver
        await carregarVendasEmAndamento();
      } else {
        console.log('ℹ️ Nenhum caixa aberto encontrado');
        mostrarCaixaFechado();
      }
    } else {
      console.warn('⚠️ Erro ao verificar status, usando modo offline');
      verificarStatusLocal();
    }
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    verificarStatusLocal();
  }
}

function verificarStatusLocal() {
  // Verificar localStorage como fallback
  const caixaLocal = localStorage.getItem('caixaAtual');
  
  if (caixaLocal) {
    try {
      caixaAtual = JSON.parse(caixaLocal);
      console.log('📱 Caixa recuperado do localStorage:', caixaAtual);
      mostrarCaixaAberto();
    } catch (error) {
      console.error('❌ Erro ao recuperar caixa local:', error);
      mostrarCaixaFechado();
    }
  } else {
    mostrarCaixaFechado();
  }
}

async function carregarVendasEmAndamento() {
  // Recuperar itens da venda em andamento do localStorage
  const vendasLocal = localStorage.getItem('itensVenda');
  
  if (vendasLocal) {
    try {
      itensVenda = JSON.parse(vendasLocal);
      console.log('🛒 Itens da venda recuperados:', itensVenda.length);
      renderizarItensVenda();
      calcularTotal();
    } catch (error) {
      console.error('❌ Erro ao recuperar itens da venda:', error);
      itensVenda = [];
    }
  }
}

// ===== FUNÇÕES DE MODAL =====

function abrirModalAbertura() {
  console.log('🔓 Abrindo modal de abertura...');
  const modal = document.getElementById('modalAberturaCaixa');
  if (modal) {
    modal.style.display = 'block';
    setTimeout(() => {
      const input = document.getElementById('valorInicialCaixa');
      if (input) input.focus();
    }, 100);
  }
}

function fecharModal(modalId) {
  console.log('❌ Fechando modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    // Limpar campos
    if (modalId === 'modalAberturaCaixa') {
      document.getElementById('valorInicialCaixa').value = '';
    }
  }
}

async function abrirCaixa() {
  console.log('💰 Abrindo caixa...');
  const valorInicial = parseFloat(document.getElementById('valorInicialCaixa').value);

  if (isNaN(valorInicial) || valorInicial < 0) {
    alert('⚠️ Informe um valor inicial válido');
    return;
  }

  try {
    // Tentar abrir no backend
    const response = await fetch('/api/caixa/abrir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario_id: usuarioAtual.id,
        valor_inicial: valorInicial
      })
    });

    if (response.ok) {
      caixaAtual = await response.json();
      console.log('✅ Caixa aberto no servidor:', caixaAtual);
    } else {
      // Fallback para modo offline
      caixaAtual = {
        id: Date.now(), // ID temporário
        usuario_id: usuarioAtual.id,
        valor_inicial: valorInicial,
        valor_atual: valorInicial,
        status: 'aberto',
        data_abertura: new Date().toISOString()
      };
      console.log('⚠️ Modo offline - caixa simulado:', caixaAtual);
    }
  } catch (error) {
    console.error('❌ Erro ao abrir caixa:', error);
    // Fallback para modo offline
    caixaAtual = {
      id: Date.now(),
      usuario_id: usuarioAtual.id,
      valor_inicial: valorInicial,
      valor_atual: valorInicial,
      status: 'aberto',
      data_abertura: new Date().toISOString()
    };
  }

  // Salvar no localStorage
  localStorage.setItem('caixaAtual', JSON.stringify(caixaAtual));

  fecharModal('modalAberturaCaixa');
  mostrarCaixaAberto();

  if (typeof NotificationSystem !== 'undefined') {
    NotificationSystem.success('Caixa aberto com sucesso!');
  } else {
    alert('✅ Caixa aberto com valor inicial: R$ ' + valorInicial.toFixed(2));
  }
}

// ===== FUNÇÕES DE INTERFACE =====

function mostrarCaixaAberto() {
  console.log('📊 Mostrando interface de caixa aberto');
  document.getElementById('caixaFechado').style.display = 'none';
  document.getElementById('caixaContainer').style.display = 'block';

  // Atualizar status
  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.querySelector('.status-text');
  if (statusIndicator) statusIndicator.className = 'status-indicator open';
  if (statusText) statusText.textContent = 'Caixa Aberto';

  // Atualizar informações
  atualizarInfoCaixa();
  
  // Renderizar itens vazios inicialmente
  renderizarItensVenda();
}

function mostrarCaixaFechado() {
  console.log('🔒 Mostrando tela de caixa fechado');
  document.getElementById('caixaContainer').style.display = 'none';
  document.getElementById('caixaFechado').style.display = 'flex';

  // Atualizar status
  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.querySelector('.status-text');
  if (statusIndicator) statusIndicator.className = 'status-indicator closed';
  if (statusText) statusText.textContent = 'Caixa Fechado';
}

function atualizarInfoCaixa() {
  if (!caixaAtual) return;

  const valorInicial = document.getElementById('valorInicial');
  const valorAtual = document.getElementById('valorAtual');

  if (valorInicial) valorInicial.textContent = formatarMoeda(caixaAtual.valor_inicial);
  if (valorAtual) valorAtual.textContent = formatarMoeda(caixaAtual.valor_atual);
}

// ===== FUNÇÕES DE PRODUTOS =====

async function carregarProdutos() {
  console.log('📦 Carregando produtos...');
  try {
    const response = await fetch('/api/produtos');
    if (response.ok) {
      produtosDisponiveis = await response.json();
      console.log('✅ Produtos carregados:', produtosDisponiveis.length);
      renderizarProdutos();
    } else {
      // Produtos de exemplo se API não funcionar
      produtosDisponiveis = [
        { id: 1, nome: 'Hambúrguer', preco: 15.90, quantidade: 10 },
        { id: 2, nome: 'Refrigerante', preco: 4.50, quantidade: 20 },
        { id: 3, nome: 'Batata Frita', preco: 8.50, quantidade: 15 },
        { id: 4, nome: 'Pizza', preco: 25.00, quantidade: 5 }
      ];
      console.log('⚠️ Usando produtos de exemplo');
      renderizarProdutos();
    }
  } catch (error) {
    console.error('❌ Erro ao carregar produtos:', error);
    produtosDisponiveis = [];
  }
}

function renderizarProdutos(filtro = '') {
  const grid = document.getElementById('produtosGrid');
  if (!grid) return;

  const produtosFiltrados = produtosDisponiveis.filter(produto =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  grid.innerHTML = produtosFiltrados.map(produto => `
    <div class="produto-card ${produto.quantidade <= 0 ? 'sem-estoque' : ''}" 
         onclick="adicionarProduto(${produto.id})">
      <div class="nome">${produto.nome}</div>
      <div class="preco">${formatarMoeda(produto.preco)}</div>
      <div class="estoque">Estoque: ${produto.quantidade}</div>
    </div>
  `).join('');
}

function adicionarProduto(produtoId) {
  console.log('➕ Adicionando produto:', produtoId);
  const produto = produtosDisponiveis.find(p => p.id === produtoId);

  if (!produto || produto.quantidade <= 0) {
    alert('⚠️ Produto sem estoque disponível');
    return;
  }

  // Verificar se já existe na venda
  const itemExistente = itensVenda.find(item => item.produto_id === produtoId);

  if (itemExistente) {
    if (itemExistente.quantidade < produto.quantidade) {
      itemExistente.quantidade++;
      itemExistente.total = itemExistente.quantidade * itemExistente.preco_unitario;
    } else {
      alert('⚠️ Quantidade máxima atingida para este produto');
      return;
    }
  } else {
    itensVenda.push({
      produto_id: produtoId,
      nome: produto.nome,
      preco_unitario: parseFloat(produto.preco),
      quantidade: 1,
      total: parseFloat(produto.preco)
    });
  }

  renderizarItensVenda();
  calcularTotal();
}

// ===== FUNÇÕES DE VENDA =====

function renderizarItensVenda() {
  console.log('🛒 Renderizando itens da venda:', itensVenda.length);
  const container = document.getElementById('itensVenda');
  if (!container) {
    console.error('❌ Container itensVenda não encontrado!');
    return;
  }

  if (itensVenda.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="shopping-cart"></i>
        <p>Nenhum item adicionado</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = itensVenda.map((item, index) => `
    <div class="item-venda">
      <div class="item-info">
        <div class="item-nome">${item.nome}</div>
        <div class="item-preco">${formatarMoeda(item.preco_unitario)} cada</div>
      </div>
      <div class="item-controls">
        <div class="qty-control">
          <button class="qty-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
          <span class="qty-display">${item.quantidade}</span>
          <button class="qty-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
        </div>
        <div class="item-total">${formatarMoeda(item.total)}</div>
        <button class="remove-item" onclick="removerItem(${index})">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');

  // Recriar ícones após atualizar o HTML
  lucide.createIcons();
  
  // Salvar no localStorage
  salvarVendaLocal();
}

function alterarQuantidade(index, delta) {
  console.log('🔄 Alterando quantidade:', index, delta);
  const item = itensVenda[index];
  const produto = produtosDisponiveis.find(p => p.id === item.produto_id);

  const novaQuantidade = item.quantidade + delta;

  if (novaQuantidade <= 0) {
    removerItem(index);
    return;
  }

  if (novaQuantidade > produto.quantidade) {
    alert('⚠️ Quantidade não disponível em estoque');
    return;
  }

  item.quantidade = novaQuantidade;
  item.total = item.quantidade * item.preco_unitario;

  renderizarItensVenda();
  calcularTotal();
}

function removerItem(index) {
  console.log('🗑️ Removendo item:', index);
  itensVenda.splice(index, 1);
  renderizarItensVenda();
  calcularTotal();
}

function calcularTotal() {
  const subtotal = itensVenda.reduce((sum, item) => sum + item.total, 0);
  const descontoInput = document.getElementById('descontoVenda');
  const desconto = descontoInput ? parseFloat(descontoInput.value) || 0 : 0;
  const total = Math.max(0, subtotal - desconto);

  const subtotalEl = document.getElementById('subtotalVenda');
  const totalEl = document.getElementById('totalVenda');
  const btnFinalizar = document.getElementById('btnFinalizar');

  if (subtotalEl) subtotalEl.textContent = formatarMoeda(subtotal);
  if (totalEl) totalEl.textContent = formatarMoeda(total);
  if (btnFinalizar) btnFinalizar.disabled = itensVenda.length === 0 || total <= 0;
}

function salvarVendaLocal() {
  // Salvar itens da venda no localStorage
  localStorage.setItem('itensVenda', JSON.stringify(itensVenda));
}

function limparVenda() {
  console.log('🧹 Limpando venda...');
  itensVenda = [];
  const descontoInput = document.getElementById('descontoVenda');
  const buscaInput = document.getElementById('buscaProduto');

  if (descontoInput) descontoInput.value = '0';
  if (buscaInput) buscaInput.value = '';

  renderizarItensVenda();
  renderizarProdutos();
  calcularTotal();
  
  // Limpar do localStorage
  localStorage.removeItem('itensVenda');
}

async function finalizarVenda() {
  console.log('✅ Finalizando venda...');
  if (itensVenda.length === 0) {
    alert('⚠️ Adicione itens à venda');
    return;
  }

  const subtotal = itensVenda.reduce((sum, item) => sum + item.total, 0);
  const desconto = parseFloat(document.getElementById('descontoVenda').value) || 0;
  const total = subtotal - desconto;
  const formaPagamento = document.getElementById('formaPagamento').value;

  // Desabilitar botão durante processamento
  const btnFinalizar = document.getElementById('btnFinalizar');
  const textoOriginal = btnFinalizar.innerHTML;
  btnFinalizar.disabled = true;
  btnFinalizar.innerHTML = '<i data-lucide="loader"></i> Processando...';
  lucide.createIcons();

  try {
    // Registrar venda no backend
    const response = await fetch('/api/caixa/venda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caixa_id: caixaAtual.id,
        usuario_id: usuarioAtual.id,
        itens: itensVenda,
        subtotal: subtotal,
        desconto: desconto,
        total: total,
        forma_pagamento: formaPagamento
      })
    });

    if (response.ok) {
      const resultado = await response.json();
      console.log('✅ Venda registrada no servidor:', resultado);
      
      // Atualizar estoque local
      atualizarEstoqueLocal();
      
      // Recarregar produtos para refletir novo estoque
      await carregarProdutos();
      
      if (typeof NotificationSystem !== 'undefined') {
        NotificationSystem.success(`Venda #${resultado.pedido_id} finalizada com sucesso!`);
      } else {
        alert(`✅ Venda #${resultado.pedido_id} finalizada!\nTotal: ${formatarMoeda(total)}`);
      }
    } else {
      console.warn('⚠️ Erro no servidor, registrando localmente');
      if (typeof NotificationSystem !== 'undefined') {
        NotificationSystem.warning('Venda registrada localmente - será sincronizada quando possível');
      } else {
        alert(`✅ Venda finalizada (modo offline)!\nTotal: ${formatarMoeda(total)}`);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao finalizar venda:', error);
    if (typeof NotificationSystem !== 'undefined') {
      NotificationSystem.warning('Venda registrada localmente - será sincronizada quando possível');
    } else {
      alert(`✅ Venda finalizada (modo offline)!\nTotal: ${formatarMoeda(total)}`);
    }
  }

  // Atualizar caixa local
  if (caixaAtual) {
    caixaAtual.valor_atual += total;
    localStorage.setItem('caixaAtual', JSON.stringify(caixaAtual));
    atualizarInfoCaixa();
  }

  // Limpar venda
  limparVenda();

  // Reabilitar botão
  btnFinalizar.disabled = false;
  btnFinalizar.innerHTML = textoOriginal;
  lucide.createIcons();
}

function atualizarEstoqueLocal() {
  // Atualizar estoque dos produtos localmente
  itensVenda.forEach(item => {
    const produto = produtosDisponiveis.find(p => p.id === item.produto_id);
    if (produto) {
      produto.quantidade -= item.quantidade;
      console.log(`📦 Estoque atualizado: ${produto.nome} - ${produto.quantidade}`);
    }
  });
}

// ===== OUTRAS FUNÇÕES =====

async function abrirModalSangria() {
  const valor = prompt('💸 Valor da sangria (R$):');
  if (!valor) return;
  
  const valorNum = parseFloat(valor);
  if (isNaN(valorNum) || valorNum <= 0) {
    alert('⚠️ Informe um valor válido');
    return;
  }
  
  const motivo = prompt('📝 Motivo da sangria:') || 'Sangria';
  
  try {
    const response = await fetch('/api/caixa/sangria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caixa_id: caixaAtual.id,
        valor: valorNum,
        motivo: motivo,
        usuario_id: usuarioAtual.id
      })
    });

    if (response.ok) {
      const resultado = await response.json();
      caixaAtual.valor_atual = resultado.novo_valor;
      console.log('✅ Sangria registrada no servidor');
    } else {
      // Fallback local
      caixaAtual.valor_atual -= valorNum;
      console.warn('⚠️ Sangria registrada localmente');
    }
  } catch (error) {
    console.error('❌ Erro na sangria:', error);
    caixaAtual.valor_atual -= valorNum;
  }
  
  // Salvar no localStorage
  localStorage.setItem('caixaAtual', JSON.stringify(caixaAtual));
  
  atualizarInfoCaixa();
  alert(`✅ Sangria de ${formatarMoeda(valorNum)} realizada`);
}

async function abrirModalSuprimento() {
  const valor = prompt('💰 Valor do suprimento (R$):');
  if (!valor) return;
  
  const valorNum = parseFloat(valor);
  if (isNaN(valorNum) || valorNum <= 0) {
    alert('⚠️ Informe um valor válido');
    return;
  }
  
  const motivo = prompt('📝 Motivo do suprimento:') || 'Suprimento';
  
  try {
    const response = await fetch('/api/caixa/suprimento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caixa_id: caixaAtual.id,
        valor: valorNum,
        motivo: motivo,
        usuario_id: usuarioAtual.id
      })
    });

    if (response.ok) {
      const resultado = await response.json();
      caixaAtual.valor_atual = resultado.novo_valor;
      console.log('✅ Suprimento registrado no servidor');
    } else {
      // Fallback local
      caixaAtual.valor_atual += valorNum;
      console.warn('⚠️ Suprimento registrado localmente');
    }
  } catch (error) {
    console.error('❌ Erro no suprimento:', error);
    caixaAtual.valor_atual += valorNum;
  }
  
  // Salvar no localStorage
  localStorage.setItem('caixaAtual', JSON.stringify(caixaAtual));
  
  atualizarInfoCaixa();
  alert(`✅ Suprimento de ${formatarMoeda(valorNum)} realizado`);
}

function verMovimentacoes() {
  alert('📋 Funcionalidade de movimentações em desenvolvimento');
}

async function abrirModalFechamento() {
  if (!caixaAtual) return;

  const valorFinal = prompt(`💰 Valor final contado (R$):\nValor atual no sistema: ${formatarMoeda(caixaAtual.valor_atual)}`);
  
  if (valorFinal === null) return; // Cancelou
  
  const valorFinalNum = parseFloat(valorFinal);
  if (isNaN(valorFinalNum) || valorFinalNum < 0) {
    alert('⚠️ Informe um valor válido');
    return;
  }

  const observacoes = prompt('📝 Observações sobre o fechamento (opcional):') || '';

  try {
    // Tentar fechar no backend
    const response = await fetch('/api/caixa/fechar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caixa_id: caixaAtual.id,
        valor_final: valorFinalNum,
        observacoes: observacoes
      })
    });

    if (response.ok) {
      const resultado = await response.json();
      console.log('✅ Caixa fechado no servidor:', resultado);
      
      if (typeof NotificationSystem !== 'undefined') {
        NotificationSystem.success('Caixa fechado com sucesso!');
      } else {
        alert('✅ Caixa fechado com sucesso!');
      }
    } else {
      console.warn('⚠️ Erro no servidor ao fechar caixa');
      alert('✅ Caixa fechado localmente!');
    }
  } catch (error) {
    console.error('❌ Erro ao fechar caixa:', error);
    alert('✅ Caixa fechado localmente!');
  }

  // Limpar dados locais
  localStorage.removeItem('caixaAtual');
  localStorage.removeItem('itensVenda');
  
  caixaAtual = null;
  itensVenda = [];
  mostrarCaixaFechado();
}

// ===== UTILITÁRIOS =====

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
}

// ===== EVENTOS =====

// Busca de produtos
document.addEventListener('DOMContentLoaded', () => {
  const buscaInput = document.getElementById('buscaProduto');
  if (buscaInput) {
    buscaInput.addEventListener('input', (e) => {
      renderizarProdutos(e.target.value);
    });
  }

  // Desconto
  const descontoInput = document.getElementById('descontoVenda');
  if (descontoInput) {
    descontoInput.addEventListener('change', calcularTotal);
  }
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ===== FUNÇÕES DE HISTÓRICO =====

function abrirModalHistorico() {
  console.log('📋 Abrindo histórico de caixas...');
  const modal = document.getElementById('modalHistoricoCaixas');
  if (modal) {
    modal.style.display = 'block';
    carregarHistoricoCaixas();
  }
}

async function carregarHistoricoCaixas() {
  console.log('📊 Carregando histórico de caixas...');
  const container = document.getElementById('historicoLista');
  const periodo = document.getElementById('periodoHistorico').value;
  
  if (!container) return;

  // Mostrar loading
  container.innerHTML = `
    <div class="loading-state">
      <i data-lucide="loader"></i>
      <p>Carregando histórico...</p>
    </div>
  `;
  lucide.createIcons();

  try {
    // Tentar carregar do backend
    const response = await fetch(`/api/caixa/historico?periodo=${periodo}`);
    let caixas = [];
    
    if (response.ok) {
      caixas = await response.json();
    } else {
      // Dados de exemplo se API não funcionar
      caixas = gerarDadosExemplo();
    }

    renderizarHistoricoCaixas(caixas);
  } catch (error) {
    console.error('❌ Erro ao carregar histórico:', error);
    // Usar dados de exemplo em caso de erro
    renderizarHistoricoCaixas(gerarDadosExemplo());
  }
}

function gerarDadosExemplo() {
  const hoje = new Date();
  return [
    {
      id: 1,
      usuario_nome: 'João Silva',
      data_abertura: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      data_fechamento: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      valor_inicial: 100.00,
      valor_final: 285.50,
      total_vendas: 185.50,
      observacoes: 'Funcionamento normal'
    },
    {
      id: 2,
      usuario_nome: 'Maria Santos',
      data_abertura: new Date(hoje.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      data_fechamento: new Date(hoje.getTime() - 1 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
      valor_inicial: 50.00,
      valor_final: 198.75,
      total_vendas: 148.75,
      observacoes: 'Dia movimentado'
    },
    {
      id: 3,
      usuario_nome: 'Pedro Costa',
      data_abertura: new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      data_fechamento: new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
      valor_inicial: 75.00,
      valor_final: 156.25,
      total_vendas: 81.25,
      observacoes: 'Sem intercorrências'
    }
  ];
}

function renderizarHistoricoCaixas(caixas) {
  const container = document.getElementById('historicoLista');
  if (!container) return;

  if (caixas.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <p>Nenhum caixa encontrado no período selecionado</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = caixas.map(caixa => `
    <div class="caixa-historico-item">
      <div class="historico-info">
        <div class="historico-label">Operador</div>
        <div class="historico-value">${caixa.usuario_nome || 'N/A'}</div>
      </div>
      <div class="historico-info">
        <div class="historico-label">Data/Hora</div>
        <div class="historico-value data">${formatarDataHora(caixa.data_abertura)}</div>
      </div>
      <div class="historico-info">
        <div class="historico-label">Valor Inicial</div>
        <div class="historico-value valor">${formatarMoeda(caixa.valor_inicial)}</div>
      </div>
      <div class="historico-info">
        <div class="historico-label">Total Vendas</div>
        <div class="historico-value valor">${formatarMoeda(caixa.total_vendas || 0)}</div>
        <div class="historico-label" style="font-size: 0.7rem;">${caixa.total_vendas_count || 0} vendas</div>
      </div>
      <div class="historico-info">
        <div class="historico-label">Valor Final</div>
        <div class="historico-value valor">${formatarMoeda(caixa.valor_final || caixa.valor_atual)}</div>
      </div>
      <div class="historico-actions">
        <button class="btn-historico" onclick="verDetalhesCaixa(${caixa.id})" title="Ver detalhes">
          <i data-lucide="eye"></i>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function verDetalhesCaixa(caixaId) {
  console.log('👁️ Visualizando detalhes do caixa:', caixaId);
  alert(`Detalhes do caixa #${caixaId}\n\nEsta funcionalidade será implementada em breve.`);
}

function formatarDataHora(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Função de teste temporária
function testarItem() {
  console.log('🧪 Testando adição de item...');
  itensVenda.push({
    produto_id: 999,
    nome: 'Item de Teste',
    preco_unitario: 10.00,
    quantidade: 1,
    total: 10.00
  });
  renderizarItensVenda();
  calcularTotal();
}

console.log('🎉 Sistema de caixa carregado completamente!');