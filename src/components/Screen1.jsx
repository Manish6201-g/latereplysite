import { Frown } from "lucide-react";
import { motion } from "framer-motion";

export default function Screen1({ onNext }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 will-change-transform"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center"
            >
                <Frown className="w-16 h-16 text-rose-500 opacity-80" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-slate-200">
                Oh wow, you remembered I exist? 😒
            </h1>
            <button
                onClick={onNext}
                className="px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-pink-500/50 transition-all duration-300 text-slate-300 hover:text-pink-300 shadow-lg font-medium"
            >
                Anyway, moving on...
            </button>
        </motion.div>
    );
}