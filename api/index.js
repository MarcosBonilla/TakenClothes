import express from 'express';
import cors from 'cors';
import ordersRouter from './src/orders.js';
import mercadopagoRouter from './src/mercadopago.js';

const app = express();

// CORS configurado para Hostinger
app.use(cors({
    origin: [
        'https://moccasin-bear-830047.hostingersite.com',
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Shop-dropping backend running on Vercel',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/orders', ordersRouter);
app.use('/mercadopago', mercadopagoRouter);

// Export for Vercel
export default app;
