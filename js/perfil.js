document.addEventListener("DOMContentLoaded", () => {
  // Inicializar ícones do Lucide
  lucide.createIcons();
  
  // Verificar se usuário está logado
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '../index.html';
    return;
  }
  
  // Carregar dados do usuário
  carregarPerfilUsuario();
  
  // Aplicar tema
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  }
});

// Função para gerar iniciais do nome para o avatar
function generateAvatarInitials(name) {
  if (!name) return "U";
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
      : nameParts[0][0];
  return initials.toUpperCase();
}

// Função de notificação padronizada
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

// Carregar dados do perfil do usuário
async function carregarPerfilUsuario() {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/usuarios/perfil', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '../index.html';
        return;
      }
      throw new Error('Erro ao carregar perfil');
    }
    
    const usuario = await response.json();
    
    // Atualizar interface com dados do usuário
    document.getElementById("profileName").textContent = usuario.nome;
    document.getElementById("profileEmail").textContent = usuario.email;
    document.getElementById("userName").value = usuario.nome;
    document.getElementById("userEmail").value = usuario.email;
    document.getElementById("profileAvatar").textContent = generateAvatarInitials(usuario.nome);
    
    // Salvar dados no localStorage para uso em outras páginas
    localStorage.setItem('userData', JSON.stringify(usuario));
    
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    showAlert('Erro ao carregar dados do perfil', 'error');
  }
}

// Validação e salvamento do formulário
const profileForm = document.getElementById("profileForm");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  let isValid = true;

  // Resetar mensagens de erro
  nameError.style.display = "none";
  emailError.style.display = "none";
  passwordError.style.display = "none";

  // Validação do nome
  if (!name || name.length < 2) {
    nameError.style.display = "block";
    isValid = false;
  }

  // Validação do email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.style.display = "block";
    isValid = false;
  }

  // Validação da senha (opcional, mas se preenchida, deve ter 6+ caracteres)
  if (password && password.length < 6) {
    passwordError.style.display = "block";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    
    const dadosAtualizacao = {
      nome: name,
      email: email
    };
    
    // Incluir senha apenas se foi fornecida
    if (password) {
      dadosAtualizacao.senha = password;
    }
    
    const response = await fetch('/api/usuarios/perfil', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizacao)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro ao atualizar perfil');
    }
    
    const usuarioAtualizado = await response.json();
    
    // Atualizar interface
    document.getElementById("profileName").textContent = usuarioAtualizado.nome;
    document.getElementById("profileEmail").textContent = usuarioAtualizado.email;
    document.getElementById("profileAvatar").textContent = generateAvatarInitials(usuarioAtualizado.nome);
    
    // Limpar campo de senha
    document.getElementById("userPassword").value = "";
    
    // Atualizar dados no localStorage
    localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
    
    showAlert("Perfil atualizado com sucesso!", "success");
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    showAlert(error.message || 'Erro ao atualizar perfil', 'error');
  }
});

// Função de logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  // Limpar dados do localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  showAlert("Saindo...", "success");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
});