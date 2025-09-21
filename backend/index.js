import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { authRouter } from './routes/auth.js';
import { shopRouter } from './routes/shop.js';
import { checkoutRouter } from './routes/checkout.js';
import { ordersRouter } from './routes/order.js';

const app = express(); 

app.use(cors());                 


app.use((req, _res, next) => { 
  console.log(`${req.method} ${req.url}`); 
  next(); 
});

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', shopRouter);
app.use('/api', checkoutRouter);
app.use('/api', ordersRouter);

// gestione 404 JSON per qualsiasi rotta API non trovata 
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
