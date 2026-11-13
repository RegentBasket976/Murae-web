const mongoose = require("mongoose");

const contactoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    ciudad: { type: String, trim: true, default: "" },
    correo: { type: String, required: true, trim: true, lowercase: true },
    celular: { type: String, required: true, trim: true },
    pregunta: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contacto", contactoSchema);