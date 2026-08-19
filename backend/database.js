const sqlite3 = require("sqlite3").verbose();

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

db.run(
  `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
  )`,
  function (error) {
    if (error) {
      console.error("Error creating users table:", error.message);
    } else {
      console.log("Users table ready!");
    }
  },
);

module.exports = db;
