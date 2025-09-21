// src/pages/Menu.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/menu.module.css';
import { addToCart } from '../lib/cart';

const PLACEHOLDER = '/images/pizzeImage/placeholder.webp';

// slug: minuscole, senza accenti, spazi -> -, & -> " e "
const slugify = (s = '') =>
  s.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const pathFromName = (name) => `/images/pizzeImage/${slugify(name)}.webp`;

// immagine risolta (solo .webp): prima eventuale URL DB, poi file locale, poi placeholder
const resolveImg = (p) => p.img_url || pathFromName(p.nome) || PLACEHOLDER;

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
    (async () => {
      try {
        const r = await fetch(`${base}/api/prodotti`);
        const ct = r.headers.get('content-type') || '';
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        if (!ct.includes('application/json')) throw new Error(`Expected JSON, got ${ct}`);
        const data = await r.json();
        setPizzas(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p) => {
    // salva nel carrello un URL stabile già risolto
    addToCart({ ...p, img: resolveImg(p) });
  };

  if (loading) return (
    <section className="container py-5">
      <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
      <p className="text-center">Caricamento…</p>
    </section>
  );
  if (err) return (
    <section className="container py-5">
      <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
      <p className="text-center text-danger">Errore: {err}</p>
    </section>
  );

  return (
    <section className="container py-5">
      <h1 className={`${styles.menuTitle} text-center mb-4`}>Il nostro Menu</h1>
      <h3 className={`${styles.descr} text-center mb-5`}>
        Otto pizze gourmet, stessa mano e stessa filosofia: ingredienti eccellenti,
        tecnica e equilibrio.
      </h3>

      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
        {pizzas.map((p) => {
          const src = resolveImg(p);
          return (
            <div className="col" key={p.id}>
              <div className="card h-100 bg-dark text-white border-light shadow">
                <div className="ratio ratio-1x1">
                  <img
                    src={src}
                    alt={p.nome}
                    loading="lazy"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      if (e.currentTarget.src !== location.origin + PLACEHOLDER) {
                        console.warn('IMG 404:', src, '->', PLACEHOLDER);
                        e.currentTarget.src = PLACEHOLDER;
                      }
                    }}
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
          );
        })}
        <div className="col d-none d-lg-block" />
      </div>
    </section>
  );
}
