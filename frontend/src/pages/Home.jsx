import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Zap, ShoppingBag, UserPlus, Calendar } from 'lucide-react';

// Lazy load 3D scene — won't crash app if Three.js fails
const HeroScene = lazy(() =>
  import('../components/HeroScene').catch(() => ({ default: () => null }))
);

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg grid-pattern">
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none pulse-glow" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl pointer-events-none pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">
          {/* Hero Content */}
          <motion.div initial="hidden" animate="show" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Exquisite Furniture Collection
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-white">Find</span> <span className="gradient-text">Premium Furniture</span><br />
              <span className="text-white">for Your Home</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              Experience the perfect blend of comfort, elegance, and durability. Our handcrafted pieces are designed to transform your living space into a masterpiece.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Shop Now <ShoppingBag className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-ghost flex items-center gap-2 text-base px-8 py-4">
                Join Us
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visuals (3D Scene) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            className="flex items-center justify-center relative h-80 lg:h-[500px]"
          >
            <div className="absolute inset-0 rounded-full bg-purple-600/5 blur-3xl" />
            <div className="w-full h-full relative z-10">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">Loading 3D Atmosphere...</div>}>
                <HeroScene />
              </Suspense>
            </div>
            
            {/* Floating Badges */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-0 glass rounded-2xl px-4 py-3 text-xs font-bold text-amber-400 border border-amber-500/20 z-20 shadow-xl">
              ✦ Luxury Design
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-0 glass rounded-2xl px-4 py-3 text-xs font-bold text-purple-400 border border-purple-500/20 z-20 shadow-xl">
              ⬡ Solid Wood
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs">
          <span>Explore More</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center pt-1.5">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1.5 rounded-full bg-slate-500" />
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-video shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 glass rounded-2xl p-6 border-white/10">
              <div className="text-amber-400 font-black text-3xl mb-1 italic">Good Craft Services</div>
              <div className="text-slate-300 text-sm font-medium tracking-wide">Since 2012</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-4 block">Our Story</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
            About <span className="gradient-text">Good Craft Services</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            At Good Craft Services, we believe that furniture is more than just functional objects—it's the soul of your home. 
            For over a decade, our master craftsmen have been dedicated to creating timeless pieces that combine traditional 
            woodworking techniques with modern design sensibilities.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              { label: 'Quality Materials', desc: 'Hand-selected premium woods' },
              { label: 'Artisan Crafted', desc: 'Meticulous attention to detail' }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl glass border-white/5">
                <div className="text-white font-bold mb-1">{item.label}</div>
                <div className="text-slate-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/products" className="btn-ghost inline-flex items-center gap-2 group">
            Learn More About Our Craft <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              className="text-xs font-bold text-purple-400 uppercase tracking-[0.4em]"
            >
              Excellence in Service
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              className="text-4xl lg:text-5xl font-black text-white mt-4"
            >
              Why Choose Our Services?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                I: Shield, 
                t: 'Custom Furniture', 
                d: 'Collaborate with our designers to create unique pieces tailored specifically to your space and personal style.', 
                c: 'bg-purple-500/15 text-purple-400' 
              },
              { 
                I: Truck, 
                t: 'Fast Delivery', 
                d: 'Our white-glove delivery service ensures your furniture arrives safely and is professionally placed in your home.', 
                c: 'bg-blue-500/15 text-blue-400' 
              },
              { 
                I: Zap, 
                t: 'Affordable Pricing', 
                d: 'Premium quality shouldn\'t mean premium prices. We offer competitive rates without compromising on craftsmanship.', 
                c: 'bg-amber-500/15 text-amber-400' 
              },
            ].map(({ I, t, d, c }, i) => (
              <motion.div 
                key={t} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-[32px] p-10 border-white/5 hover:border-purple-500/30 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${c} group-hover:scale-110 transition-transform duration-300`}>
                  <I className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t}</h3>
                <p className="text-slate-400 leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL-TO-ACTION SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[48px] p-12 lg:p-20 text-center relative overflow-hidden border-white/10"
          >
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-6 block">Ready to Transform Your Space?</span>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Start Your Journey to a<br /><span className="gradient-text">Beautiful Home Today</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-secondary">
                Join the Good Craft Services family and discover the difference that premium, handcrafted furniture can make in your daily life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register" className="btn-primary px-10 py-5 text-lg w-full sm:w-auto flex items-center justify-center gap-3">
                  <UserPlus className="w-5 h-5" /> Register Now
                </Link>
                <Link to="/booking" className="glass-strong hover:bg-white/10 px-10 py-5 text-lg rounded-xl font-bold text-white transition-all w-full sm:w-auto flex items-center justify-center gap-3 border border-white/20">
                  <Calendar className="w-5 h-5" /> Book Your Product
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer-like bottom padding */}
      <div className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">© 2026 Good Craft Services. All rights reserved.</p>
      </div>

    </div>
  );
}
