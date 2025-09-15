import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

export const authRouter = express.Router();

const { JWT_SECRET, JWT_EXPIRES = '15m' } = process.env;
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// post effettua una registrazione user (verifica campi, email lowercase-trim, hashPassword, verifica JWT)
authRouter.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body || {};

    // normalizza email
    const normalizedEmail = String(email || '').trim().toLowerCase();

    //  verifica nome cognome validi
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ message: 'Il nome completo è obbligatorio' });
    }

    //validazione email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(normalizedEmail)) {
      return res.status(422).json({ message: 'Email non valida' });
    }

    if (String(password || '').length < 8) {
      return res.status(422).json({ message: 'La password deve avere almeno 8 caratteri' });
    }

    // verifica se email è gia in db
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Email già registrata' });
    }

    // hash e insert password
    const password_hash = await bcrypt.hash(String(password), 12);
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role, is_active)
       VALUES (?, ?, ?, ?, 'client', 1)`,
      [full_name.trim(), normalizedEmail, password_hash, phone || null]
    );

    const userId = result.insertId;
    const token = signAccessToken({ id: userId, email: normalizedEmail, role: 'client' });

    return res.status(201).json({
      token,
      user: { id: userId, full_name: full_name.trim(), email: normalizedEmail, role: 'client' }
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});



//post effettua una login user (verifica campi inseriti con record db/users, presenza row-account, attivazione token)
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await pool.query(
      'SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = ?',
      [normalizedEmail]
    );
    if (!rows.length) return res.status(401).json({ message: 'Credenziali non valide' });

    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ message: 'Account disabilitato' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Credenziali non valide' });

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('LOGIN ERROR', err);
    res.status(500).json({ message: 'Errore server' });
  }
});
