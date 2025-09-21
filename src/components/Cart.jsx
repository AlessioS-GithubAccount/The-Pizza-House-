// src/components/Cart.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/cart.module.css';
import { readCart, setQty as setQtyStore, removeFromCart, clearCart } from '../lib/cart';

const SHIPPING_FEE = 3.5; // spedizione flat demo

export default function Cart() {
  const navigate = useNavigate();

  // carica subito dal localStorage via helper
  const [items, setItems] = useState(() => readCart());

  // ascolta aggiornamenti dal Menu (evento custom) e da altre tab (storage)
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

  // quando modifico qty da Cart, aggiorna store e poi rilegge
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

  // Dati consegna
  const [delivery, setDelivery] = useState({
    full_name: '',
    address: '',
    cap: '',
    city: '',
    phone: '',
    notes: '',
  });

  // Dati pagamento (demo)
  const [payment, setPayment] = useState({
    method: 'card',
    card_name: '',
    card_number: '',
    expiry: '',
    cvv: '',
  });

  // Errori form
  const [errors, setErrors] = useState({});

  const removeItem = (id) => {
    removeFromCart(id);
    setItems(readCart());
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDelivery((d) => ({ ...d, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!delivery.full_name.trim()) errs.full_name = 'Nome e cognome obbligatori';
    if (!delivery.address.trim()) errs.address = 'Indirizzo obbligatorio';
    if (!/^\d{5}$/.test(delivery.cap)) errs.cap = 'CAP non valido (5 cifre)';
    if (!delivery.city.trim()) errs.city = 'Città obbligatoria';
    if (!/^\+?\d[\d\s\-]{5,}$/.test(delivery.phone)) errs.phone = 'Telefono non valido';

    if (payment.method === 'card') {
      if (!payment.card_name.trim()) errs.card_name = 'Intestatario obbligatorio';
      if (!/^\d{13,19}$/.test(payment.card_number.replace(/\s+/g, '')))
        errs.card_number = 'Numero carta non valido';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) errs.expiry = 'Scadenza MM/YY';
      if (!/^\d{3,4}$/.test(payment.cvv)) errs.cvv = 'CVV non valido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!items.length) {
      alert('Il carrello è vuoto. Vai al menu per aggiungere prodotti.');
      return;
    }
    if (!validate()) return;

    const order = {
      items,
      delivery,
      payment: { method: payment.method, last4: payment.card_number.slice(-4) },
      amounts: { subtotal, shipping: SHIPPING_FEE, total },
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('last_order', JSON.stringify(order));
    clearCart();
    setItems(readCart());

    alert('Ordine confermato! (demo)');
    navigate('/');
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
          <div className="row g-4">
            {/* Colonna: Dati consegna */}
            <div className="col-12 col-lg-4">
              <div className={`card shadow-sm ${styles.panel}`}>
                <div className="card-body">
                  <h4 className="mb-3">Dati per la consegna</h4>
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

            {/* Colonna: Riepilogo ordine (modificabile) */}
            <div className="col-12 col-lg-5">
              <div className={`card shadow-sm ${styles.panel}`}>
                <div className="card-body">
                  <h4 className="mb-3">Riepilogo ordine</h4>
                  <ul className="list-group list-group-flush">
                    {items.map((it) => (
                      <li key={it.id} className="list-group-item bg-transparent text-white">
                        <div className="d-flex align-items-center">
                          <img
                            src={it.img || '/images/pizzeImage/placeholder.webp'}
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
                                  onClick={() => setQty(it.id, it.qty - 1)}
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

            {/* Colonna: Pagamento + Totali */}
            <div className="col-12 col-lg-3">
              <div className={`card shadow-sm ${styles.panel} ${styles.sticky}`}>
                <div className="card-body">
                  <h4 className="mb-3">Pagamento</h4>

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="method"
                      id="payCard"
                      value="card"
                      checked={payment.method === 'card'}
                      onChange={(e) => setPayment((p) => ({ ...p, method: e.target.value }))}
                    />
                    <label className="form-check-label" htmlFor="payCard">
                      Carta
                    </label>
                  </div>

                  <div className="p-3 rounded">
                    <div className="mb-2">
                      <label className="form-label">Intestatario</label>
                      <input
                        className={`form-control ${errors.card_name ? 'is-invalid' : ''}`}
                        name="card_name"
                        value={payment.card_name}
                        onChange={handlePaymentChange}
                        placeholder="Mario Rossi"
                      />
                      {errors.card_name && (
                        <div className="invalid-feedback">{errors.card_name}</div>
                      )}
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Numero carta</label>
                      <input
                        className={`form-control ${errors.card_number ? 'is-invalid' : ''}`}
                        name="card_number"
                        value={payment.card_number}
                        onChange={handlePaymentChange}
                        inputMode="numeric"
                        placeholder="4111111111111111"
                      />
                      {errors.card_number && (
                        <div className="invalid-feedback">{errors.card_number}</div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-6 mb-2">
                        <label className="form-label">Scadenza (MM/YY)</label>
                        <input
                          className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                          name="expiry"
                          value={payment.expiry}
                          onChange={handlePaymentChange}
                          placeholder="08/27"
                        />
                        {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                      </div>
                      <div className="col-6 mb-2">
                        <label className="form-label">CVV</label>
                        <input
                          className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                          name="cvv"
                          value={payment.cvv}
                          onChange={handlePaymentChange}
                          inputMode="numeric"
                          placeholder="123"
                        />
                        {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                      </div>
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

                  <button type="submit" className="btn btn-warning w-100 mt-3">
                    Conferma ordine
                  </button>

                  <p className="text-muted small mt-2 mb-0">
                    Pagamento simulato per scopi dimostrativi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
