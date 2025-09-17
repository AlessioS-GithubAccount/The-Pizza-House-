import React from 'react';
import styles from '../styles/menu.module.css';

const pizzas = [
  {
    name: 'Margherita DOP',
    price: 6,
    description:
      'San Marzano DOP, mozzarella di bufala campana, basilico, olio EVO biologico, sale di Cervia.',
    img: '/images/pizzeImage/Margherita%20DOP.webp',
  },
  {
    name: 'Tartufo & Porcini',
    price: 12,
    description:
      'Crema di tartufo nero, porcini freschi, scaglie di Parmigiano 36 mesi, olio al tartufo bianco.',
    img: '/images/pizzeImage/Tartufo%20&%20Porcini.webp',
  },
  {
    name: 'Bufala & Crudo di Parma',
    price: 11,
    description:
      'Fiordilatte, bufala a crudo, prosciutto di Parma 24 mesi, rucola baby, riduzione di balsamico.',
    img: '/images/pizzeImage/Bufala%20&%20Crudo%20di%20Parma.webp',
  },
  {
    name: 'Gambero Rosso e Burrata',
    price: 14,
    description:
      'Crema di zucchine e menta, gamberi rossi scottati, burrata pugliese, scorza di lime.',
    img: '/images/pizzeImage/Gambero%20Rosso%20e%20Burrata.webp',
  },
  {
    name: 'Fichi, Gorgonzola & Noci',
    price: 11,
    description:
      'Base bianca, gorgonzola dolce, fichi caramellati, noci, miele millefiori.',
    img: '/images/pizzeImage/Fichi,%20Gorgonzola%20&%20Noci.webp',
  },
  {
    name: 'Salsiccia & Friarielli con Provola',
    price: 10,
    description:
      'Crema di friarielli, salsiccia artigianale, provola affumicata, pecorino romano.',
    img: '/images/pizzeImage/Salsiccia%20&%20Friarielli%20con%20Provola.webp',
  },
  {
    name: 'Pera, Taleggio & Speck Croccante',
    price: 11,
    description:
      'Base di taleggio, pera caramellata, speck croccante, pepe rosa.',
    img: '/images/pizzeImage/Pera,%20Taleggio%20&%20Speck%20Croccante.webp',
  },
  {
    name: 'Mediterranea Gourmet',
    price: 10,
    description:
      'Pomodorini confit, alici del Cantabrico, capperi di Pantelleria, olive taggiasche, origano fresco.',
    img: '/images/pizzeImage/Mediterranea%20Gourmet.webp',
  },
];

export default function Menu() {
  // salva il carrello in localStorage, somma quantità se la pizza è già presente
  const handleAdd = (pizza) => {
    const key = 'cart';
    const raw = localStorage.getItem(key);
    const cart = raw ? JSON.parse(raw) : [];

    const idx = cart.findIndex((it) => it.id === pizza.name);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({
        id: pizza.name,
        name: pizza.name,
        price: pizza.price,
        img: pizza.img,
        qty: 1,
      });
    }
    localStorage.setItem(key, JSON.stringify(cart));
  };

  return (
    <section className="container py-5">
      <h1 className="text-center mb-4">Il nostro Menu</h1>
      <h3 className={`${styles.descr} text-center text-muted mb-5`}>
        Otto pizze gourmet, stessa mano e stessa filosofia: ingredienti eccellenti,
        tecnica e equilibrio.
      </h3>

      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
        {pizzas.map((p, idx) => (
          <div className="col" key={idx}>
            <div className="card h-100 bg-dark text-white border-light shadow">
              <div className="ratio ratio-1x1">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h4 className="card-title">{p.name}</h4>
                <p className="card-text flex-grow-1">{p.description}</p>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <span className="fw-bold">€ {p.price.toFixed(2)}</span>
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
        {/* Spaziatore per allineamento su desktop */}
        <div className="col d-none d-lg-block" />
      </div>
    </section>
  );
}
