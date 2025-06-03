const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3307;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    database: 'lanchonete_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro na conexão com MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produtos', (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar' });
        res.json(results);
    });
});

app.post('/api/produtos', (req, res) => {
    const { nome, quantidade, categoria } = req.body;
    db.query('INSERT INTO produtos (nome, quantidade, categoria) VALUES (?, ?, ?)', [nome, quantidade, categoria], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao adicionar' });
        res.json({ id: result.insertId, nome, quantidade, categoria });
    });
});

app.delete('/api/produtos/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM produtos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao excluir' });
        res.json({ mensagem: 'Excluído' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});