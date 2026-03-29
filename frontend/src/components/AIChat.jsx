import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";

const QUICK = ["Sofa for small room", "Best wood type?", "Beds under ₹20k", "Dining table ideas"];

const REPLIES = {
    sofa: "For a small living room, I recommend our 2-seater compact sofa in Mango wood. Fits 10x12 ft rooms perfectly. Price starts at ₹18,000.",
    bed: "For small rooms, our Single Bed with storage in Sheesham wood is ideal. Dimensions: 3x6 ft. Price: ₹12,000–₹18,000.",
    dining: "Our 4-seater Dining Table in Teak wood is our bestseller. Teak is highly durable and water-resistant. Price: ₹25,000.",
    teak: "Teak wood is premium hardwood — extremely durable, water-resistant, and beautiful. Lasts 50+ years with minimal maintenance.",
    chair: "Our Ergonomic Office Chair in Sheesham wood with cushion is ₹8,000. Dining Chairs start at ₹3,500 each.",
    wood: "We offer Teak (premium, durable), Mango (affordable, beautiful), Sheesham (strong, dark grain), and Plywood (budget-friendly).",
    price: "Our prices range from ₹3,500 (chairs) to ₹80,000 (premium sofa sets). All products come with a 5-year warranty.",
    default: "I can help you find perfect furniture! Ask about sofas, beds, dining tables, chairs, or wood types. What room are you furnishing?",
};

function getReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes("sofa") || m.includes("couch")) return REPLIES.sofa;
    if (m.includes("bed")) return REPLIES.bed;
    if (m.includes("dining") || m.includes("table")) return REPLIES.dining;
    if (m.includes("teak")) return REPLIES.teak;
    if (m.includes("chair")) return REPLIES.chair;
    if (m.includes("wood")) return REPLIES.wood;
    if (m.includes("price") || m.includes("cost") || m.includes("₹")) return REPLIES.price;
    return REPLIES.default;
}

export default function AIChat() {
    const [open, setOpen] = useState(false);
    const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi! I am WoodCraft AI. Ask me anything about furniture — styles, wood types, prices, or room ideas!" }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef();

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

    const send = (text) => {
        const msg = (text || input).trim();
        if (!msg) return;
        setInput("");
        setMsgs(m => [...m, { role: "user", text: msg }]);
        setTyping(true);
        setTimeout(() => {
            setMsgs(m => [...m, { role: "ai", text: getReply(msg) }]);
            setTyping(false);
        }, 800 + Math.random() * 400);
    };

    return (
        <>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)", boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}>
                <Sparkles className="w-6 h-6 text-white" />
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 20 }}
                        className="fixed bottom-44 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl"
                        style={{ background: "rgba(10,6,25,0.97)", border: "1px solid rgba(124,58,237,0.35)", backdropFilter: "blur(24px)" }}>
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">WoodCraft AI</p>
                                    <p className="text-emerald-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-64 overflow-y-auto p-4 space-y-3">
                            {msgs.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-purple-600 text-white rounded-br-sm" : "text-slate-200 rounded-bl-sm"}`}
                                        style={m.role === "ai" ? { background: "rgba(255,255,255,0.07)" } : {}}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {typing && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: "rgba(255,255,255,0.07)" }}>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        <div className="p-3 border-t border-white/5 space-y-2">
                            <div className="flex gap-2 flex-wrap">
                                {QUICK.map(s => (
                                    <button key={s} onClick={() => send(s)}
                                        className="text-xs px-3 py-1.5 rounded-full text-purple-300 hover:text-white transition-colors"
                                        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={input} onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && send()}
                                    placeholder="Ask about furniture..."
                                    className="flex-1 input-dark text-sm py-2.5" />
                                <button onClick={() => send()}
                                    className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors shrink-0">
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
