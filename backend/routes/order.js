// routes/orders.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

export const ordersRouter = express.Router();
const { JWT_SECRET } = process.env;

function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token mancante' });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, role: payload.role || 'client', email: payload.email || null };
    next();
  } catch {
    return res.status(401).json({ message: 'Token non valido' });
  }
}

// GET /api/ordini/:id
ordersRouter.get('/ordini/:id', requireAuth, async (req, res) => {
  const ordineId = Number(req.params.id);
  if (!ordineId) return res.status(400).json({ message: 'ID ordine non valido' });

  try {
    const [ord] = await pool.query(
      `SELECT o.id, o.user_id, o.stato, o.totale, o.creato_il,
              o.indirizzo_via, o.indirizzo_civico, o.cap, o.citta, o.provincia, o.note_consegna, o.note
       FROM ordini o
       WHERE o.id = ?`,
      [ordineId]
    );
    if (ord.length === 0) return res.status(404).json({ message: 'Ordine non trovato' });
    if (ord[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    const [righe] = await pool.query(
      `SELECT ao.prodotto_id, p.nome, ao.quantita, ao.prezzo_unitario, ao.note
       FROM articoli_ordine ao
       JOIN prodotti p ON p.id = ao.prodotto_id
       WHERE ao.ordine_id = ?
       ORDER BY ao.id ASC`,
      [ordineId]
    );

    res.json({ ordine: ord[0], items: righe });
  } catch (err) {
    console.error('GET /api/ordini/:id error:', err);
    res.status(500).json({ message: 'Errore nel recupero ordine' });
  }
});
