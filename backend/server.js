const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db", function (error) {
  if (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  } else {
    console.log("Banco de dados conectado!.");
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,

  function (error) {
    if (error) {
      console.error("Erro ao criar a tabela:", error.message);
    } else {
      console.log("Tabela contacts pronta!");
    }
  },
);

app.post("/api/contact", function (req, res) {
  const { name, email, message } = req.body;

  db.run(
    `
    INSERT INTO contacts (name, email, message) VALUES (?,?,?)
    `,
    [name, email, message],
    function (error) {
      if (error) {
        console.error("Erro ao salvar contato:", error.message);

        return res.status(500).json({
          message: "Erro ao salvar contato",
        });
      }

      console.log("Contato salvo com ID:", this.lastID);

      res.json({
        messagem: "Contato salvo com sucesso!",
      });
    },
  );
});

app.get("/api/contact", function (req, res) {
  db.all("SELECT * FROM contacts", function (error, rows) {
    if (error) {
      console.error("Erro ao buscar contatos:", error.message);

      return res.status(500).json({ mensagem: "Erro ao buscar contatos." });
    }
    res.json(rows);
  });
});

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
