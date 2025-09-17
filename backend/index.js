// index.js (tuo, aggiornato)
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { authRouter } from './routes/auth.js';
import { shopRouter } from './routes/shop.js';
import { checkoutRouter } from './routes/checkout.js';
import { ordersRouter } from './routes/orders.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: false
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', shopRouter);
app.use('/api', checkoutRouter);
app.use('/api', ordersRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
