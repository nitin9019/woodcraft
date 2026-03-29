import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(persist(
  (set, get) => ({
    // Cart
    cart: [],
    addToCart: (product, wood) => {
      const cart = get().cart;
      const key = product._id + wood;
      const existing = cart.find(i => i.key === key);
      if (existing) {
        set({ cart: cart.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i) });
      } else {
        set({ cart: [...cart, { key, product, wood, qty: 1, price: product.prices[wood] }] });
      }
    },
    removeFromCart: (key) => set({ cart: get().cart.filter(i => i.key !== key) }),
    updateQty: (key, qty) => set({ cart: get().cart.map(i => i.key === key ? { ...i, qty } : i) }),
    clearCart: () => set({ cart: [] }),
    cartTotal: () => get().cart.reduce((s, i) => s + i.price * i.qty, 0),

    // Wishlist
    wishlist: [],
    toggleWishlist: (product) => {
      const wl = get().wishlist;
      const exists = wl.find(p => p._id === product._id);
      set({ wishlist: exists ? wl.filter(p => p._id !== product._id) : [...wl, product] });
    },
    isWishlisted: (id) => get().wishlist.some(p => p._id === id),

    // Notifications
    notifications: [],
    addNotification: (msg, type = 'info') => set({
      notifications: [{ id: Date.now(), msg, type, read: false }, ...get().notifications].slice(0, 20)
    }),
    markAllRead: () => set({ notifications: get().notifications.map(n => ({ ...n, read: true })) }),
    unreadCount: () => get().notifications.filter(n => !n.read).length,
  }),
  { name: 'woodcraft-store', partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }) }
));
