import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";

export default function Screen2({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center space-y-8 will-change-transform"
    >
      <motion.div
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center text-pink-400 will-change-transform"
      >
        <Hourglass className="w-20 h-20" />
      </motion.div>
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-200">
          I've been waiting forever
        </h1>
        <p className="text-lg text-slate-400 font-medium leading-relaxed">
          You reply so slow, my phone literally went to sleep, woke up, and went back to sleep waiting for your text. 📱💤
        </p>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-3 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-all duration-300 text-pink-300 font-semibold"
      >
        But you know what...
      </button>
    </motion.div>
  );
}