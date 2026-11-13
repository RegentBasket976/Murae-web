const mongoose = require("mongoose");

const inscripcionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, lowercase: true },
    celular: { type: String, required: true, trim: true },
    curso: {
      type: String,
      required: true,
      enum: ["Historia Creativa", "Taller de Arte Manual", "Pensamiento y Diseño"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inscripcion", inscripcionSchema);