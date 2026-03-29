import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import {
  LayoutDashboard, ShoppingBag, Wrench, Users, Package, BarChart2,
  Settings, LogOut, TrendingUp, IndianRupee, Plus, Trash2, Clock,
  CheckCircle, XCircle, MapPin, ChevronRight, Pencil, X, Save
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#7c3aed', '#10b981', '#ef4444'];

function StatusBadge({ status }) {
  const map = {
    Pending: 'badge-pending', Accepted: 'badge-accepted',
    'In Progress': 'badge-progress', Completed: 'badge-completed', Cancelled: 'badge-cancelled'
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] || 'badge-pending'}`}>{status}</span>;
}

function StatCard({ icon: Icon, value, label, color, sub }) {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-emerald-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const SIDEBAR = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: ShoppingBag },
  { id: 'repairs', label: 'Repairs', icon: Wrench },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newProd, setNewProd] = useState({ name: '', category: '', image: '', price: '', stock: '', images: '' });
  const [adding, setAdding] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    Promise.all([
      api.get('/bookings'), api.get('/repairs'),
      api.get('/admin/stats'), api.get('/admin/users'), api.get('/products')
    ]).then(([b, r, s, u, p]) => {
      setBookings(b.data); setRepairs(r.data);
      setStats(s.data); setUsers(u.data); setProducts(p.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const updateBooking = async (id, status) => {
    await api.patch(`/bookings/${id}?status=${status}`);
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
  };
  const updateRepair = async (id, status) => {
    await api.patch(`/repairs/${id}?status=${status}`);
    setRepairs(repairs.map(r => r._id === id ? { ...r, status } : r));
  };
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  const openEdit = (p) => {
    setEditProd({ ...p, images: p.images ? p.images.join(', ') : '' });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const imagesArray = editProd.images.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await api.put(`/products/${editProd._id}`, {
        ...editProd,
        price: parseFloat(editProd.price),
        stock: parseInt(editProd.stock) || 0,
        images: imagesArray,
      });
      setProducts(products.map(p => p._id === editProd._id ? res.data : p));
      setEditProd(null);
    } catch { alert('Failed to save changes'); }
    finally { setSaving(false); }
  };

  const addProduct = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      const imagesArray = newProd.images.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await api.post('/products', {
        ...newProd,
        price: parseFloat(newProd.price),
        stock: parseInt(newProd.stock) || 0,
        images: imagesArray,
        brand: newProd.brand || 'WoodCraft'
      });
      setProducts([...products, res.data]);
      setNewProd({ name: '', category: '', image: '', price: '', stock: '', images: '' });
    } catch { alert('Failed to add product'); }
    finally { setAdding(false); }
  };

  const StatusSelect = ({ current, onUpdate }) => (
    <select value={current} onChange={e => onUpdate(e.target.value)}
      className="input-dark text-xs py-2 px-3 w-36">
      {['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <div className="flex min-h-screen dash-bg">
        {/* Sidebar */}
        <div className="w-64 shrink-0 glass-strong border-r border-white/5 flex flex-col py-6 px-3 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="px-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Panel</p>
          </div>
          <nav className="flex-1 space-y-1">
            {SIDEBAR.map(s => (
              <button key={s.id} onClick={() => setTab(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === s.id ? 'sidebar-active' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <s.icon className="w-4 h-4 shrink-0" />
                {s.label}
                {tab === s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </button>
            ))}
          </nav>
          <div className="border-t border-white/5 pt-4 mt-4 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">A</div>
              <div>
                <p className="text-white text-sm font-semibold">Admin</p>
                <p className="text-slate-500 text-xs">Administrator</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" />Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-8 overflow-x-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="stat-card h-28 animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && stats && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm">Welcome back, Admin</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={IndianRupee} value={`₹${stats.total_revenue?.toLocaleString()}`} label="Total Revenue" color="bg-emerald-500/15 text-emerald-400" sub="All time" />
                    <StatCard icon={ShoppingBag} value={stats.total_orders} label="Total Orders" color="bg-purple-500/15 text-purple-400" />
                    <StatCard icon={Users} value={stats.total_users} label="Registered Users" color="bg-blue-500/15 text-blue-400" />
                    <StatCard icon={Package} value={products.length} label="Products" color="bg-amber-500/15 text-amber-400" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-6 text-sm">Order Status Distribution</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.status_chart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                              {stats.status_chart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-6 text-sm">Monthly Revenue</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.monthly_chart}>
                            <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOOKINGS */}
              {tab === 'bookings' && (
                <div>
                  <h1 className="text-2xl font-black text-white mb-6">Bookings ({bookings.length})</h1>
                  <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full table-dark">
                      <thead><tr>
                        <th>Date / ID</th><th>Customer</th><th>Product</th><th>Location</th><th>Status</th><th>Action</th>
                      </tr></thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td><span className="font-mono text-xs text-slate-500">#{b._id.slice(-6)}</span><br /><span className="text-slate-300">{new Date(b.created_at).toLocaleDateString()}</span></td>
                            <td><p className="font-semibold text-white">{b.name}</p><p className="text-slate-500 text-xs">{b.phone}</p></td>
                            <td><p className="font-semibold text-white">{b.product_name} <span className="text-slate-500">x{b.quantity}</span></p><p className="text-slate-500 text-xs">{b.wood_type}</p></td>
                            <td><div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" /><span className="text-slate-300 text-xs">{b.city}</span></div><a href={`https://maps.google.com/?q=${b.lat},${b.lng}`} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:underline">View Map</a></td>
                            <td><StatusBadge status={b.status} /></td>
                            <td><StatusSelect current={b.status} onUpdate={v => updateBooking(b._id, v)} /></td>
                          </tr>
                        ))}
                        {bookings.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-slate-500">No bookings found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REPAIRS */}
              {tab === 'repairs' && (
                <div>
                  <h1 className="text-2xl font-black text-white mb-6">Repair Requests ({repairs.length})</h1>
                  <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full table-dark">
                      <thead><tr><th>ID</th><th>Customer</th><th>Problem</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {repairs.map(r => (
                          <tr key={r._id}>
                            <td className="font-mono text-xs text-slate-500">#{r._id.slice(-6)}</td>
                            <td><p className="font-semibold text-white">{r.name}</p><p className="text-slate-500 text-xs">{r.phone}</p></td>
                            <td className="max-w-xs"><p className="text-slate-300 text-xs line-clamp-2">{r.description}</p></td>
                            <td><div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" /><span className="text-slate-300 text-xs">{r.city}</span></div><a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:underline">View Map</a></td>
                            <td><StatusBadge status={r.status} /></td>
                            <td><StatusSelect current={r.status} onUpdate={v => updateRepair(r._id, v)} /></td>
                          </tr>
                        ))}
                        {repairs.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-slate-500">No repair requests</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* USERS */}
              {tab === 'users' && (
                <div>
                  <h1 className="text-2xl font-black text-white mb-6">Users ({users.length})</h1>
                  <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full table-dark">
                      <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Phone</th></tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id}>
                            <td className="font-mono text-xs text-slate-500">#{u._id.slice(-6)}</td>
                            <td className="font-semibold text-white">{u.name}</td>
                            <td className="text-slate-400">@{u.username}</td>
                            <td className="text-slate-400">{u.email}</td>
                            <td className="text-slate-400">{u.phone}</td>
                          </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-slate-500">No users found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {tab === 'products' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-6">Add New Product</h1>
                    <form onSubmit={addProduct} className="glass rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Name</label><input required placeholder="e.g. Royal Sofa Set" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="input-dark" /></div>
                      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label><input required placeholder="e.g. Sofa set" value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="input-dark" /></div>
                      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price (₹)</label><input type="number" required placeholder="0" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="input-dark" /></div>
                      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stock</label><input type="number" required placeholder="0" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} className="input-dark" /></div>
                      <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Image URL</label><input placeholder="https://..." value={newProd.image} onChange={e => setNewProd({ ...newProd, image: e.target.value })} className="input-dark" /></div>
                      <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gallery Images (comma separated URLs)</label><input placeholder="url1, url2, url3" value={newProd.images} onChange={e => setNewProd({ ...newProd, images: e.target.value })} className="input-dark" /></div>
                      <div className="md:col-span-2"><button type="submit" disabled={adding} className="btn-primary px-8 py-3 rounded-xl text-sm disabled:opacity-60 flex items-center gap-2"><Plus className="w-4 h-4" />{adding ? 'Adding...' : 'Add Product'}</button></div>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white mb-4">All Products ({products.length})</h2>
                    <div className="glass rounded-2xl overflow-hidden">
                      <table className="w-full table-dark">
                        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p._id}>
                              <td><img src={p.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&q=60'} alt={p.name} className="w-12 h-12 rounded-lg object-cover" /></td>
                              <td className="font-semibold text-white">{p.name}</td>
                              <td className="text-slate-400">{p.category}</td>
                              <td className="text-white font-bold text-xs">₹{p.price}</td>
                              <td><div className="flex items-center gap-3">
                                <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs font-semibold transition-colors"><Pencil className="w-3.5 h-3.5" />Edit</button>
                                <button onClick={() => deleteProduct(p._id)} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                              </div></td>
                            </tr>
                          ))}
                          {products.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-slate-500">No products found</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {tab === 'analytics' && stats && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-black text-white">Analytics</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={IndianRupee} value={`₹${stats.total_revenue?.toLocaleString()}`} label="Total Revenue" color="bg-emerald-500/15 text-emerald-400" />
                    <StatCard icon={ShoppingBag} value={stats.total_orders} label="Total Orders" color="bg-purple-500/15 text-purple-400" />
                    <StatCard icon={Users} value={stats.total_users} label="Users" color="bg-blue-500/15 text-blue-400" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-6 text-sm">Order Status</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.status_chart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                              {stats.status_chart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-6 text-sm">Monthly Revenue</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.monthly_chart}>
                            <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={36} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {
        editProd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditProd(null)} />
            <div className="relative w-full max-w-xl glass-strong rounded-3xl border border-white/10 p-8 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Edit Product</h2>
                <button onClick={() => setEditProd(null)} className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={saveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Name</label>
                    <input required value={editProd.name} onChange={e => setEditProd({ ...editProd, name: e.target.value })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <input required value={editProd.category} onChange={e => setEditProd({ ...editProd, category: e.target.value })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price (₹)</label>
                    <input type="number" required value={editProd.price} onChange={e => setEditProd({ ...editProd, price: e.target.value })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stock</label>
                    <input type="number" min="0" value={editProd.stock ?? 0} onChange={e => setEditProd({ ...editProd, stock: parseInt(e.target.value) || 0 })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Brand</label>
                    <input value={editProd.brand || ''} onChange={e => setEditProd({ ...editProd, brand: e.target.value })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Image URL</label>
                    <input value={editProd.image || ''} onChange={e => setEditProd({ ...editProd, image: e.target.value })} className="input-dark" placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gallery Images (comma separated URLs)</label>
                    <input value={editProd.images || ''} onChange={e => setEditProd({ ...editProd, images: e.target.value })} className="input-dark" placeholder="url1, url2, url3" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea rows="2" value={editProd.description || ''} onChange={e => setEditProd({ ...editProd, description: e.target.value })} className="input-dark resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Durability Info</label>
                    <textarea rows="2" value={editProd.durability_info || ''} onChange={e => setEditProd({ ...editProd, durability_info: e.target.value })} className="input-dark resize-none text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Maintenance Guide</label>
                    <textarea rows="2" value={editProd.maintenance_guide || ''} onChange={e => setEditProd({ ...editProd, maintenance_guide: e.target.value })} className="input-dark resize-none text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Delivery Details</label>
                    <textarea rows="2" value={editProd.delivery_details || ''} onChange={e => setEditProd({ ...editProd, delivery_details: e.target.value })} className="input-dark resize-none text-xs" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl text-sm disabled:opacity-60">
                    <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditProd(null)} className="btn-ghost px-8 py-3 rounded-xl text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
}
