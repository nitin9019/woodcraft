import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye, CheckCircle } from "lucide-react";
import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { background: "#1a0f3d", color: "#e2e8f0", border: "1px solid rgba(124,58,237,0.3)" },
      iconTheme: { primary: "#7c3aed", secondary: "#fff" },
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: wishlisted ? "💔" : "❤️",
      style: { background: "#1a0f3d", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)" },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      onClick={() => navigate(`/product/${product._id}`, { state: { product } })}>

      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=60"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-xs font-semibold text-slate-300">{product.category}</div>
        {product.stock <= 0 ? (
          <div className="absolute top-3 left-3 bg-red-500/80 rounded-full px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1">
            Out of Stock
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-green-500/80 rounded-full px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> In Stock
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 glass rounded-full px-2.5 py-1">
          <div className="flex">
            {[1,2,3,4,5].map(star => (
              <Star key={star} className={`w-3 h-3 ${star <= (product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-amber-400 ml-1">{product.rating > 0 ? product.rating.toFixed(1) : "New"}</span>
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist}
          className="absolute bottom-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={wishlisted ? { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" } : {}}>
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-400 text-red-400" : "text-slate-400"}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-slate-500 mb-3">{product.brand || "Good Craft Services"}</p>
        <p className="text-xl font-black text-purple-400 mb-4">₹{product.price?.toLocaleString()}</p>

        <div className="mt-auto space-y-3">
          <div className="flex gap-2">
            <button onClick={handleAddToCart} disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
              <ShoppingCart className="w-4 h-4" />
              {t("add_to_cart")}
            </button>
            <button onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`, { state: { product } }); }}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
