import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { authRouter } from './routes/auth.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: false
}));
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
