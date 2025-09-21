const KEY = 'cart';

function safeParse(json, fallback = []) {
  try { return JSON.parse(json); } catch { return fallback; }
}

export function readCart() {
  return safeParse(localStorage.getItem(KEY) || '[]');
}

export function writeCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  const count = cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  // evento custom per aggiornare UI nella stessa tab
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count } }));
  return cart;
}

export function addToCart(product) {
  const cart = readCart();
  const id = Number(product.id);
  const idx = cart.findIndex(it => Number(it.id) === id);

  const item = {
    id,
    name: product.nome ?? product.name ?? '',
    price: Number(product.prezzo ?? product.price ?? 0),
    // 👉 preferisci l'immagine già risolta (passata dal Menu), poi l'eventuale img_url
    img: product.img ?? product.img_url ?? null,
    qty: 1,
  };

  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push(item);
  }
  return writeCart(cart);
}

export function removeFromCart(id) {
  const nid = Number(id);
  const cart = readCart().filter(it => Number(it.id) !== nid);
  return writeCart(cart);
}

export function setQty(id, qty) {
  const cart = readCart();
  const nid = Number(id);
  const idx = cart.findIndex(it => Number(it.id) === nid);
  if (idx >= 0) {
    cart[idx].qty = Math.max(1, Number(qty) || 1);
  }
  return writeCart(cart);
}

export function clearCart() {
  return writeCart([]);
}
