// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';

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
  return (
    <nav className={`navbar navbar-dark bg-dark fixed-top ${styles.navRoot}`}>
      <div className={`container-fluid ${styles.navContainer}`}>
        {/* Logo + brand */}
        <div className={`mx-auto d-flex align-items-center ${styles.brandWrapper}`}>
          <Link to="/" className={`navbar-brand d-flex align-items-center ${styles.brand}`}>
            <img
              src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png"
              alt="Logo"
              className={styles.logoPage}
            />
            <span className={`ms-2 ${styles.brand}`}>THE PIZZA HOUSE</span>
          </Link>
        </div>

        {/* Burger button + cart icon */}
        <div className="d-flex align-items-center">
          {/* icona carrello + badge */}
          <div className="position-relative">
            <Link to="/cart" className={`nav-link ${styles.cartLink}`} aria-label="Carrello">
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
                className={({ isActive }) =>
                  `nav-link ${styles.navLink} ${isActive ? 'active' : ''}`
                }
                onClick={() => document.querySelector('#mainNav')?.classList.remove('show')}
              >
                Menu
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link ${styles.navLink} ${isActive ? 'active' : ''}`
                }
                onClick={() => document.querySelector('#mainNav')?.classList.remove('show')}
              >
                Accedi
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <a
                className={`nav-link ${styles.navLink}`}
                href="#therealfooter"
                onClick={() => document.querySelector('#mainNav')?.classList.remove('show')}
              >
                Contatti
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
