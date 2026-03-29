import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export default function VoiceSearch({ onResult }) {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    const startListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search not supported in this browser. Try Chrome.");
            return;
        }
        const rec = new SpeechRecognition();
        rec.lang = "en-IN";
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        setListening(true);
        setTranscript("");
        rec.onresult = (e) => {
            const t = Array.from(e.results).map(r => r[0].transcript).join("");
            setTranscript(t);
            if (e.results[e.results.length - 1].isFinal) {
                onResult(t);
                setListening(false);
            }
        };
        rec.onerror = () => setListening(false);
        rec.onend = () => setListening(false);
        rec.start();
    }, [onResult]);

    return (
        <div className="relative flex items-center">
            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startListening}
                disabled={listening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${listening ? "bg-red-500/20 border border-red-500/50" : "glass hover:bg-white/10"}`}
                title="Voice Search">
                {listening
                    ? <MicOff className="w-4 h-4 text-red-400" />
                    : <Mic className="w-4 h-4 text-purple-400" />}
            </motion.button>
            <AnimatePresence>
                {listening && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="absolute left-12 whitespace-nowrap glass rounded-xl px-3 py-2 text-xs text-slate-300 border border-purple-500/20 z-10">
                        {transcript || "Listening..."}
                        <span className="ml-2 inline-flex gap-0.5">
                            {[0, 1, 2].map(i => (
                                <span key={i} className="w-1 h-3 rounded-full bg-purple-400 animate-bounce inline-block" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
