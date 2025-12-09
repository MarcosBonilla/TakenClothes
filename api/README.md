# Backend API - Shop Dropshipping

Backend completo con MySQL para el shop dropshipping.

## 🗄️ Base de Datos: MySQL

**Conexión:** Hostinger MySQL
- Host: `srv1233.hstgr.io`
- Database: `u740606087_takenclothes`
- Puerto: 3306

## 📦 Estructura

```
api/
├── package.json           # Dependencias
├── .env                   # Variables desarrollo
├── .env.production        # Variables producción
└── src/
    ├── app.js            # Servidor principal
    ├── db.js             # MySQL connection
    ├── orders.js         # CRUD de órdenes
    ├── paypal.js         # Integración PayPal
    └── mercadopago.js    # Integración MercadoPago
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔌 APIs Disponibles

### Orders API
- `GET /api/orders` - Obtener todas las órdenes
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders/:id` - Obtener orden específica
- `PUT /api/orders/:id/status` - Actualizar estado de orden

### PayPal API
- `POST /api/paypal/create-order` - Crear orden PayPal
- `POST /api/paypal/capture-order` - Capturar pago PayPal

### MercadoPago API
- `POST /api/mercadopago/create-preference` - Crear preferencia de pago
- `GET /api/mercadopago/payment/:id` - Verificar estado de pago

## 🗃️ Tabla Orders

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_id VARCHAR(255),
    status ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## 🔧 Variables de Entorno

### Desarrollo (.env)
```env
NODE_ENV=development
PORT=4002
DB_HOST=srv1233.hstgr.io
DB_USER=u740606087_marcosbonilla1
DB_PASSWORD=Marto013.
DB_NAME=u740606087_takenclothes
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

### Producción (.env.production)
```env
NODE_ENV=production
PORT=3000
DB_HOST=srv1233.hstgr.io
DB_USER=u740606087_marcosbonilla1
DB_PASSWORD=Marto013.
DB_NAME=u740606087_takenclothes
DB_PORT=3306
FRONTEND_URL=https://tudominio.com
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
PAYPAL_BASE_URL=https://api-m.paypal.com
```

## 🎯 Deploy en Hostinger

1. **Subir carpeta api/ completa al repo**
2. **Node.js App Manager:**
   - App Root: `/api`
   - Startup File: `src/app.js`
   - Node Version: 20.x
3. **Variables de entorno:** Configurar en panel
4. **Terminal Hostinger:**
   ```bash
   cd /api
   npm install
   ```

## ✅ Testing Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Probar APIs
curl http://localhost:4002/api/
curl http://localhost:4002/api/orders
```

## 🔄 Migración desde SQLite

Los datos ya fueron migrados exitosamente a MySQL.
Todas las funcionalidades mantienen compatibilidad total.