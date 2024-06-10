const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Tp2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un esquema para los datos del clima
const weatherSchema = new mongoose.Schema({
  country: String,
  city: String,
  temperature: Number,
});

// Definir un modelo basado en el esquema
const Weather = mongoose.model('Weather', weatherSchema, 'lugar');

// Endpoint para guardar datos del clima
app.post('/saveWeatherData', async (req, res) => {
  try {
    const { country, city, temperature } = req.body;

    console.log('Datos recibidos en el servidor:', req.body); // <-- Agregar esta línea para imprimir el cuerpo de la solicitud

    // Crear una nueva instancia del modelo Weather
    const newWeather = new Weather({
      country,
      city,       
      temperature,
    });

    // Guardar en la base de datos
    await newWeather.save();

    res.status(201).json({ message: 'Datos guardados en la base de datos' });
  } catch (error) {
    console.error('Error al guardar datos en la base de datos:', error);
    res.status(500).json({ error: 'Error al guardar datos en la base de datos' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
