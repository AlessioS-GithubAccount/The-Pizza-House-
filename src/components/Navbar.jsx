import { NavLink, Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

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


        {/* Burger button */}
        <button
          className={`navbar-toggler ${styles.togglerMobile}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
                to="/ordina"
                className={({ isActive }) =>
                  `nav-link ${styles.navLink} ${isActive ? 'active' : ''}`
                }
                onClick={() => document.querySelector('#mainNav')?.classList.remove('show')}
              >
                Ordina
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
