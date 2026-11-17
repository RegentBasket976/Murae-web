require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("./models/Producto");
const productos = require("./data/productos");

async function cargar() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const p of productos) {
      await Producto.updateOne({ clave: p.clave }, p, { upsert: true });
    }

    console.log(`Productos cargados: ${productos.length}`);
  } catch (error) {
    console.error("Error al cargar los productos:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

cargar();