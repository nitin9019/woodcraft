import os, sys
sys.stdout.reconfigure(encoding='utf-8')

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'wrote {path}')

# 3D Hero Scene
w('frontend/src/components/HeroScene.jsx', '''
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus, Environment } from "@react-three/drei";

function SofaMesh() {
  const g = useRef();
  useFrame((s) => { if(g.current) g.current.rotation.y = s.clock.elapsedTime * 0.3; });
  return (
    <group ref={g}>
      <Box args={[2.4, 0.35, 1.1]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#4c1d95" metalness={0.3} roughness={0.4}/>
      </Box>
      <Box args={[2.4, 0.7, 0.35]} position={[0, 0.1, -0.38]}>
        <meshStandardMaterial color="#5b21b6" metalness={0.3} roughness={0.4}/>
      </Box>
      <Box args={[0.35, 0.55, 1.1]} position={[-1.03, 0.0, 0]}>
        <meshStandardMaterial color="#6d28d9" metalness={0.2} roughness={0.5}/>
      </Box>
      <Box args={[0.35, 0.55, 1.1]} position={[1.03, 0.0, 0]}>
        <meshStandardMaterial color="#6d28d9" metalness={0.2} roughness={0.5}/>
      </Box>
      <Box args={[0.12, 0.28, 0.12]} position={[-1.0, -0.6, -0.4]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2}/>
      </Box>
      <Box args={[0.12, 0.28, 0.12]} position={[1.0, -0.6, -0.4]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2}/>
      </Box>
      <Box args={[0.12, 0.28, 0.12]} position={[-1.0, -0.6, 0.4]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2}/>
      </Box>
      <Box args={[0.12, 0.28, 0.12]} position={[1.0, -0.6, 0.4]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2}/>
      </Box>
    </group>
  );
}

function FloatingOrb({ pos, color, speed=1 }) {
  const m = useRef();
  useFrame((s) => { if(m.current) m.current.position.y = pos[1] + Math.sin(s.clock.elapsedTime * speed) * 0.3; });
  return (
    <mesh ref={m} position={pos}>
      <sphereGeometry args={[0.18, 16, 16]}/>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.7}/>
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.5], fov: 50 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.4}/>
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#a78bfa"/>
      <pointLight position={[-3, 2, -2]} intensity={1} color="#fbbf24"/>
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#60a5fa"/>
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <SofaMesh/>
        </Float>
        <FloatingOrb pos={[-2.2, 0.8, 0]} color="#7c3aed" speed={1.2}/>
        <FloatingOrb pos={[2.2, 0.5, 0.5]} color="#fbbf24" speed={0.8}/>
        <FloatingOrb pos={[0, 1.5, -1]} color="#60a5fa" speed={1.5}/>
        <Environment preset="night"/>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI/1.8} minPolarAngle={Math.PI/3}/>
    </Canvas>
  );
}
''')

# AI Chat
w('frontend/src/components/AIChat.jsx', '''
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Mic } from "lucide-react";

const SUGGESTIONS = [
  "I need a sofa for small living room",
  "Best wood for dining table?",
  "Show me beds under 20000",
  "What is teak wood?",
];

const AI_RESPONSES = {
  sofa: "For a small living room, I recommend our **2-seater compact sofa** in Mango wood. It fits perfectly in 10x12 ft rooms. Price starts at ₹18,000.",
  bed: "For small rooms, our **Single Bed with storage** in Sheesham wood is perfect. Dimensions: 3x6 ft. Price: ₹12,000–₹18,000.",
  dining: "Our **4-seater Dining Table** in Teak wood is our bestseller. Teak is highly durable and water-resistant. Price: ₹25,000.",
  teak: "Teak wood is premium hardwood — extremely durable, water-resistant, and beautiful. It lasts 50+ years with minimal maintenance.",
  chair: "Our **Ergonomic Office Chair** in Sheesham wood with cushion is ₹8,000. Also check our **Dining Chairs** at ₹3,500 each.",
  default: "I can help you find the perfect furniture! Try asking about sofas, beds, dining tables, chairs, or wood types. What room are you furnishing?",
};

function getAIReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes("sofa") || m.includes("couch")) return AI_RESPONSES.sofa;
  if (m.includes("bed")) return AI_RESPONSES.bed;
  if (m.includes("dining") || m.includes("table")) return AI_RESPONSES.dining;
  if (m.includes("teak")) return AI_RESPONSES.teak;
  if (m.includes("chair")) return AI_RESPONSES.chair;
  return AI_RESPONSES.default;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi! I am WoodCraft AI. Ask me anything about furniture!" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "ai", text: getAIReply(msg) }]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)", boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}>
        <Sparkles className="w-6 h-6 text-white"/>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.9, y:20 }}
            className="fixed bottom-44 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white"/></div>
                <div><p className="text-white font-bold text-sm">WoodCraft AI</p><p className="text-emerald-400 text-xs"> Online</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-4 h-4"/></button>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={lex }>
                  <div className={max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed }
                    style={m.role==="ai" ? {background:"rgba(255,255,255,0.06)"} : {}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{background:"rgba(255,255,255,0.06)"}}>
                    <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{animationDelay:${i*0.15}s}}/>)}</div>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2 mb-3 flex-wrap">
                {SUGGESTIONS.slice(0,2).map(s=>(
                  <button key={s} onClick={()=>send(s)} className="text-xs px-3 py-1.5 rounded-full text-purple-300 hover:text-white transition-colors" style={{background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.3)"}}>
                    {s.length > 22 ? s.slice(0,22)+"..." : s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
                  placeholder="Ask about furniture..." className="flex-1 input-dark text-sm py-2.5"/>
                <button onClick={()=>send()} className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors shrink-0">
                  <Send className="w-4 h-4 text-white"/>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
''')

print("HeroScene + AIChat done")
