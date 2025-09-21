// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Order from './pages/Order.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ScrollToTop from './ScrollToTop.jsx'

// 👇 Cart sta in components
import Cart from './components/Cart.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />     
          <Route path="/ordina" element={<Order />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
