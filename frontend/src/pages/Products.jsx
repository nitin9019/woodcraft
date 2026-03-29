import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Package, SlidersHorizontal } from 'lucide-react';

const CATS = ['Sofa','Table','Dining','Chair','Closet','Door','Panel','Bed','Cupboard','TV Unit','Office'];

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Initialize category from URL query param if present
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category.toLowerCase());
    if (search)   params.append('search', search);
    api.get(`/products?${params.toString()}`)
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen dash-bg">
      {/* Header */}
      <div className="border-b border-white/5" style={{background:'rgba(255,255,255,0.02)'}}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Catalog</span>
          <h1 className="text-4xl font-black text-white mt-2">All Products</h1>
          <p className="text-slate-400 text-sm mt-2">Browse our full collection of premium handcrafted furniture</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          {/* Search */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-white font-bold mb-4 text-sm">
              <Search className="w-4 h-4 text-purple-400" /> Search
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="input-dark text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-white font-bold mb-4 text-sm">
              <Filter className="w-4 h-4 text-purple-400" /> Categories
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="cat" checked={category === ''} onChange={() => setCategory('')} className="accent-purple-500" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">All Categories</span>
              </label>
              {CATS.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="accent-purple-500" />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors capitalize">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 text-sm">
              {loading ? 'Loading...' : <><span className="text-white font-bold">{products.length}</span> products found</>}
            </p>
            {category && (
              <button onClick={() => setCategory('')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold glass px-3 py-1.5 rounded-full border border-purple-500/20 transition-colors">
                Clear filter ×
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="glass rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass rounded-2xl p-20 text-center">
              <Package className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No products found</h3>
              <p className="text-slate-400 text-sm">Try a different search or category</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {products.map(p => (
                <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
