# Shop-dropping Backend

Backend Node.js + Express para gestionar pedidos de la tienda dropshipping.

## Endpoints principales

- `POST /orders` — Crear pedido
- `GET /orders` — Listar todos los pedidos
- `PUT /orders/:id` — Actualizar estado de pedido
- `GET /orders/status/:status` — Listar pedidos por estado

Base de datos: SQLite (archivo `orders.db`)

## Uso

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Accede a la API en `http://localhost:4000`

## Futuro
- Integración con pagos
- Autenticación para admin
- Mejoras en validación y seguridad
