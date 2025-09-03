// Configuração do canvas para animação de partículas
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `rgba(255, ${Math.random() * 152 + 80}, 0, 0.7)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 152, 0, ${1 - distance / 100})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();

// Lógica do modal
const modal = document.getElementById("authModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const container = document.getElementById("container");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");
const signupError = document.getElementById("signupError");
const signinError = document.getElementById("signinError");

// Alternar entre login e cadastro
document.getElementById("signUp").addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

document.getElementById("signIn").addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Abrir e fechar modal
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  container.classList.remove("right-panel-active");
});

// Validação e redirecionamento do formulário de cadastro
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  
  // Resetar erro
  signupError.style.display = "none";
  
  if (!name || !email || !password) {
    signupError.textContent = "Todos os campos são obrigatórios";
    signupError.style.display = "block";
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    signupError.textContent = "Email inválido";
    signupError.style.display = "block";
    return;
  }
  
  if (password.length < 6) {
    signupError.textContent = "A senha deve ter pelo menos 6 caracteres";
    signupError.style.display = "block";
    return;
  }
  
  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: name,
        email: email,
        senha: password,
        nivel_acesso: 'funcionario'
      })
    });
    
    if (response.ok) {
      // Cadastro realizado com sucesso, agora fazer login automático
      await realizarLogin(email, password);
    } else {
      const error = await response.json();
      signupError.textContent = error.erro || "Erro ao criar conta";
      signupError.style.display = "block";
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    signupError.textContent = "Erro de conexão. Tente novamente.";
    signupError.style.display = "block";
  }
});

// Validação e redirecionamento do formulário de login
signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // Resetar erro
  signinError.style.display = "none";
  
  if (!email || !password) {
    signinError.textContent = "Email e senha são obrigatórios";
    signinError.style.display = "block";
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    signinError.textContent = "Email inválido";
    signinError.style.display = "block";
    return;
  }
  
  await realizarLogin(email, password);
});

// Função para realizar login
async function realizarLogin(email, password) {
  try {
    const response = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        senha: password
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Salvar token e dados do usuário no localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.usuario));
      
      // Redirecionar para o dashboard
      window.location.href = "./public/dashboard.html";
    } else {
      const error = await response.json();
      signinError.textContent = error.erro || "Credenciais inválidas";
      signinError.style.display = "block";
    }
  } catch (error) {
    console.error('Erro no login:', error);
    signinError.textContent = "Erro de conexão. Tente novamente.";
    signinError.style.display = "block";
  }
}

lucide.createIcons();