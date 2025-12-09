import express from 'express';
import cors from 'cors';
import ordersRouter from './src/orders.js';
import mercadopagoRouter from './src/mercadopago.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/', (req, res) => {
    res.json({
        message: 'Shop-dropping backend running on Vercel',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/mercadopago', mercadopagoRouter);

// Export for Vercel
export default app;
