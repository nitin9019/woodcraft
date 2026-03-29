import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, { stiffness: 120, damping: 20 });
    const sy = useSpring(y, { stiffness: 120, damping: 20 });

    useEffect(() => {
        const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <motion.div
            style={{
                left: sx, top: sy,
                translateX: "-50%", translateY: "-50%",
                pointerEvents: "none",
                background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)"
            }}
            className="fixed z-[9999] w-64 h-64 rounded-full"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        />
    );
}
