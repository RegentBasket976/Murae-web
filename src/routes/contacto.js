const express = require("express");
const Contacto = require("../models/Contacto");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, ciudad, correo, celular, pregunta } = req.body;

    if (!nombre || !apellido || !correo || !celular) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    if (!/^\d{10}$/.test(celular)) {
      return res.status(400).json({ mensaje: "El celular debe tener 10 dígitos." });
    }

    await Contacto.create({ nombre, apellido, ciudad, correo, celular, pregunta });

    res.status(201).json({ mensaje: "Mensaje recibido." });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ mensaje: "Los datos enviados no son válidos." });
    }
    console.error("Error al guardar el contacto:", error);
    res.status(500).json({ mensaje: "Error del servidor." });
  }
});

module.exports = router;