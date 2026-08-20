const express = require("express");
const db = require("../database");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/contact", function (req, res) {
  const { name, email, message } = req.body;

  db.run(
    `INSERT INTO contacts (name, email, message) VALUES (?,?,?)`,
    [name, email, message],
    function (error) {
      if (error) {
        console.error("Error to save contact", error.message);
        return res.status(500).json({ message: "Error to save contact" });
      }
      console.log("Contato salvo com ID:", this.lastID);
      res.json({ message: "Contato salvo com sucesso!" });
    },
  );
});

router.get(
  "/contact",
  authenticateToken,
  authorizeRole("admin"),
  function (req, res) {
    db.all("SELECT * FROM contacts", function (error, rows) {
      if (error) {
        console.error("Erro ao buscar contatos:", error.message);
        return res.status(500).json({ message: "Erro ao buscar contatos." });
      }

      res.json(rows);
    });
  },
);

router.delete(
  "/contact/:id",
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
        return res.status(404).json({ message: "Contact not found" });
      }

      console.log("Delete completed.");
      res.json({ message: "Delete completed" });
    });
  },
);

module.exports = router;
