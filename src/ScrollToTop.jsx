// src/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scroller = document.scrollingElement || document.documentElement;
    const prev = scroller.style.scrollBehavior;   // salva
    scroller.style.scrollBehavior = 'auto';       // forza istantaneo
    scroller.scrollTo({ top: 0, left: 0 });
    setTimeout(() => { scroller.style.scrollBehavior = prev; }, 0); // ripristina
  }, [pathname]);

  return null;
}
