const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db-mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Test de conexión
app.get('/api/', (req, res) => {
    res.json({ 
        message: 'Shop-dropping MySQL API funcionando!',
        timestamp: new Date().toISOString(),
        database: 'MySQL'
    });
});

// Importar rutas de órdenes
const ordersRouter = require('./orders-mysql');
app.use('/api/orders', ordersRouter);

// Inicializar base de datos y servidor
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Backend MySQL listening on port ${PORT}`);
            console.log(`📊 Test URL: http://localhost:${PORT}/api/`);
            console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();