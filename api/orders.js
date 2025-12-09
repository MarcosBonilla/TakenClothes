const express = require('express');
const router = express.Router();

// Almacenamiento temporal en memoria (en producción usar Vercel KV o Postgres)
let orders = [];

// Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        console.log('📊 Fetching all orders...');
        res.json(orders);
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// Crear nueva orden
router.post('/', async (req, res) => {
    try {
        const { customerName, email, phone, address, city, items, total, paymentMethod, paymentId } = req.body;
        
        console.log('📝 Creating new order:', { customerName, email, total });

        const newOrder = {
            id: orders.length + 1,
            customerName,
            email,
            phone,
            address,
            city,
            items: JSON.stringify(items),
            total,
            paymentMethod,
            paymentId,
            status: 'pendiente',
            created_at: new Date().toISOString()
        };

        orders.push(newOrder);

        console.log('✅ Order created successfully');
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// Actualizar estado de orden
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`📝 Updating order ${id} to status: ${status}`);

        const orderIndex = orders.findIndex(o => o.id === parseInt(id));
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        orders[orderIndex].status = status;

        console.log('✅ Order updated successfully');
        res.json(orders[orderIndex]);
    } catch (error) {
        console.error('❌ Error updating order:', error);
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
});

module.exports = router;
