require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const clasesRoutes = require("./routes/clases");
const contactoRoutes = require("./routes/contacto");
const pedidosRoutes = require("./routes/pedidos");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Cabeceras de seguridad (permite las fuentes de Google y tus botones)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
      },
    },
  })
);

// 2. Tamaño máximo de los datos que recibe el servidor
app.use(express.json({ limit: "10kb" }));

// 3. Tu página (la carpeta frontend)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// 4. Límite de envíos: máximo 10 cada 15 minutos por persona
const limitadorFormularios = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { mensaje: "Demasiados envíos. Inténtalo de nuevo en unos minutos." },
});

// 5. Las rutas de los formularios y pedidos, protegidas por el límite
app.use("/api/clases", limitadorFormularios, clasesRoutes);
app.use("/api/contacto", limitadorFormularios, contactoRoutes);
app.use("/api/pedidos", limitadorFormularios, pedidosRoutes);

// 6. Conexión a MongoDB y arranque del servidor
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