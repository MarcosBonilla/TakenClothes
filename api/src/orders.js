import express from 'express';

const router = express.Router();

// Almacenamiento temporal en memoria con stock
// Simula la tabla stock de SQLite del backend original
let orders = [];
let stock = [
    { producto: 'Taken Azul', talla: 'XS/S', cantidad: 15 },
    { producto: 'Taken Azul', talla: 'M/L', cantidad: 20 },
    { producto: 'Taken Azul', talla: 'XL', cantidad: 12 },
    { producto: 'Taken Negra', talla: 'XS/S', cantidad: 10 },
    { producto: 'Taken Negra', talla: 'M/L', cantidad: 18 },
    { producto: 'Taken Negra', talla: 'XL', cantidad: 8 },
    { producto: 'Taken Rosa', talla: 'XS/S', cantidad: 14 },
    { producto: 'Taken Rosa', talla: 'M/L', cantidad: 16 },
    { producto: 'Taken Rosa', talla: 'XL', cantidad: 10 }
];

// GET /api/orders - Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// POST /api/orders - Crear nueva orden (igual que backend original)
router.post('/', async (req, res) => {
    try {
        const { cliente, email, contacto, producto, talla, cantidad, pago, entrega, status } = req.body;

        // Verificar stock disponible (igual que SELECT en SQLite)
        const item = stock.find(s => s.producto === producto && s.talla === talla);
        
        if (!item || item.cantidad < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Descontar stock (igual que UPDATE en SQLite)
        item.cantidad -= cantidad;

        // Crear pedido (igual que INSERT en SQLite)
        const newOrder = {
            id: orders.length + 1,
            cliente,
            email,
            contacto,
            producto,
            talla,
            cantidad,
            pago,
            entrega,
            status: status || 'pendiente'
        };

        orders.push(newOrder);

        res.json({ id: newOrder.id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// GET /api/orders/stock - Obtener stock actual (igual que backend original)
router.get('/stock', async (req, res) => {
    try {
        const { producto } = req.query;
        let result;
        
        if (producto) {
            // Filtrar por producto específico
            result = stock.filter(s => s.producto === producto);
        } else {
            // Devolver todo el stock
            result = stock;
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ error: 'Error al obtener stock' });
    }
});

// PUT /api/orders/:id - Actualizar estado de orden (igual que backend original)
router.put('/:id', async (req, res) => {
    try {
        let { status } = req.body;
        status = (status || 'pendiente').toLowerCase().trim();

        const order = orders.find(o => o.id === parseInt(req.params.id));
        
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        order.status = status;

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
});

// GET /api/orders/status/:status - Filtrar por estado (igual que backend original)
router.get('/status/:status', async (req, res) => {
    try {
        const statusParam = req.params.status.toLowerCase();
        const filtered = orders.filter(o => o.status?.toLowerCase() === statusParam);
        res.json(filtered);
    } catch (error) {
        console.error('Error filtering by status:', error);
        res.status(500).json({ error: 'Error al filtrar órdenes' });
    }
});

export default router;
