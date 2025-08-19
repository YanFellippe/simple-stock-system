const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5432;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuração do banco de dados PostgreSQL
const db = new Pool({
  host: "localhost",
  user: "postgres", // Altere para seu usuário do Postgres
  password: "admin123", // Altere para sua senha do Postgres
  database: "lanchonete_db",
  port: 5432, // Porta padrão do PostgreSQL
});

// Teste de conexão
db.connect()
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch((err) => console.error("Erro de conexão", err));

// 🔄 ROTAS PRODUTOS
app.get("/api/produtos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produtos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});

app.post("/api/produtos", async (req, res) => {
  const { nome, quantidade, categoria } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO produtos (nome, quantidade, categoria) VALUES ($1, $2, $3) RETURNING *",
      [nome, quantidade, categoria]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao adicionar produto" });
  }
});

app.delete("/api/produtos/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM produtos WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao excluir produto" });
  }
});

// ROTA EXEMPLO: USUÁRIOS (opcional)
app.get("/api/usuarios", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nome, email, nivel_acesso FROM usuarios"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});