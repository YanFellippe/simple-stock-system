const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'senha',
  database: 'lanchonete_db',
  port: 5432
});

// GET - listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, nome, email, nivel_acesso FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// POST - registrar novo usuário
router.post('/registrar', async (req, res) => {
  const { nome, email, senha, nivel_acesso } = req.body;
  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, nivel_acesso',
      [nome, email, senha_hash, nivel_acesso || 'funcionario']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

// POST - login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta' });

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, nivel_acesso: usuario.nivel_acesso });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao autenticar usuário' });
  }
});

module.exports = router;
