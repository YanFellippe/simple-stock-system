// Configurações do Tema (existente)
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  const checkbox = document.getElementById('toggleThemeCheckbox');
  if (checkbox) {
    checkbox.addEventListener('change', toggleTheme);
  }
  
  // Inicializa ícones
  lucide.createIcons();
  
  // Carrega configurações salvas
  loadSavedSettings();
});

function applyTheme() {
  const theme = localStorage.getItem('theme');
  const checkbox = document.getElementById('toggleThemeCheckbox');
  
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    if (checkbox) checkbox.checked = true;
  } else {
    document.body.classList.remove('dark-theme');
    if (checkbox) checkbox.checked = false;
  }
}

function toggleTheme(event) {
  if (event.target.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  addLog(`Tema alterado para ${event.target.checked ? 'escuro' : 'claro'}`);
}

// Funções para os formulários
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formType = e.target.querySelector('h3').textContent;
    
    switch(formType) {
      case '👤 Alterar Usuário':
        updateUserCredentials(e.target);
        break;
      case '🗄️ Configurações do Banco de Dados':
        saveDatabaseSettings(e.target);
        break;
    }
  });
});

function updateUserCredentials(form) {
  const username = form.querySelector('input[type="text"]').value;
  const password = form.querySelector('input[type="password"]').value;
  
  if (!username || !password) {
    showAlert('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  // Simulação: Salvar no localStorage
  localStorage.setItem('tempUsername', username);
  localStorage.setItem('tempPassword', password);
  
  showAlert('Credenciais atualizadas com sucesso!', 'success');
  addLog(`Credenciais de usuário atualizadas`);
}

function saveDatabaseSettings(form) {
  const inputs = form.querySelectorAll('input');
  const settings = {
    host: inputs[0].value,
    user: inputs[1].value,
    password: inputs[2].value,
    dbname: inputs[3].value
  };
  
  // Validação básica
  if (!settings.host || !settings.user || !settings.dbname) {
    showAlert('Preencha todos os campos obrigatórios', 'error');
    return;
  }
  
  // Simulação: Salvar no localStorage
  localStorage.setItem('dbSettings', JSON.stringify(settings));
  
  showAlert('Configurações do banco salvas!', 'success');
  addLog(`Configurações do banco atualizadas`);
}

// Funções de Backup e Restauração (melhoradas)
function exportarBackup() {
  // Simulação: Criar objeto de backup
  const backupData = {
    timestamp: new Date().toISOString(),
    data: "Dados simulados do backup"
  };
  
  // Simulação: Criar e baixar arquivo
  const blob = new Blob([JSON.stringify(backupData)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toLocaleDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  showAlert('Backup exportado com sucesso!', 'success');
  addLog(`Backup do sistema exportado`);
}

function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      // Simulação: Processar backup
      showAlert(`Backup "${file.name}" restaurado com sucesso!`, 'success');
      addLog(`Backup restaurado: ${file.name}`);
    } catch (error) {
      showAlert('Arquivo de backup inválido', 'error');
    }
  };
  reader.readAsText(file);
  
  // Resetar input para permitir novo upload do mesmo arquivo
  event.target.value = '';
}

// Funções de Limpeza (melhoradas)
function confirmarLimpeza() {
  showConfirmDialog(
    '🧹 Limpar Estoque',
    'Tem certeza que deseja limpar TODOS os produtos do estoque? Esta ação não pode ser desfeita.',
    () => {
      // Simulação: Limpeza
      showAlert('Estoque limpo com sucesso!', 'success');
      addLog(`Estoque completamente limpo`);
    }
  );
}

// Função de Notificações
function salvarLimite() {
  const input = document.getElementById("limiteEstoque");
  const limite = parseInt(input.value);
  
  if (isNaN(limite) || limite <= 0) {
    showAlert('Digite um valor válido para o limite', 'error');
    input.focus();
    return;
  }
  
  localStorage.setItem('estoqueLimite', limite);
  showAlert(`Limite de estoque definido para ${limite} unidades`, 'success');
  addLog(`Limite de estoque definido: ${limite} unidades`);
}

// Funções auxiliares
function loadSavedSettings() {
  // Carrega limite de estoque se existir
  const limite = localStorage.getItem('estoqueLimite');
  if (limite) {
    document.getElementById("limiteEstoque").value = limite;
  }
}

function addLog(message) {
  const logList = document.getElementById("logRecentes");
  if (!logList) return;
  
  const now = new Date();
  const timestamp = `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`;
  const logItem = document.createElement('li');
  logItem.textContent = `${timestamp} ${message}`;
  
  logList.insertBefore(logItem, logList.firstChild);
  
  // Mantém apenas os 10 logs mais recentes
  while (logList.children.length > 10) {
    logList.removeChild(logList.lastChild);
  }
}

function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

function showConfirmDialog(title, message, confirmCallback) {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
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
  
  dialog.querySelector('.cancel-btn').addEventListener('click', () => {
    dialog.remove();
  });
  
  dialog.querySelector('.confirm-btn').addEventListener('click', () => {
    confirmCallback();
    dialog.remove();
  });
  
  document.body.appendChild(dialog);
}

// Adicione este CSS para os novos elementos de UI:
const style = document.createElement('style');
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