const { getDatabase, initDatabase } = require('./db-mysql');

async function createSampleData() {
    console.log('🎯 Creating sample data...');
    
    try {
        await initDatabase();
        const db = await getDatabase();
        
        // Datos de órdenes de prueba
        const sampleOrders = [
            {
                customer_name: 'Ana García',
                customer_email: 'ana.garcia@email.com',
                customer_phone: '+598 99 123 456',
                customer_address: 'Av. 18 de Julio 1234, Montevideo',
                items: [
                    {
                        id: 'campera-azul',
                        name: 'Campera Azul Oversize',
                        price: 89.99,
                        quantity: 1,
                        size: 'M'
                    }
                ],
                total_amount: 89.99,
                payment_method: 'paypal',
                payment_id: 'PAYPAL123456',
                status: 'confirmado'
            },
            {
                customer_name: 'Carlos Rodríguez',
                customer_email: 'carlos.rodriguez@email.com',
                customer_phone: '+598 91 234 567',
                customer_address: 'Bvar. España 567, Montevideo',
                items: [
                    {
                        id: 'campera-negra',
                        name: 'Campera Negra Premium',
                        price: 94.99,
                        quantity: 2,
                        size: 'L'
                    }
                ],
                total_amount: 189.98,
                payment_method: 'mercadopago',
                payment_id: 'MP789012',
                status: 'enviado'
            },
            {
                customer_name: 'María Fernández',
                customer_email: 'maria.fernandez@email.com',
                customer_phone: '+598 92 345 678',
                customer_address: 'Pocitos 890, Montevideo',
                items: [
                    {
                        id: 'campera-rosa',
                        name: 'Campera Rosa Tendencia',
                        price: 84.99,
                        quantity: 1,
                        size: 'S'
                    }
                ],
                total_amount: 84.99,
                payment_method: 'paypal',
                payment_id: 'PAYPAL234567',
                status: 'pendiente'
            },
            {
                customer_name: 'Diego Martínez',
                customer_email: 'diego.martinez@email.com',
                customer_phone: '+598 93 456 789',
                customer_address: 'Malvín Norte 123, Montevideo',
                items: [
                    {
                        id: 'campera-azul',
                        name: 'Campera Azul Oversize',
                        price: 89.99,
                        quantity: 1,
                        size: 'XL'
                    },
                    {
                        id: 'campera-negra',
                        name: 'Campera Negra Premium',
                        price: 94.99,
                        quantity: 1,
                        size: 'L'
                    }
                ],
                total_amount: 184.98,
                payment_method: 'mercadopago',
                payment_id: 'MP345678',
                status: 'entregado'
            },
            {
                customer_name: 'Sofia López',
                customer_email: 'sofia.lopez@email.com',
                customer_phone: '+598 94 567 890',
                customer_address: 'Carrasco Norte 456, Canelones',
                items: [
                    {
                        id: 'campera-rosa',
                        name: 'Campera Rosa Tendencia',
                        price: 84.99,
                        quantity: 3,
                        size: 'M'
                    }
                ],
                total_amount: 254.97,
                payment_method: 'paypal',
                payment_id: 'PAYPAL345678',
                status: 'confirmado'
            }
        ];
        
        // Insertar órdenes
        for (let i = 0; i < sampleOrders.length; i++) {
            const order = sampleOrders[i];
            console.log(`📦 Creating order ${i + 1}: ${order.customer_name}`);
            
            const [result] = await db.execute(`
                INSERT INTO orders 
                (customer_name, customer_email, customer_phone, customer_address, 
                 items, total_amount, payment_method, payment_id, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                order.customer_name,
                order.customer_email,
                order.customer_phone,
                order.customer_address,
                JSON.stringify(order.items),
                order.total_amount,
                order.payment_method,
                order.payment_id,
                order.status
            ]);
            
            console.log(`✅ Order created with ID: ${result.insertId}`);
        }
        
        // Verificar datos creados
        const [orders] = await db.execute('SELECT COUNT(*) as total FROM orders');
        console.log(`\n✅ Sample data created successfully!`);
        console.log(`📊 Total orders in database: ${orders[0].total}`);
        
        // Mostrar resumen por estado
        const [statusSummary] = await db.execute(`
            SELECT status, COUNT(*) as count 
            FROM orders 
            GROUP BY status 
            ORDER BY count DESC
        `);
        
        console.log('\n📈 Orders by status:');
        statusSummary.forEach(row => {
            console.log(`   ${row.status}: ${row.count} orders`);
        });
        
        await db.end();
        console.log('\n🎉 Database populated successfully!');
        
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
        process.exit(1);
    }
}

createSampleData();