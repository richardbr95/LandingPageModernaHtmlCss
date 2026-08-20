const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authmiddleware");

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

router.get(
  "/users",
  authenticateToken,
  authorizeRole("admin"),
  function (req, res) {
    db.all(
      "SELECT id, name, email, role FROM users",
      [],
      function (error, rows) {
        if (error) {
          console.error("Error fetching users:", error.message);
        }
        res.json(rows);
      },
    );
  },
);

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

router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRole("admin"),
  async function (req, res) {
    const userId = req.params.id;
    if (parseInt(userId) === req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own account" });
    }
    db.run("DELETE FROM users WHERE id = ?", [userId], function (error) {
      if (error) {
        console.error("Error deleting user:", error.message);
        return res.status(500).json({ message: "Internal server error." });
      }
      res.json({ message: "User deleted successfully" });
    });
  },
);

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
