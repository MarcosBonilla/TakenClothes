import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const productos = [
  { nombre: 'Taken Azul', talles: ['XS/S', 'M/L', 'XL'] },
  { nombre: 'Taken Negra', talles: ['XS/S', 'M/L', 'XL'] },
  { nombre: 'Taken Rosa', talles: ['XS/S', 'M/L', 'XL'] }
];

(async () => {
  const db = await open({ filename: './orders.db', driver: sqlite3.Database });
  await db.run('DELETE FROM stock');
  for (const prod of productos) {
    for (const talle of prod.talles) {
      const cantidad = Math.floor(Math.random() * 16) + 10; // 10 a 25
      await db.run('INSERT INTO stock (producto, talla, cantidad) VALUES (?, ?, ?)', [prod.nombre, talle, cantidad]);
      console.log(`${prod.nombre} - ${talle}: ${cantidad}`);
    }
  }
  await db.close();
  console.log('Stock simulado cargado.');
})();
