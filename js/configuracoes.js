document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Configuração salva localmente (simulado).");
  });
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
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  const checkbox = document.getElementById('toggleThemeCheckbox');
  if (checkbox) {
    checkbox.addEventListener('change', toggleTheme);
  }
});