const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", (req, res) => {
  db.query("SELECT * FROM pedidos", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { cliente, produto, quantidade } = req.body;
  db.query(
    "INSERT INTO pedidos (cliente, produto, quantidade) VALUES (?, ?, ?)",
    [cliente, produto, quantidade],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, cliente, produto, quantidade });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM pedidos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(204);
  });
});

module.exports = router;