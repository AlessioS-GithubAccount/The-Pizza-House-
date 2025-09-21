// src/components/Navbar.jsx
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';
import { isLoggedIn, getUser, logout } from '../lib/auth';

function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reload = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const c = Array.isArray(cart) ? cart.reduce((s, it) => s + (Number(it.qty) || 0), 0) : 0;
        setCount(c);
      } catch {
        setCount(0);
      }
    };
    reload();
    window.addEventListener('cart:updated', reload);
    const onStorage = (e) => { if (e.key === 'cart') reload(); };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cart:updated', reload);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (!count) return null;
  return (
    <span
      className="position-absolute translate-middle badge rounded-pill bg-danger"
      style={{ top: 6, right: -6, fontSize: 11 }}
    >
      {count}
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  const [logged, setLogged] = useState(() => isLoggedIn());
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const onAuthChange = () => {
      setLogged(isLoggedIn());
      setUser(getUser());
    };
    window.addEventListener('auth:changed', onAuthChange);
    window.addEventListener('storage', onAuthChange);
    return () => {
      window.removeEventListener('auth:changed', onAuthChange);
      window.removeEventListener('storage', onAuthChange);
    };
  }, []);

  const closeBurger = () => document.querySelector('#mainNav')?.classList.remove('show');

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    closeBurger();
    navigate('/');
  };

  const displayName = (() => {
    const u = user || {};
    const full = (u.full_name || u.name || '').trim();
    if (full) return full.split(/\s+/)[0];
    if (u.email && typeof u.email === 'string') return u.email.split('@')[0];
    return null;
  })();

  return (
    <nav className={`navbar navbar-dark bg-dark fixed-top ${styles.navRoot}`}>
      <div className={`container-fluid ${styles.navContainer}`}>
        {/* Logo + brand */}
        <div className={`mx-auto d-flex align-items-center ${styles.brandWrapper}`}>
          <Link
            to="/"
            className={`navbar-brand d-flex align-items-center ${styles.brand}`}
            onClick={closeBurger}
          >
            <img
              src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png"
              alt="Logo"
              className={styles.logoPage}
            />
            <span className={`ms-2 ${styles.brand}`}>THE PIZZA HOUSE</span>
          </Link>
        </div>

        {/* Benvenuto + Cart + burger */}
        <div className="d-flex align-items-center">
          {/* Benvenuto <nome> (solo se loggato) */}
          {logged && displayName && (
            <span
              className="me-2"
              style={{ color: '#fff', opacity: 0.9, fontSize: 14, whiteSpace: 'nowrap' }}
            >
              Benvenuto <strong>{displayName}</strong>
            </span>
          )}

          {/* icona carrello + badge */}
          <div className="position-relative">
            <Link
              to="/cart"
              className={`nav-link ${styles.cartLink}`}
              aria-label="Carrello"
              onClick={closeBurger}
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
            <CartBadge />
          </div>

          <button
            className={`navbar-toggler ms-3 ${styles.togglerMobile}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Burger menu */}
        <div className={`collapse navbar-collapse ${styles.collapseBg}`} id="mainNav">
          <ul className={`navbar-nav ms-auto text-center ${styles.navList}`}>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink
                to="/menu"
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? 'active' : ''}`}
                onClick={closeBurger}
              >
                Menu
              </NavLink>
            </li>
            {!logged ? (
              <li className={`nav-item ${styles.navItem}`}>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? 'active' : ''}`}
                  onClick={closeBurger}
                >
                  Accedi
                </NavLink>
              </li>
            ) : (
              <li className={`nav-item ${styles.navItem}`}>
                <a href="/logout" className={`nav-link ${styles.navLink}`} onClick={handleLogout}>
                  Esci{displayName ? ` (${displayName})` : ''}
                </a>
              </li>
            )}

            <li className={`nav-item ${styles.navItem}`}>
              <a className={`nav-link ${styles.navLink}`} href="#therealfooter" onClick={closeBurger}>
                Contatti
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
