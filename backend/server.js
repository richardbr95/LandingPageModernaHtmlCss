const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.use("/api", contactRoutes);

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
