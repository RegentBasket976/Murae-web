const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, lowercase: true },
    celular: { type: String, required: true, trim: true },
    ciudad: { type: String, trim: true, default: "" },
    items: [
      {
        clave: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["pendiente", "atendido", "cancelado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pedido", pedidoSchema);