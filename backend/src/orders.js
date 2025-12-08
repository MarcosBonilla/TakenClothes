import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

// Inicializar base de datos SQLite
let db;
(async () => {
  db = await open({
    filename: './orders.db',
    driver: sqlite3.Database
  });
  await db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT,
    email TEXT,
    contacto TEXT,
    producto TEXT,
    talla TEXT,
    cantidad INTEGER,
    pago TEXT,
    entrega TEXT,
    status TEXT
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto TEXT,
    talla TEXT,
    cantidad INTEGER
  )`);
})();

// Crear pedido
router.post('/', async (req, res) => {
  const { cliente, email, contacto, producto, talla, cantidad, pago, entrega, status } = req.body;
  // Verificar stock disponible
  const item = await db.get('SELECT * FROM stock WHERE producto = ? AND talla = ?', [producto, talla]);
  if (!item || item.cantidad < cantidad) {
    return res.status(400).json({ error: 'Stock insuficiente' });
  }
  // Descontar stock
  await db.run('UPDATE stock SET cantidad = cantidad - ? WHERE producto = ? AND talla = ?', [cantidad, producto, talla]);
  // Crear pedido
  const result = await db.run(
    'INSERT INTO orders (cliente, email, contacto, producto, talla, cantidad, pago, entrega, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [cliente, email, contacto, producto, talla, cantidad, pago, entrega, status]
  );
  res.json({ id: result.lastID });
});

// Listar pedidos
router.get('/', async (req, res) => {
  const orders = await db.all('SELECT * FROM orders');
  res.json(orders);
});

// Actualizar estado
router.put('/:id', async (req, res) => {
  let { status } = req.body;
  status = (status || 'pendiente').toLowerCase().trim();
  await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true });
});

// Filtrar por estado
router.get('/status/:status', async (req, res) => {
  const statusParam = req.params.status.toLowerCase();
  const orders = await db.all('SELECT * FROM orders WHERE LOWER(status) = ?', [statusParam]);
  res.json(orders);
});

// Consultar stock por producto y talle
router.get('/stock', async (req, res) => {
  const { producto } = req.query;
  let stock;
  if (producto) {
    stock = await db.all('SELECT * FROM stock WHERE producto = ?', [producto]);
  } else {
    stock = await db.all('SELECT * FROM stock');
  }
  res.json(stock);
});

// Endpoint para cargar stock manualmente
router.post('/stock', async (req, res) => {
  const { producto, talla, cantidad } = req.body;
  // Si ya existe, actualizar; si no, insertar
  const item = await db.get('SELECT * FROM stock WHERE producto = ? AND talla = ?', [producto, talla]);
  if (item) {
    await db.run('UPDATE stock SET cantidad = ? WHERE producto = ? AND talla = ?', [cantidad, producto, talla]);
  } else {
    await db.run('INSERT INTO stock (producto, talla, cantidad) VALUES (?, ?, ?)', [producto, talla, cantidad]);
  }
  res.json({ success: true });
});

// BORRAR TODOS LOS PEDIDOS (endpoint temporal)
router.delete('/all', async (req, res) => {
  await db.run('DELETE FROM orders');
  res.json({ success: true });
});

// BORRAR TODO EL STOCK (endpoint temporal)
router.delete('/stock/all', async (req, res) => {
  await db.run('DELETE FROM stock');
  res.json({ success: true });
});

export default router;
