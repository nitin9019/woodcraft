import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact = false }) {
    const { theme, toggle, isDark } = useTheme();

    if (compact) {
        // Icon-only version for navbar
        return (
            <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center transition-colors"
                style={{ color: isDark ? '#fbbf24' : '#7c3aed' }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={theme}
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}>
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        );
    }

    // Full pill toggle
    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all"
            style={{
                background: isDark
                    ? 'linear-gradient(135deg,rgba(251,191,36,0.1),rgba(251,191,36,0.05))'
                    : 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(124,58,237,0.05))',
                border: isDark ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(124,58,237,0.25)',
                color: isDark ? '#fbbf24' : '#7c3aed',
            }}>
            {/* Track */}
            <div className="relative w-10 h-5 rounded-full flex items-center px-0.5"
                style={{ background: isDark ? 'rgba(251,191,36,0.2)' : 'rgba(124,58,237,0.2)' }}>
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{
                        background: isDark ? '#fbbf24' : '#7c3aed',
                        marginLeft: isDark ? 'auto' : '0',
                    }}
                />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5">
                    {isDark ? <><Sun className="w-3.5 h-3.5" /> Light Mode</> : <><Moon className="w-3.5 h-3.5" /> Dark Mode</>}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}
