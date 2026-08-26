import { Frown, ArrowRight, MessageSquareX } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Screen1({ onNext }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative z-10 will-change-transform"
    >
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-rose-950/20 relative overflow-hidden group flex flex-col items-center text-center space-y-8 border-t-white/20">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wide shadow-inner"
        >
          <MessageSquareX className="w-3.5 h-3.5 text-rose-400" />
          <span>Status: Delivered 3 hours ago 😒</span>
        </motion.div>

        {/* Animated Frown Icon */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { y: 0 }
              : {
                  y: [0, -8, 0],
                  rotate: [0, -4, 4, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          whileHover={{ scale: 1.15, rotate: 12 }}
          className="relative flex justify-center items-center cursor-pointer p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-inner group-hover:border-rose-500/40 transition-colors"
        >
          <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg pointer-events-none" />
          <Frown className="w-16 h-16 text-rose-400 relative z-10 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]" />
        </motion.div>

        {/* Heading & Text */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-rose-100 to-slate-200">
            Oh wow, you remembered I exist? 😒
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-normal leading-relaxed max-w-xs mx-auto">
            I thought your phone flew into another dimension or something...
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/80 hover:border-pink-500/50 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-pink-500/10 cursor-pointer overflow-hidden"
          aria-label="Move to next screen"
        >
          {/* Light Sweep Effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <span>Anyway, moving on...</span>
          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
        </motion.button>

      </div>
    </motion.div>
  );
}
