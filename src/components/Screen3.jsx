import { motion, useReducedMotion } from "framer-motion";
import { Heart, Activity, Sparkles } from "lucide-react";

export default function Screen3({ onNext }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative z-10 will-change-transform"
    >
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-rose-950/30 relative overflow-hidden group flex flex-col items-center text-center space-y-8 border-t-white/20">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wide shadow-inner"
        >
          <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Heart Rate: 120 BPM 💓</span>
        </motion.div>

        {/* Animated Heart Icon */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { scale: 1 }
              : {
                  scale: [1, 1.22, 1.05, 1.22, 1],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          whileHover={{ scale: 1.25 }}
          className="relative flex justify-center items-center cursor-pointer p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-inner group-hover:border-rose-500/50 transition-colors"
        >
          <div className="absolute inset-0 bg-rose-500/25 rounded-2xl blur-xl pointer-events-none" />
          <Heart className="w-16 h-16 text-rose-400 fill-rose-400/40 relative z-10 filter drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]" />
        </motion.div>

        {/* Heading & Text */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300">
            It&apos;s fine... I can&apos;t stay mad at you ❤️
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-xs mx-auto">
            Because you&apos;re finally here. And I made this special little site while staring at my screen waiting for you.
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-rose-600/30 via-pink-600/30 to-purple-600/30 border border-rose-500/50 hover:border-rose-400 text-rose-100 hover:text-white font-semibold text-sm transition-all duration-300 shadow-xl shadow-rose-950/40 hover:shadow-rose-500/25 cursor-pointer overflow-hidden"
          aria-label="Show final message"
        >
          {/* Light Sweep Effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>Show me...</span>
        </motion.button>

      </div>
    </motion.div>
  );
}
