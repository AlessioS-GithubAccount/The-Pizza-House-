// src/pages/Menu.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/menu.module.css';
import { addToCart } from '../lib/cart';

// Fallback immagini locali (opzionale)
const imgByName = {
  'Margherita DOP': '/images/pizzeImage/Margherita%20DOP.webp',
  'Tartufo & Porcini': '/images/pizzeImage/Tartufo%20&%20Porcini.webp',
  'Bufala & Crudo di Parma': '/images/pizzeImage/Bufala%20&%20Crudo%20di%20Parma.webp',
  'Gambero Rosso e Burrata': '/images/pizzeImage/Gambero%20Rosso%20e%20Burrata.webp',
  'Fichi, Gorgonzola & Noci': '/images/pizzeImage/Fichi,%20Gorgonzola%20&%20Noci.webp',
  'Salsiccia & Friarielli con Provola': '/images/pizzeImage/Salsiccia%20&%20Friarielli%20con%20Provola.webp',
  'Pera, Taleggio & Speck Croccante': '/images/pizzeImage/Pera,%20Taleggio%20&%20Speck%20Croccante.webp',
  'Mediterranea Gourmet': '/images/pizzeImage/Mediterranea%20Gourmet.webp',
};

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
    const url = `${base}/api/prodotti`;
    (async () => {
      try {
        console.log('GET', url);
        const r = await fetch(url);
        const ct = r.headers.get('content-type') || '';
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        if (!ct.includes('application/json')) {
          const text = await r.text();
          throw new Error(`Expected JSON, got ${ct}. First 200: ${text.slice(0, 200)}`);
        }
        const data = await r.json();
        setPizzas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p) => {
    // Usa il mini-store: normalizza e notifica gli altri componenti (Navbar/Cart)
    addToCart(p);
  };

  if (loading) {
    return (
      <section className="container py-5">
        <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
        <p className="text-center">Caricamento…</p>
      </section>
    );
  }
  if (err) {
    return (
      <section className="container py-5">
        <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
        <p className="text-center text-danger">Errore: {err}</p>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
      <h3 className={`${styles.descr} text-center mb-5`}>
        Otto pizze gourmet, stessa mano e stessa filosofia: ingredienti eccellenti,
        tecnica e equilibrio.
      </h3>

      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
        {pizzas.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 bg-dark text-white border-light shadow">
              <div className="ratio ratio-1x1">
                <img
                  src={p.img_url || imgByName[p.nome] || '/images/pizzeImage/placeholder.webp'}
                  alt={p.nome}
                  loading="lazy"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h4 className="card-title">{p.nome}</h4>
                <p className="card-text flex-grow-1">{p.descrizione}</p>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <span className="fw-bold">€ {Number(p.prezzo).toFixed(2)}</span>
                  <button
                    className={`${styles.btnAdd} btn btn-sm`}
                    type="button"
                    onClick={() => handleAdd(p)}
                  >
                    Aggiungi +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="col d-none d-lg-block" />
      </div>
    </section>
  );
}
