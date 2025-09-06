document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("toggleThemeCheckbox");
  
  // Função para aplicar o tema
  const applyTheme = (theme) => {
    // Remover todas as classes de tema
    body.classList.remove("dark-theme", "pastel-theme", "pastel-green-theme", "pastel-orange-theme");
    
    // Aplicar o tema específico
    if (theme === "dark") {
      body.classList.add("dark-theme");
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === "pastel") {
      body.classList.add("pastel-theme");
      document.documentElement.setAttribute('data-theme', 'pastel');
    } else if (theme === "pastel-green") {
      body.classList.add("pastel-green-theme");
      document.documentElement.setAttribute('data-theme', 'pastel-green');
    } else if (theme === "pastel-orange") {
      body.classList.add("pastel-orange-theme");
      document.documentElement.setAttribute('data-theme', 'pastel-orange');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    localStorage.setItem("theme", theme);
    
    // Atualizar toggle se existir (para compatibilidade com páginas antigas)
    if (toggle) {
      toggle.checked = theme === "dark";
    }
  };
  
  // Função para aplicar tema (compatibilidade com versão antiga)
  const applyOldTheme = (isDark) => {
    applyTheme(isDark ? "dark" : "light");
  };
  
  // Verifica preferência do sistema
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Aplica o tema salvo ou a preferência do sistema
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && ["light", "dark", "pastel", "pastel-green", "pastel-orange"].includes(savedTheme)) {
    applyTheme(savedTheme);
  } else if (systemPrefersDark) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
  
  // Configura o toggle se existir (para compatibilidade)
  if (toggle) {
    toggle.addEventListener("change", (e) => {
      applyOldTheme(e.target.checked);
      if (typeof addLog === 'function') {
        addLog(`Tema alterado para ${e.target.checked ? "escuro" : "claro"}`);
      } else {
        console.log(`Tema alterado para ${e.target.checked ? "escuro" : "claro"}`);
      }
    });
  }
  
  // Observa mudanças na preferência do sistema
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          // Só muda se não tiver preferência salva
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }
  
  // Expor função globalmente para uso em outras páginas
  window.applyTheme = applyTheme;
});
// Função auxiliar (deve estar disponível globalmente ou importada)
function addLog(message) {
  console.log(message); // Implementação básica - substitua pela sua
}