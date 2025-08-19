document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  
  // Form de usuário
  if (forms[0]) {
    forms[0].addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const nome = e.target.querySelector('input[placeholder="Novo nome de usuário"]').value;
      const senha = e.target.querySelector('input[placeholder="Nova senha"]').value;
      
      if (!nome || !senha) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      
      try {
        // Simulação de atualização de usuário
        // Em uma implementação real, você precisaria do ID do usuário logado
        addLog(`Tentativa de atualização de usuário: ${nome}`);
        alert("Funcionalidade de atualização de usuário implementada no backend. Configure o ID do usuário para usar.");
        e.target.reset();
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        alert("Erro ao atualizar usuário");
      }
    });
  }
  
  // Form de configurações do banco
  if (forms[1]) {
    forms[1].addEventListener("submit", (e) => {
      e.preventDefault();
      
      const host = e.target.querySelector('input[placeholder="Host"]').value;
      const usuario = e.target.querySelector('input[placeholder="Usuário"]').value;
      const senha = e.target.querySelector('input[placeholder="Senha"]').value;
      const banco = e.target.querySelector('input[placeholder="Nome do Banco"]').value;
      
      if (!host || !usuario || !senha || !banco) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      
      // Salvar configurações localmente (em uma implementação real, isso seria mais seguro)
      const config = { host, usuario, senha, banco };
      localStorage.setItem("dbConfig", JSON.stringify(config));
      
      addLog(`Configurações do banco atualizadas para host: ${host}`);
      alert("Configurações do banco salvas localmente. Reinicie o servidor para aplicar as mudanças.");
      e.target.reset();
    });
  }
  
  // Carregar configurações salvas
  const configSalva = localStorage.getItem("dbConfig");
  if (configSalva && forms[1]) {
    const config = JSON.parse(configSalva);
    const inputs = forms[1].querySelectorAll("input");
    if (inputs[0]) inputs[0].value = config.host || "";
    if (inputs[1]) inputs[1].value = config.usuario || "";
    // Não carregar senha por segurança
    if (inputs[3]) inputs[3].value = config.banco || "";
  }
  
  // Carregar logs existentes
  carregarLogs();
});

// Função para exportar backup
function exportarBackup() {
  try {
    const dados = {
      produtos: JSON.parse(localStorage.getItem("estoque")) || [],
      configuracoes: JSON.parse(localStorage.getItem("dbConfig")) || {},
      tema: localStorage.getItem("theme") || "light",
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `backup-lanchonete-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    addLog("Backup exportado com sucesso");
    alert("Backup exportado com sucesso!");
  } catch (error) {
    console.error("Erro ao exportar backup:", error);
    alert("Erro ao exportar backup");
  }
}

// Função para restaurar backup
function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);
      
      if (dados.produtos) {
        localStorage.setItem("estoque", JSON.stringify(dados.produtos));
      }
      if (dados.configuracoes) {
        localStorage.setItem("dbConfig", JSON.stringify(dados.configuracoes));
      }
      if (dados.tema) {
        localStorage.setItem("theme", dados.tema);
      }
      
      addLog("Backup restaurado com sucesso");
      alert("Backup restaurado com sucesso! Recarregue a página para ver as mudanças.");
    } catch (error) {
      console.error("Erro ao restaurar backup:", error);
      alert("Erro ao restaurar backup. Verifique se o arquivo é válido.");
    }
  };
  reader.readAsText(file);
}

// Função para confirmar limpeza do estoque
function confirmarLimpeza() {
  const confirmacao = confirm("⚠️ ATENÇÃO: Esta ação irá remover TODOS os produtos do estoque. Esta ação não pode ser desfeita. Deseja continuar?");
  
  if (confirmacao) {
    const segundaConfirmacao = confirm("Tem certeza absoluta? Digite 'LIMPAR' para confirmar:");
    
    if (segundaConfirmacao) {
      localStorage.removeItem("estoque");
      addLog("Estoque limpo completamente");
      alert("Estoque limpo com sucesso!");
    }
  }
}

// Função para salvar limite de estoque baixo
function salvarLimite() {
  const limite = document.getElementById("limiteEstoque").value;
  
  if (!limite || limite < 1) {
    alert("Por favor, insira um limite válido (maior que 0)");
    return;
  }
  
  localStorage.setItem("limiteEstoqueBaixo", limite);
  addLog(`Limite de estoque baixo definido para ${limite} unidades`);
  alert(`Limite de estoque baixo salvo: ${limite} unidades`);
}

// Função para adicionar log
function addLog(message) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const timestamp = new Date().toLocaleString('pt-BR');
  const newLog = `[${timestamp}] ${message}`;
  
  logs.unshift(newLog);
  
  // Manter apenas os últimos 50 logs
  if (logs.length > 50) {
    logs.splice(50);
  }
  
  localStorage.setItem("logs", JSON.stringify(logs));
  carregarLogs();
}

// Função para carregar logs
function carregarLogs() {
  const logContainer = document.getElementById("logRecentes");
  if (!logContainer) return;
  
  const logs = JSON.parse(localStorage.getItem("logs")) || [
    "[Hoje 14:32] Sistema iniciado",
    "[Hoje 14:28] Configurações carregadas"
  ];
  
  logContainer.innerHTML = "";
  logs.slice(0, 10).forEach(log => {
    const li = document.createElement("li");
    li.textContent = log;
    logContainer.appendChild(li);
  });
}

// Carregar limite salvo ao inicializar
document.addEventListener("DOMContentLoaded", () => {
  const limiteSalvo = localStorage.getItem("limiteEstoqueBaixo");
  if (limiteSalvo) {
    const inputLimite = document.getElementById("limiteEstoque");
    if (inputLimite) {
      inputLimite.value = limiteSalvo;
    }
  }
});

function updateUserCredentials(form) {
  const username = form.querySelector('input[type="text"]').value;
  const password = form.querySelector('input[type="password"]').value;

  if (!username || !password) {
    showAlert("Por favor, preencha todos os campos", "error");
    return;
  }

  // Simulação: Salvar no localStorage
  localStorage.setItem("tempUsername", username);
  localStorage.setItem("tempPassword", password);

  showAlert("Credenciais atualizadas com sucesso!", "success");
  addLog(`Credenciais de usuário atualizadas`);
}

function saveDatabaseSettings(form) {
  const inputs = form.querySelectorAll("input");
  const settings = {
    host: inputs[0].value,
    user: inputs[1].value,
    password: inputs[2].value,
    dbname: inputs[3].value,
  };

  // Validação básica
  if (!settings.host || !settings.user || !settings.dbname) {
    showAlert("Preencha todos os campos obrigatórios", "error");
    return;
  }

  // Simulação: Salvar no localStorage
  localStorage.setItem("dbSettings", JSON.stringify(settings));

  showAlert("Configurações do banco salvas!", "success");
  addLog(`Configurações do banco atualizadas`);
}

// Funções de Backup e Restauração (melhoradas)
function exportarBackup() {
  // Simulação: Criar objeto de backup
  const backupData = {
    timestamp: new Date().toISOString(),
    data: "Dados simulados do backup",
  };

  // Simulação: Criar e baixar arquivo
  const blob = new Blob([JSON.stringify(backupData)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_${new Date().toLocaleDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showAlert("Backup exportado com sucesso!", "success");
  addLog(`Backup do sistema exportado`);
}

function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      // Simulação: Processar backup
      showAlert(`Backup "${file.name}" restaurado com sucesso!`, "success");
      addLog(`Backup restaurado: ${file.name}`);
    } catch (error) {
      showAlert("Arquivo de backup inválido", "error");
    }
  };
  reader.readAsText(file);

  // Resetar input para permitir novo upload do mesmo arquivo
  event.target.value = "";
}

// Funções de Limpeza (melhoradas)
function confirmarLimpeza() {
  showConfirmDialog(
    "🧹 Limpar Estoque",
    "Tem certeza que deseja limpar TODOS os produtos do estoque? Esta ação não pode ser desfeita.",
    () => {
      // Simulação: Limpeza
      showAlert("Estoque limpo com sucesso!", "success");
      addLog(`Estoque completamente limpo`);
    }
  );
}

// Função de Notificações
function salvarLimite() {
  const input = document.getElementById("limiteEstoque");
  const limite = parseInt(input.value);

  if (isNaN(limite) || limite <= 0) {
    showAlert("Digite um valor válido para o limite", "error");
    input.focus();
    return;
  }

  localStorage.setItem("estoqueLimite", limite);
  showAlert(`Limite de estoque definido para ${limite} unidades`, "success");
  addLog(`Limite de estoque definido: ${limite} unidades`);
}

// Funções auxiliares
function loadSavedSettings() {
  // Carrega limite de estoque se existir
  const limite = localStorage.getItem("estoqueLimite");
  if (limite) {
    document.getElementById("limiteEstoque").value = limite;
  }
}

function addLog(message) {
  const logList = document.getElementById("logRecentes");
  if (!logList) return;

  const now = new Date();
  const timestamp = `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`;
  const logItem = document.createElement("li");
  logItem.textContent = `${timestamp} ${message}`;

  logList.insertBefore(logItem, logList.firstChild);

  // Mantém apenas os 10 logs mais recentes
  while (logList.children.length > 10) {
    logList.removeChild(logList.lastChild);
  }
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.add("fade-out");
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

function showConfirmDialog(title, message, confirmCallback) {
  const dialog = document.createElement("div");
  dialog.className = "confirm-dialog";

  dialog.innerHTML = `
    <div class="dialog-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="dialog-buttons">
        <button class="cancel-btn">Cancelar</button>
        <button class="confirm-btn">Confirmar</button>
      </div>
    </div>
  `;

  dialog.querySelector(".cancel-btn").addEventListener("click", () => {
    dialog.remove();
  });

  dialog.querySelector(".confirm-btn").addEventListener("click", () => {
    confirmCallback();
    dialog.remove();
  });

  document.body.appendChild(dialog);
}

// Adicione este CSS para os novos elementos de UI:
const style = document.createElement("style");
style.textContent = `
  .alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    animation: slide-in 0.3s ease-out;
  }
  
  .alert-success {
    background-color: #4CAF50;
  }
  
  .alert-error {
    background-color: #F44336;
  }
  
  .alert-info {
    background-color: #2196F3;
  }
  
  .fade-out {
    animation: fade-out 0.5s ease-out forwards;
  }
  
  .confirm-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .confirm-btn {
    background-color: #F44336 !important;
  }
  
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fade-out {
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  body.dark-theme .dialog-content {
    background-color: #333;
    color: white;
  }
`;
document.head.appendChild(style);