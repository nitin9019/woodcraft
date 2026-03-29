import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
    const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useStore();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={onClose} />
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm z-[160] flex flex-col"
                        style={{ background: "rgba(10,6,25,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-purple-400" />
                                <h2 className="text-white font-black text-lg">Cart ({cart.length})</h2>
                            </div>
                            <button onClick={onClose} className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingCart className="w-16 h-16 text-slate-700 mb-4" />
                                    <p className="text-slate-400 font-medium">Your cart is empty</p>
                                    <p className="text-slate-600 text-sm mt-1">Add some furniture to get started</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.key} className="glass rounded-2xl p-4 flex gap-3"
                                        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                                            <img src={item.product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=60"}
                                                className="w-full h-full object-cover" alt={item.product.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm line-clamp-1">{item.product.name}</p>
                                            <p className="text-slate-500 text-xs">{item.wood}</p>
                                            <p className="text-purple-400 font-black text-sm mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button onClick={() => updateQty(item.key, Math.max(1, item.qty - 1))}
                                                    className="w-6 h-6 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-white text-sm font-bold w-4 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.key, item.qty + 1)}
                                                    className="w-6 h-6 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => removeFromCart(item.key)} className="ml-auto text-red-400 hover:text-red-300 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-4 border-t border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Total</span>
                                    <span className="text-white font-black text-xl">₹{cartTotal().toLocaleString()}</span>
                                </div>
                                <button onClick={handleCheckout}
                                    className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-base">
                                    Checkout <ArrowRight className="w-5 h-5" />
                                </button>
                                <button onClick={clearCart} className="w-full text-slate-500 hover:text-red-400 text-sm transition-colors py-2">
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
