import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useStore } from "../store/useStore";
import api from "../api";
import { CreditCard, Shield, CheckCircle, ArrowLeft, Smartphone } from "lucide-react";

export default function Checkout() {
    const { user } = useContext(AuthContext);
    const { cart, cartTotal, clearCart, addNotification } = useStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=details, 2=payment, 3=success
    const [method, setMethod] = useState("razorpay");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: user?.username || "", phone: "", address: "", city: "" });

    if (!user) { navigate("/login"); return null; }
    if (cart.length === 0 && step !== 3) { navigate("/products"); return null; }

    const handlePayment = async () => {
        setLoading(true);
        // Mock payment — in production integrate Razorpay SDK here
        await new Promise(r => setTimeout(r, 1800));
        try {
            // Create bookings for each cart item
            for (const item of cart) {
                await api.post("/bookings", {
                    product_id: item.product._id,
                    product_name: item.product.name,
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    wood_type: item.wood,
                    quantity: item.qty,
                    lat: 18.5204, lng: 73.8567, // default coords
                    notes: `Paid via ${method}`,
                });
            }
            addNotification(`Order placed! ₹${cartTotal().toLocaleString()} paid via ${method === "razorpay" ? "Razorpay" : "Card"}`, "order");
            clearCart();
            setStep(3);
        } catch {
            alert("Payment failed. Please try again.");
        }
        setLoading(false);
    };

    if (step === 3) return (
        <div className="min-h-screen dash-bg flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-strong rounded-3xl p-12 text-center max-w-md w-full border border-emerald-500/20">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h1 className="text-3xl font-black text-white mb-3">Order Placed!</h1>
                <p className="text-slate-400 mb-8">Your order has been confirmed. You'll receive updates via notifications.</p>
                <div className="flex gap-3">
                    <button onClick={() => navigate("/dashboard")} className="flex-1 btn-primary py-3 rounded-xl text-sm">View Orders</button>
                    <button onClick={() => navigate("/products")} className="flex-1 btn-ghost py-3 rounded-xl text-sm">Shop More</button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen dash-bg py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Steps */}
                <div className="flex items-center gap-4 mb-10">
                    {[{ n: 1, l: "Details" }, { n: 2, l: "Payment" }].map(s => (
                        <div key={s.n} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? "bg-purple-600 text-white" : "glass text-slate-500"}`}>{s.n}</div>
                            <span className={`text-sm font-medium ${step >= s.n ? "text-white" : "text-slate-500"}`}>{s.l}</span>
                            {s.n < 2 && <div className={`w-12 h-px ${step > s.n ? "bg-purple-500" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-4">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
                                <h2 className="text-white font-black text-lg mb-6">Delivery Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[["name", "Full Name", "text"], ["phone", "Phone Number", "text"], ["address", "Delivery Address", "text"], ["city", "City", "text"]].map(([k, l, t]) => (
                                        <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{l}</label>
                                            <input type={t} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                                                className="input-dark" placeholder={l} />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { if (form.name && form.phone && form.address && form.city) setStep(2); else alert("Fill all fields"); }}
                                    className="btn-primary w-full py-4 rounded-xl mt-6 text-base">
                                    Continue to Payment
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
                                <h2 className="text-white font-black text-lg mb-6">Payment Method</h2>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { id: "razorpay", label: "Razorpay", sub: "UPI, Cards, Net Banking", icon: Smartphone },
                                        { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
                                    ].map(m => (
                                        <button key={m.id} onClick={() => setMethod(m.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${method === m.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 glass hover:border-white/20"}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === m.id ? "bg-purple-600" : "bg-white/5"}`}>
                                                <m.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{m.label}</p>
                                                <p className="text-slate-500 text-xs">{m.sub}</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-purple-500" : "border-slate-600"}`}>
                                                {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span>256-bit SSL encrypted. Your payment is 100% secure.</span>
                                </div>
                                <button onClick={handlePayment} disabled={loading}
                                    className="btn-primary w-full py-4 rounded-xl text-base disabled:opacity-60 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                                    ) : (
                                        <>Pay ₹{cartTotal().toLocaleString()}</>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="glass rounded-2xl p-5 h-max">
                        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Order Summary</h3>
                        <div className="space-y-3 mb-4">
                            {cart.map(item => (
                                <div key={item.key} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                        <img src={item.product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=60"}
                                            className="w-full h-full object-cover" alt={item.product.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-semibold line-clamp-1">{item.product.name}</p>
                                        <p className="text-slate-500 text-xs">{item.wood} × {item.qty}</p>
                                    </div>
                                    <p className="text-purple-400 text-xs font-bold shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/5 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span>₹{cartTotal().toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-slate-400"><span>Delivery</span><span className="text-emerald-400">Free</span></div>
                            <div className="flex justify-between text-white font-black text-base pt-2 border-t border-white/5">
                                <span>Total</span><span>₹{cartTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
