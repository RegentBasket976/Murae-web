const express = require("express");
const Inscripcion = require("../models/Inscripcion");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, correo, celular, curso } = req.body;

    if (!nombre || !apellido || !correo || !celular || !curso) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    if (!/^\d{10}$/.test(celular)) {
      return res.status(400).json({ mensaje: "El celular debe tener 10 dígitos." });
    }

    await Inscripcion.create({ nombre, apellido, correo, celular, curso });

    res.status(201).json({ mensaje: "Inscripción recibida." });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ mensaje: "Los datos enviados no son válidos." });
    }
    console.error("Error al guardar la inscripción:", error);
    res.status(500).json({ mensaje: "Error del servidor." });
  }
});

module.exports = router;