import { create } from 'zustand';

// Simple store without persist middleware (Zustand v5 compatible)
// We manually sync cart/wishlist to localStorage
const loadStorage = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export const useStore = create((set, get) => ({
    // Cart
    cart: loadStorage('wc-cart', []),
    addToCart: (product, wood) => {
        const cart = get().cart;
        const key = product._id + wood;
        const existing = cart.find(i => i.key === key);
        const next = existing
            ? cart.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
            : [...cart, { key, product, wood, qty: 1, price: product.prices[wood] }];
        set({ cart: next });
        localStorage.setItem('wc-cart', JSON.stringify(next));
    },
    removeFromCart: (key) => {
        const next = get().cart.filter(i => i.key !== key);
        set({ cart: next });
        localStorage.setItem('wc-cart', JSON.stringify(next));
    },
    updateQty: (key, qty) => {
        const next = get().cart.map(i => i.key === key ? { ...i, qty } : i);
        set({ cart: next });
        localStorage.setItem('wc-cart', JSON.stringify(next));
    },
    clearCart: () => { set({ cart: [] }); localStorage.removeItem('wc-cart'); },
    cartTotal: () => get().cart.reduce((s, i) => s + i.price * i.qty, 0),

    // Wishlist
    wishlist: loadStorage('wc-wishlist', []),
    toggleWishlist: (product) => {
        const wl = get().wishlist;
        const exists = wl.find(p => p._id === product._id);
        const next = exists ? wl.filter(p => p._id !== product._id) : [...wl, product];
        set({ wishlist: next });
        localStorage.setItem('wc-wishlist', JSON.stringify(next));
    },
    isWishlisted: (id) => get().wishlist.some(p => p._id === id),

    // Notifications (session only)
    notifications: [],
    addNotification: (msg, type = 'info') => set(s => ({
        notifications: [{ id: Date.now(), msg, type, read: false }, ...s.notifications].slice(0, 20)
    })),
    markAllRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
    })),
    unreadCount: () => get().notifications.filter(n => !n.read).length,
}));
