const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

const jwtSecret = "my-secret-key";

router.post("/users", async function (req, res) {
  console.log("User data received:", req.body);
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)`,
    [name, email, hashedPassword, role],
    function (error) {
      if (error) {
        console.error("Error creating user:", error.message);
        return res.status(500).json({
          message: "Error creating user.",
        });
      }
      console.log("User created with ID:", this.lastID);
      res.json({
        message: "User created successfully!",
      });
    },
  );
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function (error, user) {
      if (error) {
        console.error("Error finding user:", error.message);
        return res.status(500).json({
          message: "Internal server error.",
        });
      }
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(500).json({
          message: "Internal server error.",
        });
      }
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        jwtSecret,
        {
          expiresIn: "1h",
        },
      );

      res.json({
        message: "Login successful!",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    },
  );
});

module.exports = router;
