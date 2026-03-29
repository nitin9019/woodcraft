import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { MapPin, CheckCircle, ArrowLeft, Package } from 'lucide-react';

export default function Booking() {
  const { user } = useContext(AuthContext);
  const loc = useLocation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = loc.state?.product;
  const woodType = loc.state?.selectedWood;
  const price = loc.state?.price;

  const [form, setForm] = useState({ name: user?.username||'', phone:'', address:'', city:'', quantity:1, notes:'' });
  const [gps, setGps] = useState({ lat:null, lng:null });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!product) navigate('/'); }, [product]);

  const getLocation = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      p => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setGpsLoading(false); },
      () => { setError('Location access denied'); setGpsLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gps.lat) { setError('Location is required'); return; }
    setLoading(true);
    try {
      await api.post('/bookings', { ...form, lat: gps.lat, lng: gps.lng, product_id: productId, product_name: product.name, wood_type: woodType });
      navigate('/dashboard');
    } catch { setError('Booking failed. Please try again.'); }
    finally { setLoading(false); }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen dash-bg py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4"/> Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="glass rounded-2xl p-6 h-max">
            <h2 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Order Summary</h2>
            <div className="aspect-square rounded-xl overflow-hidden mb-5 bg-slate-800">
              <img src={product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=60'} alt={product.name} className="w-full h-full object-cover"/>
            </div>
            <div className="space-y-3 text-sm">
              <div><p className="text-slate-500 text-xs">Product</p><p className="font-semibold text-white">{product.name}</p></div>
              <div><p className="text-slate-500 text-xs">Wood Type</p><p className="font-semibold text-white">{woodType}</p></div>
              <div className="pt-3 border-t border-white/5">
                <p className="text-slate-500 text-xs mb-1">Estimated Total</p>
                <p className="text-2xl font-black text-purple-400">₹{(price * form.quantity).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 glass rounded-2xl p-6">
            <h2 className="font-bold text-white mb-6 text-lg">Delivery Details</h2>
            {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/20" style={{background:'rgba(239,68,68,0.08)'}}>{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input required type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-dark"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                  <input required type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-dark"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <input required type="text" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="input-dark"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="input-dark"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                  <input required type="number" min="1" value={form.quantity} onChange={e=>setForm({...form,quantity:parseInt(e.target.value)||1})} className="input-dark"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GPS Location <span className="text-red-400">*Required</span></label>
                <button type="button" onClick={getLocation} disabled={gpsLoading || !!gps.lat}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${gps.lat ? 'text-emerald-400 border border-emerald-500/30' : 'btn-ghost'}`}
                  style={gps.lat ? {background:'rgba(16,185,129,0.1)'} : {}}>
                  {gps.lat ? <CheckCircle className="w-4 h-4"/> : <MapPin className="w-4 h-4"/>}
                  {gpsLoading ? 'Getting location...' : gps.lat ? `Captured (${gps.lat.toFixed(3)}, ${gps.lng.toFixed(3)})` : 'Get Current Location'}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes (Optional)</label>
                <textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="input-dark resize-none"/>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-60 mt-2">
                {loading ? 'Placing Order...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
