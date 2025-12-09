const express = require('express');
const { getDatabase } = require('./db');
const router = express.Router();

// Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        console.log('📊 Fetching all orders...');
        const db = await getDatabase();
        const [rows] = await db.execute(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );
        console.log(`✅ Found ${rows.length} orders`);
        
        // Parsear JSON items
        const orders = rows.map(order => ({
            ...order,
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }));
        
        res.json(orders);
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders', details: error.message });
    }
});

// Crear nueva orden
router.post('/', async (req, res) => {
    try {
        console.log('📝 Creating new order...', req.body);
        
        const {
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            items,
            total_amount,
            payment_method,
            payment_id
        } = req.body;

        // Validaciones básicas
        if (!customer_name || !customer_email || !items || !total_amount || !payment_method) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['customer_name', 'customer_email', 'items', 'total_amount', 'payment_method']
            });
        }

        const db = await getDatabase();
        const [result] = await db.execute(`
            INSERT INTO orders 
            (customer_name, customer_email, customer_phone, customer_address, 
             items, total_amount, payment_method, payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')
        `, [
            customer_name,
            customer_email,
            customer_phone || null,
            customer_address || null,
            JSON.stringify(items),
            parseFloat(total_amount),
            payment_method,
            payment_id || null
        ]);

        const newOrder = {
            id: result.insertId,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            items,
            total_amount: parseFloat(total_amount),
            payment_method,
            payment_id,
            status: 'pendiente',
            created_at: new Date(),
            updated_at: new Date()
        };

        console.log(`✅ Order created with ID: ${result.insertId}`);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ error: 'Error creating order', details: error.message });
    }
});

// Actualizar estado de orden
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log(`🔄 Updating order ${id} status to: ${status}`);
        
        const validStatuses = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status',
                validStatuses
            });
        }

        const db = await getDatabase();
        const [result] = await db.execute(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log(`✅ Order ${id} status updated to: ${status}`);
        res.json({ message: 'Status updated successfully', orderId: id, newStatus: status });
    } catch (error) {
        console.error('❌ Error updating order status:', error);
        res.status(500).json({ error: 'Error updating order status', details: error.message });
    }
});

// Obtener orden específica
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const [rows] = await db.execute(
            'SELECT * FROM orders WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = {
            ...rows[0],
            items: typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items
        };

        res.json(order);
    } catch (error) {
        console.error('❌ Error fetching order:', error);
        res.status(500).json({ error: 'Error fetching order', details: error.message });
    }
});

module.exports = router;