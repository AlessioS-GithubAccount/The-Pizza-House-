// src/lib/auth.js  (FRONTEND)
// Piccolo store per l'autenticazione lato client
const KEY = 'auth';

function safeParse(s, f = null) { try { return JSON.parse(s); } catch { return f; } }

export function getAuth() {
  return safeParse(localStorage.getItem(KEY), { token: null, user: null });
}

export function saveAuth({ token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
  window.dispatchEvent(new Event('auth:changed'));
  return { token, user };
}

export function logout() {
  localStorage.removeItem(KEY);
  // per compatibilità con eventuali salvataggi vecchi:
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth:changed'));
}

export function isLoggedIn() {
  return Boolean(getAuth()?.token);
}

export function getUser() {
  return getAuth()?.user || null;
}

export function authHeader() {
  const t = getAuth()?.token;
  return t ? { Authorization: `Bearer ${t}` } : {};
}
