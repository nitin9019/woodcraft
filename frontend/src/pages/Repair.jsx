import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { MapPin, CheckCircle, Wrench } from 'lucide-react';

export default function Repair() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.username||'', phone:'', city:'', description:'' });
  const [gps, setGps] = useState({ lat:null, lng:null });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      p => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setGpsLoading(false); },
      () => { setError('Location access denied'); setGpsLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!gps.lat) { setError('Location is required'); return; }
    setLoading(true);
    try {
      await api.post('/repairs', { ...form, lat: gps.lat, lng: gps.lng });
      navigate('/dashboard');
    } catch { setError('Request failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen dash-bg py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-3xl overflow-hidden">
          <div className="p-8 relative overflow-hidden" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(124,58,237,0.05))'}}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-purple-600/10 blur-2xl pointer-events-none"/>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Wrench className="w-7 h-7 text-purple-400"/>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Request a Repair</h1>
                <p className="text-slate-400 text-sm mt-1">Our expert craftsmen will restore your furniture</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/20 mb-6" style={{background:'rgba(239,68,68,0.08)'}}>{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input required type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-dark"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                  <input required type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-dark"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="input-dark" placeholder="e.g. Pune, Bangalore"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GPS Location <span className="text-red-400">*Required</span></label>
                <button type="button" onClick={getLocation} disabled={gpsLoading || !!gps.lat}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${gps.lat ? 'text-emerald-400 border border-emerald-500/30' : 'btn-ghost'}`}
                  style={gps.lat ? {background:'rgba(16,185,129,0.1)'} : {}}>
                  {gps.lat ? <CheckCircle className="w-4 h-4"/> : <MapPin className="w-4 h-4"/>}
                  {gpsLoading ? 'Getting location...' : gps.lat ? `Captured (${gps.lat.toFixed(3)}, ${gps.lng.toFixed(3)})` : 'Capture Current Location'}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Problem Description</label>
                <textarea required rows="4" placeholder="Describe the damage, furniture type, wood if known..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-dark resize-none"/>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-4 rounded-xl text-base disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Repair Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
