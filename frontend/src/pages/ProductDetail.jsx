import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { ArrowLeft, Star, Shield, Info, Truck, CheckCircle, User } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(loc.state?.product || null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(!product);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeImg, setActiveImg] = useState('');

  useEffect(() => {
    if (!product) { navigate('/'); return; }
    const imgs = product.images?.length ? product.images : [product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=70'];
    setActiveImg(imgs[0]);
    api.get(`/products/${product._id}/related?limit=3`).then(r => setRelated(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [product]);

  const handleOrder = () => {
    if (product.stock <= 0) { alert('Out of stock'); return; }
    navigate(`/booking/${product._id}`, { state: { product, price: product.price } });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { user_id: user.id||user.sub, name: user.username, rating: reviewRating, comment: reviewComment });
      setProduct({ ...product, reviews: [...(product.reviews||[]), { name: user.username, date: new Date().toISOString(), rating: reviewRating, comment: reviewComment }] });
      setReviewComment('');
    } catch { alert('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  if (!product) return null;
  const imgs = product.images?.length ? product.images : [product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=70'];

  return (
    <div className="min-h-screen dash-bg py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4"/> Back
        </button>

        <div className="glass rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Images */}
            <div className="w-full lg:w-1/2 p-6 space-y-4">
              <div className="relative h-[380px] rounded-2xl overflow-hidden bg-slate-900">
                <img src={activeImg} alt={product.name} className="w-full h-full object-cover"/>
                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold text-white">Out of Stock</div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {imgs.map((img,i) => (
                    <button key={i} onClick={() => setActiveImg(img)} className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImg===img ? 'border-purple-500' : 'border-white/10'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="thumb"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full lg:w-1/2 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-400 border border-purple-500/30" style={{background:'rgba(124,58,237,0.1)'}}>{product.category}</span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/20" style={{background:'rgba(251,191,36,0.08)'}}>
                  <Star className="w-3 h-3 fill-amber-400"/>{product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                </div>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{product.name}</h1>
              <p className="text-slate-500 text-sm mb-4">By {product.brand || 'WoodCraft'}</p>
              <p className="text-4xl font-black text-purple-400 mb-6">₹{product.price?.toLocaleString() || 0}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[{I:Shield,t:'Durability',d:product.durability_info,c:'text-emerald-400'},{I:Info,t:'Maintenance',d:product.maintenance_guide,c:'text-blue-400'},{I:Truck,t:'Delivery',d:product.delivery_details,c:'text-purple-400'}].map(({I,t,d,c})=>(
                  <div key={t} className="glass rounded-xl p-4">
                    <div className={`flex items-center gap-2 font-semibold text-xs mb-2 ${c}`}><I className="w-3.5 h-3.5"/>{t}</div>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{d}</p>
                  </div>
                ))}
              </div>

              <button onClick={handleOrder} disabled={product.stock<=0}
                className="w-full btn-primary py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <CheckCircle className="w-5 h-5"/>
                {product.stock > 0 ? 'Proceed to Checkout' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews + Related */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 glass rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-6">Reviews ({product.reviews?.length || 0})</h2>
            <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-1">
              {product.reviews?.length ? product.reviews.map((r,i) => (
                <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">{r.name[0].toUpperCase()}</div>
                      <div>
                        <p className="font-semibold text-white text-sm">{r.name}</p>
                        <p className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} className={`w-3.5 h-3.5 ${j<r.rating?'fill-amber-400 text-amber-400':'text-slate-700'}`}/>)}</div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 text-sm">No reviews yet. Be the first!</div>
              )}
            </div>
            {user ? (
              <form onSubmit={submitReview} className="glass rounded-xl p-5 border border-white/5">
                <h3 className="font-bold text-white text-sm mb-4">Write a Review</h3>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setReviewRating(s)}>
                      <Star className={`w-6 h-6 transition-colors ${s<=reviewRating?'fill-amber-400 text-amber-400':'text-slate-600 hover:text-amber-400'}`}/>
                    </button>
                  ))}
                </div>
                <textarea required rows="3" value={reviewComment} onChange={e=>setReviewComment(e.target.value)} className="input-dark resize-none mb-4" placeholder="Share your experience..."/>
                <button type="submit" disabled={submitting} className="btn-primary px-6 py-2.5 text-sm rounded-xl disabled:opacity-60">
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="glass rounded-xl p-5 flex items-center justify-between border border-purple-500/20">
                <span className="text-slate-400 text-sm">Sign in to leave a review</span>
                <button onClick={() => navigate('/login')} className="btn-primary px-5 py-2 text-sm rounded-xl">Sign In</button>
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div className="w-full lg:w-72 shrink-0">
              <h2 className="text-lg font-black text-white mb-4">Related Furniture</h2>
              <div className="space-y-3">
                {related.map(r => (
                  <div key={r._id} onClick={() => navigate(`/product/${r._id}`, {state:{product:r}})}
                    className="glass rounded-xl p-3 flex gap-3 cursor-pointer hover:border-purple-500/20 transition-all" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                      <img src={r.image||'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=60'} className="w-full h-full object-cover" alt={r.name}/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-white text-sm line-clamp-1">{r.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.category}</p>
                      <p className="text-sm font-black text-purple-400 mt-1">₹{r.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
