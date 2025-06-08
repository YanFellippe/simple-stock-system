// tema.js
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Aplica o tema salvo no localStorage ao carregar
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
  }

  // Configura o toggle, se existir na página
  const toggle = document.getElementById('toggleThemeCheckbox');
  if (toggle) {
    toggle.checked = body.classList.contains('dark-theme');

    toggle.addEventListener('change', () => {
      body.classList.toggle('dark-theme');
      localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
  }
});