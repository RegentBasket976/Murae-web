const express = require("express");
const Producto = require("../models/Producto");
const Pedido = require("../models/Pedido");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, correo, celular, ciudad, items } = req.body;

    if (!nombre || !apellido || !correo || !celular) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    if (!/^\d{10}$/.test(celular)) {
      return res.status(400).json({ mensaje: "El celular debe tener 10 dígitos." });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ mensaje: "El carrito está vacío o es demasiado grande." });
    }

    // Se juntan las cantidades si un mismo producto llega repetido
    const cantidades = {};
    for (const item of items) {
      const cantidad = Number(item.cantidad);
      if (
        typeof item.producto !== "string" ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > 20
      ) {
        return res.status(400).json({ mensaje: "Hay productos con datos no válidos." });
      }
      cantidades[item.producto] = (cantidades[item.producto] || 0) + cantidad;
    }

    // Los precios salen de la base de datos, nunca del navegador
    const claves = Object.keys(cantidades);
    const productos = await Producto.find({ clave: { $in: claves } });

    if (productos.length !== claves.length) {
      return res.status(400).json({ mensaje: "Hay productos que no existen." });
    }

    const itemsPedido = productos.map((p) => ({
      clave: p.clave,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: cantidades[p.clave],
    }));

    const total = itemsPedido.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

    await Pedido.create({
      nombre,
      apellido,
      correo,
      celular,
      ciudad,
      items: itemsPedido,
      total,
    });

    res.status(201).json({ mensaje: "Pedido recibido.", total });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ mensaje: "Los datos enviados no son válidos." });
    }
    console.error("Error al guardar el pedido:", error);
    res.status(500).json({ mensaje: "Error del servidor." });
  }
});

module.exports = router;