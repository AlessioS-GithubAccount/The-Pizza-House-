// src/lib/auth.js
const KEY = 'auth';

function safeParse(s, f = null) { try { return JSON.parse(s); } catch { return f; } }

// Legge sia il nuovo formato { token, user } salvato in "auth",
// sia le vecchie chiavi "token" / "user"
export function getAuth() {
  const fromNew = safeParse(localStorage.getItem(KEY), null);
  if (fromNew && fromNew.token) return fromNew;

  const legacyToken = localStorage.getItem('token');
  const legacyUser  = safeParse(localStorage.getItem('user'), null);
  if (legacyToken) return { token: legacyToken, user: legacyUser };

  return { token: null, user: null };
}

export function isLoggedIn() {
  return Boolean(getAuth()?.token);
}

export function getUser() {
  return getAuth()?.user || null;
}

// Salva in formato nuovo + copia anche nelle chiavi legacy
export function saveAuth({ token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
  localStorage.setItem('token', token || '');                 // legacy compat
  localStorage.setItem('user', JSON.stringify(user || null)); // legacy compat
  window.dispatchEvent(new Event('auth:changed'));
  return { token, user };
}

export function logout() {
  localStorage.removeItem(KEY);
  localStorage.removeItem('token'); // legacy
  localStorage.removeItem('user');  // legacy
  window.dispatchEvent(new Event('auth:changed'));
}

export function authHeader() {
  const t = getAuth()?.token;
  return t ? { Authorization: `Bearer ${t}` } : {};
}
