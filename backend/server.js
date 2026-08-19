const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database");
const bcrypt = require("bcrypt");
const {
  authenticateToken,
  authorizeRole,
} = require("./middleware/authmiddleware");
const jwt = require("jsonwebtoken");
const jwtSecret = "my-secret-key";
const userRoutes = require("./routes/userRoutes");

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

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

app.get(
  "/api/contact",
  authenticateToken,
  authorizeRole("admin"),
  function (req, res) {
    db.all("SELECT * FROM contacts", function (error, rows) {
      if (error) {
        console.error("Erro ao buscar contatos:", error.message);

        return res.status(500).json({ mensagem: "Fetch failed." });
      }
      res.json(rows);
    });
  },
);

app.delete(
  "/api/contact/:id",
  authenticateToken,
  authorizeRole("admin"),
  function (req, res) {
    const idContact = req.params.id;

    db.run("DELETE FROM contacts WHERE id = ?", [idContact], function (error) {
      if (error) {
        console.error("Error deleting contact.", error.message);

        return res.status(500).json({ message: "Delete failed" });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }

      console.log("Delete completed.");
      res.json({
        message: "Delete completed",
      });
    });
  },
);

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
