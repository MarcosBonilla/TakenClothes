const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://moccasin-bear-830047.hostingersite.com',
    credentials: true
}));

app.use(express.json());

// Test de conexión
app.get('/api/', (req, res) => {
    res.json({
        message: 'Shop-dropping API funcionando en Vercel!',
        timestamp: new Date().toISOString(),
        status: 'online'
    });
});

// Importar rutas de órdenes
const ordersRouter = require('./orders');
app.use('/api/orders', ordersRouter);

// Para Vercel - exportar la app como serverless function
module.exports = app;
