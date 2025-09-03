const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// GET - Listar todos os usuários (sem senhas)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, email, nivel_acesso FROM usuarios ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
});

// POST - Criar novo usuário
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha, nivel_acesso = 'funcionario' } = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
        }
        
        // Verificar se email já existe
        const emailExiste = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }
        
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, nivel_acesso',
            [nome, email, senhaHash, nivel_acesso]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
});

// POST - Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }
        
        // Buscar usuário
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }
        
        const usuario = result.rows[0];
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }
        
        // Gerar token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nivel_acesso: usuario.nivel_acesso },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nivel_acesso: usuario.nivel_acesso
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ erro: 'Erro no login' });
    }
});

// GET - Buscar perfil do usuário atual (requer autenticação)
router.get('/perfil', async (req, res) => {
    try {
        // Verificar se há token no header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido' });
        }
        
        // Verificar e decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar dados atuais do usuário
        const result = await pool.query(
            'SELECT id, nome, email, nivel_acesso FROM usuarios WHERE id = $1',
            [decoded.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ erro: 'Token inválido' });
        }
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ erro: 'Erro ao buscar perfil' });
    }
});

// PUT - Atualizar perfil do usuário atual (requer autenticação)
router.put('/perfil', async (req, res) => {
    try {
        // Verificar se há token no header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido' });
        }
        
        // Verificar e decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { nome, email, senha } = req.body;
        
        if (!nome || !email) {
            return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
        }
        
        // Verificar se email já existe para outro usuário
        const emailExiste = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
            [email, decoded.id]
        );
        
        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ erro: 'Email já está em uso por outro usuário' });
        }
        
        let query = 'UPDATE usuarios SET nome = $1, email = $2';
        let params = [nome, email];
        
        // Se senha foi fornecida, incluir no update
        if (senha && senha.trim() !== '') {
            const senhaHash = await bcrypt.hash(senha, 10);
            query += ', senha_hash = $3 WHERE id = $4 RETURNING id, nome, email, nivel_acesso';
            params.push(senhaHash, decoded.id);
        } else {
            query += ' WHERE id = $3 RETURNING id, nome, email, nivel_acesso';
            params.push(decoded.id);
        }
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ erro: 'Token inválido' });
        }
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ erro: 'Erro ao atualizar perfil' });
    }
});

// PUT - Atualizar usuário
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, nivel_acesso } = req.body;
        
        let query = 'UPDATE usuarios SET nome = $1, email = $2, nivel_acesso = $3';
        let params = [nome, email, nivel_acesso];
        
        // Se senha foi fornecida, incluir no update
        if (senha) {
            const senhaHash = await bcrypt.hash(senha, 10);
            query += ', senha_hash = $4 WHERE id = $5 RETURNING id, nome, email, nivel_acesso';
            params.push(senhaHash, id);
        } else {
            query += ' WHERE id = $4 RETURNING id, nome, email, nivel_acesso';
            params.push(id);
        }
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
});

// DELETE - Excluir usuário
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        
        res.json({ mensagem: 'Usuário excluído com sucesso', usuario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ erro: 'Erro ao excluir usuário' });
    }
});

module.exports = router;