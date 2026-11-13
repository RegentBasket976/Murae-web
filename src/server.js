require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const clasesRoutes = require("./routes/clases");       // NUEVO
const contactoRoutes = require("./routes/contacto");   // NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api/clases", clasesRoutes);       // NUEVO
app.use("/api/contacto", contactoRoutes);   // NUEVO

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor Murae corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error.message);
  });