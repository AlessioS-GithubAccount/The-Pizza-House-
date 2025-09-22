// server/index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Stripe from 'stripe';

import { authRouter } from './routes/auth.js';
import { shopRouter } from './routes/shop.js';
import { checkoutRouter } from './routes/checkout.js';
import { ordersRouter } from './routes/order.js';

const app = express();

// --- Middleware base ---
app.use(cors());

// piccolo logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// parser JSON (se in futuro aggiungi webhook Stripe con raw body, servirà un handler dedicato)
app.use(express.json());

// --- ROUTES APP ---
app.use('/api/auth', authRouter);
app.use('/api', shopRouter);
app.use('/api', checkoutRouter);
app.use('/api', ordersRouter);

// --- STRIPE: PaymentIntent (TEST) ---
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe =
  stripeSecret
    ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
    : null;

/**
 * Crea un PaymentIntent in EUR.
 * Body atteso: { amount: <cent>, currency: 'EUR', metadata?: {...} }
 * NB: amount in **cent** (es. €12,34 -> 1234)
 */
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe non configurato: manca STRIPE_SECRET_KEY' });
    }

    const { amount, currency = 'EUR', metadata = {} } = req.body || {};

    if (!Number.isFinite(amount) || amount < 50) {
      // minimo 0,50€ in cent
      return res.status(400).json({ error: 'Importo non valido (min 50 centesimi)' });
    }

    const pi = await stripe.paymentIntents.create({
      amount: Math.floor(amount),
      currency,
      automatic_payment_methods: { enabled: true }, // abilita carte + 3DS2 in test
      metadata
    });

    return res.json({ clientSecret: pi.client_secret });
  } catch (err) {
    console.error('Stripe PI error:', err);
    return res.status(500).json({ error: err.message || 'Errore creazione PaymentIntent' });
  }
});

// gestione 404 JSON per qualsiasi rotta API non trovata
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
