document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("toggleThemeCheckbox");
  // Função para aplicar o tema
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
    if (toggle) {
      toggle.checked = isDark;
    }
  };
  // Verifica preferência do sistema
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Aplica o tema salvo ou a preferência do sistema
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme === "dark");
  } else if (systemPrefersDark) {
    applyTheme(true);
  }
  // Configura o toggle se existir
  if (toggle) {
    toggle.addEventListener("change", (e) => {
      applyTheme(e.target.checked);
      addLog(`Tema alterado para ${e.target.checked ? "escuro" : "claro"}`);
    });
  }
  // Observa mudanças na preferência do sistema
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          // Só muda se não tiver preferência salva
          applyTheme(e.matches);
        }
      });
  }
});
// Função auxiliar (deve estar disponível globalmente ou importada)
function addLog(message) {
  console.log(message); // Implementação básica - substitua pela sua
}