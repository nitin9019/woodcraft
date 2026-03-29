import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Package, Wrench, Info } from "lucide-react";
import { useStore } from "../store/useStore";

const icons = { order: Package, repair: Wrench, info: Info };
const colors = { order: "text-purple-400", repair: "text-amber-400", info: "text-blue-400" };

export default function NotificationPanel({ open, onClose }) {
    const { notifications, markAllRead, unreadCount } = useStore();

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[140]" onClick={onClose} />
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ type: "spring", damping: 20 }}
                        className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden shadow-2xl z-[150]"
                        style={{ background: "rgba(10,6,25,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(24px)" }}>
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-purple-400" />
                                <span className="text-white font-bold text-sm">Notifications</span>
                                {unreadCount() > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white">{unreadCount()}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount() > 0 && (
                                    <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                                    </button>
                                )}
                                <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(n => {
                                    const Icon = icons[n.type] || Info;
                                    return (
                                        <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-white/5 transition-colors ${n.read ? "opacity-50" : ""}`}
                                            style={{ background: n.read ? "transparent" : "rgba(124,58,237,0.04)" }}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colors[n.type] || "text-blue-400"}`}
                                                style={{ background: "rgba(255,255,255,0.06)" }}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-200 text-sm leading-relaxed">{n.msg}</p>
                                                <p className="text-slate-600 text-xs mt-1">{new Date(n.id).toLocaleTimeString()}</p>
                                            </div>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1" />}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
