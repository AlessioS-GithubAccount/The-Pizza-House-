// src/components/Cart.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/cart.module.css';
import { readCart, setQty as setQtyStore, removeFromCart, clearCart } from '../lib/cart';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const SHIPPING_FEE = 3.5;
const PLACEHOLDER = '/images/pizzeImage/placeholder.webp';

// ENV (Vite o CRA)
const STRIPE_PK =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) ||
  '';

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
  ''; // fallback: usa proxy /api in dev

const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;

export default function Cart() {
  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <CartInner />
    </Elements>
  ) : (
    <NoStripeFallback />
  );
}

function NoStripeFallback() {
  return (
    <section className="container py-5">
      <h1 className="text-center mb-4">Il tuo carrello</h1>
      <div className="alert alert-danger">
        <strong>Stripe non è configurato.</strong> Imposta la publishable key in <code>.env</code> come{' '}
        <code>VITE_STRIPE_PUBLISHABLE_KEY</code> (Vite) oppure <code>REACT_APP_STRIPE_PUBLISHABLE_KEY</code> (CRA) e
        riavvia il dev server.
      </div>
    </section>
  );
}

function CartInner() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [items, setItems] = useState(() => readCart());
  const [clientSecret, setClientSecret] = useState(null);
  const [piError, setPiError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const reload = () => setItems(readCart());
    reload();
    window.addEventListener('cart:updated', reload);
    const onStorage = (e) => { if (e.key === 'cart') reload(); };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cart:updated', reload);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setQty = (id, qty) => {
    setQtyStore(id, qty);
    setItems(readCart());
  };

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );
  const total = useMemo(() => (items.length ? subtotal + SHIPPING_FEE : 0), [subtotal, items]);

  const currency = (n) =>
    n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

  const [delivery, setDelivery] = useState({
    full_name: '',
    address: '',
    cap: '',
    city: '',
    phone: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const removeItem = (id) => {
    removeFromCart(id);
    setItems(readCart());
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDelivery((d) => ({ ...d, [name]: value }));
  };

  // Validazione solo dati spedizione (i dati carta li gestisce Stripe)
  const validate = () => {
    const errs = {};
    if (!delivery.full_name.trim()) errs.full_name = 'Nome e cognome obbligatori';
    if (!delivery.address.trim()) errs.address = 'Indirizzo obbligatorio';
    if (!/^\d{5}$/.test(delivery.cap)) errs.cap = 'CAP non valido (5 cifre)';
    if (!delivery.city.trim()) errs.city = 'Città obbligatoria';
    if (!/^\+?\d[\d\s\-]{5,}$/.test(delivery.phone)) errs.phone = 'Telefono non valido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Crea un PaymentIntent sul server e restituisce il client_secret
  const createPaymentIntent = async (amountEuro) => {
    setPiError('');
    const urlBase = (API_BASE || '').replace(/\/$/, '');
    const res = await fetch(`${urlBase}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(amountEuro * 100), // in cent
        currency: 'EUR',
        metadata: {
          cart_items: items.map(i => `${i.name}x${i.qty}`).join(', ')
        }
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.clientSecret) {
      throw new Error(data.error || 'Errore nella creazione del PaymentIntent');
    }
    setClientSecret(data.clientSecret);
    return data.clientSecret;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!items.length) {
      alert('Il carrello è vuoto. Vai al menu per aggiungere prodotti.');
      return;
    }
    if (!validate()) return;

    if (!stripe || !elements) return;

    setPaying(true);
    try {
      // crea PI se non esiste già o se l’importo è cambiato
      const cs = await createPaymentIntent(total);

      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Campo carta non inizializzato');

      const { error, paymentIntent } = await stripe.confirmCardPayment(cs, {
        payment_method: {
          card,
          billing_details: {
            name: delivery.full_name,
            phone: delivery.phone
          }
        },
        shipping: {
          name: delivery.full_name,
          phone: delivery.phone,
          address: {
            line1: delivery.address,
            postal_code: delivery.cap,
            city: delivery.city,
            country: 'IT'
          }
        }
      });

      if (error) {
        setPiError(error.message || 'Pagamento rifiutato');
        setPaying(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const order = {
          items,
          delivery,
          payment: {
            method: 'stripe',
            last4: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '****'
          },
          amounts: { subtotal, shipping: SHIPPING_FEE, total },
          created_at: new Date().toISOString(),
          stripe_pi: paymentIntent.id
        };
        localStorage.setItem('last_order', JSON.stringify(order));
        clearCart();
        setItems(readCart());
        setPaying(false);
        alert('Pagamento riuscito! Ordine confermato (test).');
        navigate('/');
        return;
      }

      setPiError('Pagamento non completato.');
    } catch (err) {
      setPiError(err.message || 'Errore di pagamento');
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="container py-5">
      <h1 className="text-center mb-4">Il tuo carrello</h1>

      {!items.length ? (
        <div className="text-center">
          <p className="text-muted mb-4">Il carrello è vuoto.</p>
          <Link to="/menu" className="btn btn-warning">
            Vai al menu
          </Link>
        </div>
      ) : (
        <form onSubmit={placeOrder}>
          {/* Allinea tutte le colonne al top */}
          <div className="row g-4 align-items-start">
            {/* 1) Colonna: Riepilogo ordine (PRIMA) */}
            <div className="col-12 col-lg-5">
              <div className={`card shadow-sm ${styles.panel}`}>
                <div className="card-body">
                  <h4 className={`${styles.titleOrder} mb-3`}>Riepilogo ordine</h4>
                  <ul className={`list-group list-group-flush ${styles.orderList}`}>
                    {items.map((it) => (
                      <li key={it.id} className={`list-group-item ${styles.orderListItem}`}>
                        <div className="d-flex align-items-center">
                          <img
                            src={it.img || PLACEHOLDER}
                            alt={it.name}
                            width="64"
                            height="64"
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                            className="me-3"
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{it.name}</strong>
                              <span>{currency(it.price * it.qty)}</span>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <div className="btn-group" role="group" aria-label="qty">
                                <button
                                  type="button"
                                  className="btn btn-outline-light btn-sm"
                                  onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                                >
                                  −
                                </button>
                                <span className="btn btn-outline-light btn-sm disabled">
                                  {it.qty}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-outline-light btn-sm"
                                  onClick={() => setQty(it.id, it.qty + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className="btn btn-link text-danger ms-3 p-0"
                                onClick={() => removeItem(it.id)}
                              >
                                Rimuovi
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 2) Colonna: Dati consegna (SECONDA) */}
            <div className="col-12 col-lg-4">
              <div className={`card shadow-sm ${styles.panel}`}>
                <div className="card-body">
                  <h4 className={`${styles.titleOrder} mb-3`}>Dati per la consegna</h4>
                  <div className="mb-3">
                    <label className="form-label">Nome e Cognome</label>
                    <input
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      name="full_name"
                      value={delivery.full_name}
                      onChange={handleDeliveryChange}
                    />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Indirizzo</label>
                    <input
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={delivery.address}
                      onChange={handleDeliveryChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">CAP</label>
                      <input
                        className={`form-control ${errors.cap ? 'is-invalid' : ''}`}
                        name="cap"
                        value={delivery.cap}
                        onChange={handleDeliveryChange}
                        maxLength={5}
                      />
                      {errors.cap && <div className="invalid-feedback">{errors.cap}</div>}
                    </div>
                    <div className="col-8 mb-3">
                      <label className="form-label">Città</label>
                      <input
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        name="city"
                        value={delivery.city}
                        onChange={handleDeliveryChange}
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Telefono</label>
                    <input
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={delivery.phone}
                      onChange={handleDeliveryChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="notes"
                      value={delivery.notes}
                      onChange={handleDeliveryChange}
                      placeholder="Citofono, piano, preferenze…"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3) Colonna: Pagamento + Totali (TERZA) */}
            <div className="col-12 col-lg-3">
              <div className={styles.sticky}>
                <div className={`card shadow-sm ${styles.panel}`}>
                  <div className="card-body">
                    <h4 className={`${styles.titleOrder} mb-3`}>Pagamento</h4>

                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="method"
                        id="payCard"
                        value="card"
                        checked
                        readOnly
                      />
                      <label className="form-check-label" htmlFor="payCard">
                        Carta (test)
                      </label>
                    </div>

                    <div className="p-3 rounded border">
                      <label className="form-label">Dati carta (Stripe test)</label>
                      <div className="form-control" style={{ paddingTop: 12, paddingBottom: 12 }}>
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#212529',
                                '::placeholder': { color: '#adb5bd' }
                              },
                              invalid: { color: '#dc3545' }
                            }
                          }}
                        />
                      </div>
                      {piError && <div className="text-danger small mt-2">{piError}</div>}
                      <div className="text-muted small mt-2">
                        Usa carte di test: es. <code>4242 4242 4242 4242</code>, una data futura e un CVC qualsiasi.
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <span>Subtotale</span>
                      <strong>{currency(subtotal)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Spedizione</span>
                      <strong>{currency(SHIPPING_FEE)}</strong>
                    </div>
                    <div className="d-flex justify-content-between fs-5 mt-2">
                      <span>Totale</span>
                      <strong>{currency(total)}</strong>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-warning w-100 mt-3"
                      disabled={paying || !stripe || !elements}
                    >
                      {paying ? 'Elaboro…' : 'Paga e conferma'}
                    </button>

                    <p className="text-muted small mt-2 mb-0">
                      Modalità test: nessun addebito reale.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
