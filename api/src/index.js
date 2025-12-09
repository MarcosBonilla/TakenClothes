
import express from 'express';
import cors from 'cors';
import ordersRouter from './orders.js';
import mercadopagoRouter from './mercadopago.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use('/orders', ordersRouter);
app.use('/mercadopago', mercadopagoRouter);

app.get('/', (req, res) => {
  res.send('Shop-dropping backend running');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
