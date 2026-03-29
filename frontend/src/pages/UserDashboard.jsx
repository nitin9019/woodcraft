import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Package, Wrench, User, ShoppingBag, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';

function StatusBadge({ status }) {
  const map = {
    Pending: 'badge-pending', Accepted: 'badge-accepted',
    'In Progress': 'badge-progress', Completed: 'badge-completed', Cancelled: 'badge-cancelled'
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || 'badge-pending'}`}>{status}</span>;
}

function OrderCard({ order }) {
  const navigate = useNavigate();
  return (
    <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/20 transition-all" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{order.product_name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()} · {order.wood_type} · Qty {order.quantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={order.status} />
        <button onClick={() => navigate(`/track/${order._id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors glass px-3 py-1.5 rounded-lg border border-purple-500/20">
          <MapPin className="w-3.5 h-3.5" /> Track
        </button>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/bookings'), api.get('/repairs')])
      .then(([b, r]) => { setOrders(b.data); setRepairs(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
    { id: 'repairs', label: 'Repair Requests', icon: Wrench, count: repairs.length },
  ];

  return (
    <div className="min-h-screen dash-bg">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(124,58,237,0.05))' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <User className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Welcome back, {user?.username}</h1>
              <p className="text-slate-400 text-sm mt-1">Track your orders and manage your account</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
            {[{ v: orders.length, l: 'Total Orders' }, { v: orders.filter(o => o.status === 'Pending').length, l: 'Pending' }, { v: orders.filter(o => o.status === 'Completed').length, l: 'Completed' }].map(({ v, l }) => (
              <div key={l} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-xs text-slate-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-purple-600 text-white' : 'glass text-slate-400 hover:text-white'}`}>
              <t.icon className="w-4 h-4" />{t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab === t.id ? 'bg-white/20' : 'bg-white/5'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="glass rounded-2xl h-20 animate-pulse" />)}</div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
              <p className="text-slate-400 text-sm mb-6">Browse our catalog and place your first order</p>
              <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 text-sm">Browse Products</button>
            </div>
          ) : (
            <div className="space-y-3">{orders.map(o => <OrderCard key={o._id} order={o} />)}</div>
          )
        ) : (
          repairs.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No repair requests</h3>
              <p className="text-slate-400 text-sm mb-6">Need furniture repaired? Submit a request</p>
              <button onClick={() => navigate('/repair')} className="btn-primary px-8 py-3 text-sm">Request Repair</button>
            </div>
          ) : (
            <div className="space-y-3">
              {repairs.map(r => (
                <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                      <Wrench className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{r.description}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{r.city}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
