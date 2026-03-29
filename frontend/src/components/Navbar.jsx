import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/index";
import CartDrawer from "./CartDrawer";
import NotificationPanel from "./NotificationPanel";
import VoiceSearch from "./VoiceSearch";
import ThemeToggle from './ThemeToggle';
import { LogOut, Menu, X, User, LayoutDashboard, ChevronRight, ShoppingCart, Bell, Globe, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "हिंदी" },
  { code: "kn", label: "KN", name: "ಕನ್ನಡ" },
  { code: "mr", label: "MR", name: "मराठी" },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cart, unreadCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/products", label: "Categories" },
  ];

  const isActive = (to) => location.pathname === to;

  const handleVoiceResult = (text) => {
    navigate(`/products?search=${encodeURIComponent(text)}`);
  };

  const noNav = ["/login", "/register"].includes(location.pathname);
  if (noNav) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-sm shadow-lg">W</div>
            <span className="font-black text-white text-lg hidden sm:block">Wood<span className="text-purple-400">Craft</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${isActive(l.to)
                  ? 'text-white border-purple-500'
                  : 'text-slate-400 hover:text-white border-transparent'
                  }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Voice Search */}
            <div className="hidden sm:block">
              <VoiceSearch onResult={handleVoiceResult} />
            </div>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle compact />
            </div>

            {/* Language */}
            <div className="relative hidden sm:block">
              <button onClick={() => setLangOpen(o => !o)}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-50 w-36">
                    {LANGS.map(l => (
                      <button key={l.code} onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${i18n.language === l.code ? "text-purple-400 font-bold" : "text-slate-300"}`}>
                        <span className="font-mono text-xs">{l.label}</span>{l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link to="/wishlist" className="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button onClick={() => setNotifOpen(o => !o)}
                  className="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Bell className="w-4 h-4" />
                  {unreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount()}
                    </span>
                  )}
                </button>
                <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>
            )}

            {/* User */}
            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors px-3 py-2 glass rounded-xl">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:block">{user.role === "admin" ? "Admin" : t("nav_dashboard")}</span>
                </Link>
                <button onClick={handleLogout} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2">
                  {t("btn_signin")}
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2 rounded-xl hidden sm:block">
                  {t("btn_register")}
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] flex md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-72 glass-strong border-r border-white/10 h-full flex flex-col p-6 gap-1">
              <div className="flex items-center justify-between mb-6">
                <span className="font-black text-white text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 glass rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {links.map(l => (
                <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
                  {l.label}<ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
                {/* Language switcher mobile */}
                <div className="px-4 py-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Language</p>
                  <div className="flex gap-2 flex-wrap">
                    {LANGS.map(l => (
                      <button key={l.code} onClick={() => i18n.changeLanguage(l.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${i18n.language === l.code ? "bg-purple-600 text-white" : "glass text-slate-400"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Theme toggle mobile */}
                <div className="px-4 py-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Theme</p>
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-500/10 text-sm font-semibold">
                      Dashboard<LayoutDashboard className="w-4 h-4" />
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-semibold">
                      Logout<LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 text-sm font-medium block">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center mt-2 rounded-xl py-3 block">Create Account</Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
