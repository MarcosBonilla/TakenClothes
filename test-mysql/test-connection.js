const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔌 Testing MySQL connection...');
    
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    };
    
    console.log('Config:', {
        host: config.host,
        user: config.user,
        database: config.database,
        port: config.port,
        password: config.password ? '***' : 'NOT SET'
    });
    
    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connection successful!');
        
        // Test query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Test query successful:', rows);
        
        // Check if orders table exists
        const [tables] = await connection.execute('SHOW TABLES LIKE "orders"');
        console.log('📋 Orders table exists:', tables.length > 0);
        
        await connection.end();
        console.log('✅ Connection closed');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();