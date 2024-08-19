const mongoUri = process.env.MONGODB_URI;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = mongoose.connection;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json())

try {
  mongoose.connect(mongoUri);
  console.log("Conectado a MongoDB");
  } catch (error) {
  console.error("Error de conexón", error);
  }

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model("Libro", libroSchema);

app.get("/", (req, res) => {
  res.send("Bienvenido a la tienda de libros");
});



app.use((req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(401).send("Acceso no autorizado");
  }
});

app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar libro");
  }
});

app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener libros");
  }
});