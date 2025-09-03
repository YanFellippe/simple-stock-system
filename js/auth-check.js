// Verificação de autenticação para páginas protegidas
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('authToken');
  
  // Se não há token, redirecionar para login
  if (!token) {
    window.location.href = '../index.html';
    return;
  }
  
  // Verificar se o token ainda é válido fazendo uma requisição simples
  fetch('/api/usuarios/perfil', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '../index.html';
    }
  })
  .catch(error => {
    console.error('Erro ao verificar autenticação:', error);
    // Em caso de erro de rede, não redirecionar automaticamente
  });
});

// Função para obter dados do usuário logado
function getLoggedUser() {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// Função para fazer logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '../index.html';
}