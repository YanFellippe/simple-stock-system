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
});
