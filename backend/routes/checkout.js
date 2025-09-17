// routes/checkout.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

export const checkoutRouter = express.Router();

const { JWT_SECRET } = process.env;

// Mini middleware JWT inline
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

// POST /api/checkout
checkoutRouter.post('/checkout', requireAuth, async (req, res) => {
  const { note, indirizzo, items } = req.body || {};
  const userId = req.user?.id;

  // Validazioni minime
  if (!userId) return res.status(401).json({ message: 'Non autenticato' });
  if (!indirizzo || !indirizzo.via || !indirizzo.cap || !indirizzo.citta || !indirizzo.provincia) {
    return res.status(422).json({ message: 'Indirizzo incompleto' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(422).json({ message: 'Nessun articolo nel carrello' });
  }

  const normalized = items.map(it => ({
    prodotto_id: Number(it.prodotto_id),
    quantita: Math.max(1, parseInt(it.quantita, 10) || 1),
    note: it.note ? String(it.note).slice(0, 255) : null
  }));
  const productIds = [...new Set(normalized.map(i => i.prodotto_id))];

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1) crea testata ordine
    const [ordRes] = await conn.execute(
      `INSERT INTO ordini
       (user_id, stato, totale, note, indirizzo_via, indirizzo_civico, cap, citta, provincia, note_consegna)
       VALUES (?, 'in_attesa', 0.00, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        note || null,
        indirizzo.via,
        indirizzo.civico || null,
        indirizzo.cap,
        indirizzo.citta,
        indirizzo.provincia,
        indirizzo.note_consegna || null
      ]
    );
    const ordineId = ordRes.insertId;

    // 2) recupero prezzi/disponibilità
    const placeholders = productIds.map(() => '?').join(',');
    const [prodRows] = await conn.query(
      `SELECT id, prezzo, disponibile
       FROM prodotti
       WHERE id IN (${placeholders})`,
      productIds
    );
    const prezzoById = new Map(prodRows.map(p => [p.id, { prezzo: p.prezzo, disponibile: p.disponibile }]));

    // verifica prodotti validi e disponibili
    for (const it of normalized) {
      const info = prezzoById.get(it.prodotto_id);
      if (!info) {
        await conn.rollback();
        return res.status(422).json({ message: `Prodotto ${it.prodotto_id} inesistente` });
      }
      if (!info.disponibile) {
        await conn.rollback();
        return res.status(422).json({ message: `Prodotto ${it.prodotto_id} non disponibile` });
      }
    }

    // 3) righe d'ordine con snapshot prezzo
    const values = [];
    const params = [];
    for (const it of normalized) {
      const snap = prezzoById.get(it.prodotto_id);
      values.push('(?, ?, ?, ?, ?)');
      params.push(ordineId, it.prodotto_id, it.quantita, snap.prezzo, it.note);
    }
    await conn.execute(
      `INSERT INTO articoli_ordine
       (ordine_id, prodotto_id, quantita, prezzo_unitario, note)
       VALUES ${values.join(',')}`,
      params
    );

    // 4) ricalcolo totale
    await conn.execute(
      `UPDATE ordini o
       JOIN (
         SELECT ordine_id, SUM(quantita * prezzo_unitario) AS tot
         FROM articoli_ordine
         WHERE ordine_id = ?
       ) t ON t.ordine_id = o.id
       SET o.totale = t.tot`,
      [ordineId]
    );

    await conn.commit();

    // risposta finale
    const [orderRow] = await conn.query(
      `SELECT id, stato, totale, creato_il
       FROM ordini WHERE id = ?`,
      [ordineId]
    );

    res.status(201).json({
      ordine_id: ordineId,
      stato: orderRow[0]?.stato,
      totale: orderRow[0]?.totale,
      creato_il: orderRow[0]?.creato_il
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('POST /api/checkout error:', err);
    res.status(500).json({ message: 'Errore durante il checkout' });
  } finally {
    if (conn) conn.release();
  }
});
