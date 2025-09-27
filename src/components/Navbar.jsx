// src/components/Navbar.jsx
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/navbar.module.css';
import { isLoggedIn, getUser, logout } from '../lib/auth';

// --- Badge carrello (inline) ---
function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reload = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const c = Array.isArray(cart)
          ? cart.reduce((s, it) => s + (Number(it.qty) || 0), 0)
          : 0;
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
    <span className={`${styles.cartBadge} badge rounded-pill bg-danger`}>
      {count}
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logged, setLogged] = useState(() => isLoggedIn());
  const [user, setUser] = useState(() => getUser());
  const [burgerOpen, setBurgerOpen] = useState(false);

  // Animazione entrata navbar (stile Home)
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(id);
  }, []);

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

  // chiudi pannello al cambio route
  useEffect(() => { setBurgerOpen(false); }, [location.pathname]);

  // brand: se già in home, non rinaviga: scroll-to-top smooth
  const handleBrandClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
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
    <nav className={`navbar navbar-dark bg-dark fixed-top ${styles.navRoot} ${entered ? styles.navIn : styles.navInit}`}>
      <div className={`container-fluid ${styles.navContainer}`}>

        {/* Brand centrato (logo + title) */}
        <div className={styles.brandWrapper}>
          <Link
            to="/"
            onClick={handleBrandClick}
            className={`navbar-brand d-flex align-items-center ${styles.brand}`}
            aria-label="Vai alla Home"
          >
            <img
              src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png"
              alt="Logo The Pizza House"
              className={styles.logoPage}
            />
            <span className={`ms-2 ${styles.navTitle}`}>THE PIZZA HOUSE</span>
          </Link>
        </div>

        {/* Destra: Benvenuto + Carrello + Burger */}
        <div className={styles.rightCluster}>
          {logged && displayName && (
            <span className={styles.welcome}>
              Benvenuto <strong>{displayName}</strong>
            </span>
          )}

          <Link
            to="/cart"
            className={`${styles.navLink} ${styles.cartLink}`}
            aria-label="Carrello"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <CartBadge />
          </Link>

          <button
            className={styles.burgerBtn}
            aria-label="Apri/chiudi menu"
            aria-expanded={burgerOpen ? 'true' : 'false'}
            aria-controls="desktopBurgerPanel"
            onClick={() => setBurgerOpen(v => !v)}
          >
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Pannello burger: Menu, Accedi/Esci, Contatti */}
      <div
        id="desktopBurgerPanel"
        className={`${styles.menuPanel} ${burgerOpen ? styles.menuVisible : styles.menuHidden}`}
      >
        <nav className={styles.menuInner} aria-label="Menu principale">
          <NavLink to="/menu" className={styles.menuLink}>Menu</NavLink>

          {!logged ? (
            <NavLink to="/login" className={styles.menuLink}>Accedi</NavLink>
          ) : (
            <a href="/logout" className={styles.menuLink} onClick={handleLogout}>
              Esci{displayName ? ` (${displayName})` : ''}
            </a>
          )}

          <a href="#therealfooter" className={styles.menuLink}>Contatti</a>
        </nav>
      </div>
    </nav>
  );
}
