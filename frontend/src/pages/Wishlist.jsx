import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const { wishlist, toggleWishlist, addToCart } = useStore();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            style: { background: '#1a0f3d', color: '#e2e8f0', border: '1px solid rgba(124,58,237,0.3)' },
        });
    };

    return (
        <div className="min-h-screen dash-bg py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">My Wishlist</h1>
                        <p className="text-slate-400 text-sm">{wishlist.length} saved items</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="glass rounded-3xl p-20 text-center">
                        <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-slate-400 text-sm mb-6">Save products you love to buy them later</p>
                        <button onClick={() => navigate('/products')} className="btn-primary px-8 py-3 rounded-xl text-sm">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wishlist.map((product, i) => (
                            <motion.div key={product._id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="glass rounded-2xl overflow-hidden group" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="relative h-44 overflow-hidden bg-slate-900 cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`, { state: { product } })}>
                                    <img
                                        src={product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=60'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <button onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-purple-400 font-black text-base mb-3">
                                        ₹{product.price?.toLocaleString()}
                                    </p>
                                    <button onClick={() => handleAddToCart(product)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white' }}>
                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
