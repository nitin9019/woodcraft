import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const SocialBtn = ({ label }) => (
    <a href="#" aria-label={label}
        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {label[0]}
    </a>
);

export default function Footer() {
    return (
        <footer className="border-t border-white/5 mt-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-sm">W</div>
                            <span className="font-black text-white text-lg">Wood<span className="text-purple-400">Craft</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5">
                            Premium handcrafted furniture for modern living. Quality you can feel, style you can see.
                        </p>
                        <div className="flex gap-3">
                            {['In', 'Tw', 'Fb', 'Yt'].map((label) => (
                                <a key={label} href="#" aria-label={label}
                                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
                                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {[['/', 'Home'], ['/products', 'Products'], ['/repair', 'Repair Service'], ['/dashboard', 'My Orders'], ['/wishlist', 'Wishlist']].map(([to, label]) => (
                                <li key={to}>
                                    <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Wood Types */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Wood Types</h4>
                        <ul className="space-y-2.5">
                            {['Teak Wood', 'Mango Wood', 'Sheesham Wood', 'Plywood', 'Custom Orders'].map(w => (
                                <li key={w} className="text-slate-400 text-sm">{w}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                <span>123 Furniture Lane, Pune, Maharashtra 411001</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>hello@woodcraft.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2026 WoodCraft Pro Max. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
                            <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
