import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        {/* Logo + brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            id="logoPage"
            src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png"
            alt="Logo"
            width="48"
            height="auto"
          />
          <span className="ms-2">THE PIZZA HOUSE</span>
        </Link>

        {/* Burger button */}
        <button
          className="navbar-toggler"
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
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <NavLink to="/menu" className="nav-link" onClick={() => document.querySelector('#mainNav').classList.remove('show')}>
                Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ordina" className="nav-link" onClick={() => document.querySelector('#mainNav').classList.remove('show')}>
                Ordina
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className="nav-link" onClick={() => document.querySelector('#mainNav').classList.remove('show')}>
                Accedi
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#therealfooter"
                onClick={() => document.querySelector('#mainNav').classList.remove('show')}
              >
                Contatti
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
