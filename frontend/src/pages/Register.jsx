import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, Lock, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-z0-9_]+$/.test(form.username)) {
      setError('Username can only contain lowercase letters, numbers, and underscores');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // The register function in AuthContext handles API call and user state saving
      await register(form);
      // On successful signup, redirect user to homepage
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', Icon: User, type: 'text', placeholder: 'John Doe' },
    { key: 'phone', label: 'Phone Number', Icon: Phone, type: 'text', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Email', Icon: Mail, type: 'email', placeholder: 'john@example.com' },
    { key: 'username', label: 'Username', Icon: AtSign, type: 'text', placeholder: 'johndoe123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 hero-bg grid-pattern">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 24 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black shadow-lg">W</div>
            <span className="font-black text-white text-xl">Wood<span className="text-purple-400">Craft</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join WoodCraft Furniture Services</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium text-red-400 border border-red-500/20"
              style={{ background: 'rgba(239,68,68,0.08)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
                <div className="input-icon-wrap">
                  <Icon className="icon-left w-4 h-4" />
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    className="input-dark"
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="input-icon-wrap">
                <Lock className="icon-left w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="input-dark has-right"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="icon-right hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
