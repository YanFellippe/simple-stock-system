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
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  if (name && email && password && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Simula sucesso no cadastro e redireciona
    window.location.href = "./public/dashboard.html";
  } else {
    signupError.style.display = "block";
  }
});
// Validação e redirecionamento do formulário de login
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (email && password && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Simula sucesso no login e redireciona
    window.location.href = "./public/dashboard.html";
  } else {
    signinError.style.display = "block";
  }
});

lucide.createIcons();