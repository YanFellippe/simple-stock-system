lucide.createIcons();

// Função para gerar iniciais do nome para o avatar
function generateAvatarInitials(name) {
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

// Simulação de dados do usuário
const user = {
  name: "Yan Fellippe",
  email: "yan.fellippe@gmail.com",
};

// Preenche os campos com os dados do usuário
document.getElementById("profileName").textContent = user.name;
document.getElementById("profileEmail").textContent = user.email;
document.getElementById("userName").value = user.name;
document.getElementById("userEmail").value = user.email;
document.getElementById("profileAvatar").textContent = generateAvatarInitials(
  user.name
);

// Validação e salvamento do formulário
const profileForm = document.getElementById("profileForm");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

profileForm.addEventListener("submit", (e) => {
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

  // Simulação de erro aleatório (50% de chance para demonstração)
  const simulateError = Math.random() > 0.5;

  if (isValid && !simulateError) {
    // Simula salvamento
    user.name = name;
    user.email = email;
    if (password) {
      console.log("Senha atualizada para:", password);
    }
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileAvatar").textContent =
      generateAvatarInitials(user.name);
    showAlert("Alterações feitas com sucesso", "success");
  } else if (isValid) {
    showAlert("Não foi possível editar as suas informações", "error");
  }
});

// Função de logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  showAlert("Saindo...", "success");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000); // Atraso para exibir a notificação
});

// Aplicar tema ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
});