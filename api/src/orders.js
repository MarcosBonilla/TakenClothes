import express from 'express';

const router = express.Router();

// Almacenamiento temporal en memoria con stock
let orders = [];
let stock = {
    'campera-azul': { S: 10, M: 15, L: 12, XL: 8 },
    'campera-negra': { S: 8, M: 10, L: 10, XL: 6 },
    'campera-rosa': { S: 12, M: 14, L: 11, XL: 7 }
};

// GET /api/orders - Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// POST /api/orders - Crear nueva orden
router.post('/', async (req, res) => {
    try {
        const { cliente, email, contacto, producto, talla, cantidad, pago, entrega, status } = req.body;

        // Verificar stock disponible
        if (!stock[producto] || !stock[producto][talla]) {
            return res.status(400).json({ error: 'Producto o talla no encontrados' });
        }

        if (stock[producto][talla] < cantidad) {
            return res.status(400).json({ 
                error: 'Stock insuficiente', 
                disponible: stock[producto][talla] 
            });
        }

        // Descontar stock
        stock[producto][talla] -= cantidad;

        // Crear pedido
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
            status: status || 'pendiente',
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);

        res.json({ 
            id: newOrder.id,
            message: 'Orden creada exitosamente',
            stockRestante: stock[producto][talla]
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// GET /api/orders/stock - Obtener stock actual
router.get('/stock', async (req, res) => {
    try {
        res.json(stock);
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ error: 'Error al obtener stock' });
    }
});

// PUT /api/orders/:id - Actualizar estado de orden
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const orderIndex = orders.findIndex(o => o.id === parseInt(id));
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();

        res.json(orders[orderIndex]);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
});

export default router;
