// routes/shop.js
import express from 'express';
import { pool } from '../db/pool.js';

export const shopRouter = express.Router();

// GET /api/prodotti
shopRouter.get('/prodotti', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nome, descrizione, prezzo, disponibile
       FROM prodotti
       WHERE disponibile = 1
       ORDER BY nome ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/prodotti error:', err);
    res.status(500).json({ message: 'Errore server nel recupero prodotti' });
  }
});
