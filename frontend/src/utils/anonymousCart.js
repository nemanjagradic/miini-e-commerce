import { capQuantity } from "./productStock";

const STORAGE_KEY = "anonymousCart";
const LEGACY_KEY = "guestCart";

export function getAnonymousCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_KEY);
      return JSON.parse(legacy);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

export function setAnonymousCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearAnonymousCart() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function syncAnonymousCartFromItems(cartItems) {
  setAnonymousCart(cartItems.map(({ id, quantity }) => ({ id, quantity })));
}

export function buildCartItemsFromStorage(storedItems, allProducts) {
  return storedItems
    .map(({ id, quantity }) => {
      const product = allProducts.find((p) => p._id === id);
      if (!product) return null;
      const cappedQuantity = capQuantity(quantity, product.stockQuantity);
      if (cappedQuantity <= 0) return null;
      return {
        id: product._id,
        title: product.title,
        imgs: product.imgs,
        price: product.price,
        stockQuantity: product.stockQuantity,
        quantity: cappedQuantity,
        totalPrice: cappedQuantity * product.price,
      };
    })
    .filter(Boolean);
}
