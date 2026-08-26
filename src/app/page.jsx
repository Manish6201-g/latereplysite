"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Screen1 from "@/components/Screen1";
import Screen2 from "@/components/Screen2";
import Screen3 from "@/components/Screen3";
import FinalScreen from "@/components/FinalScreen";
import FloatingElements from "@/components/FloatingElements";
import CursorTrail from "@/components/CursorTrail";

const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
    {/* Animated background glow orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-gradient-to-br from-pink-600/30 via-rose-500/20 to-purple-600/10 blur-[140px] rounded-full"
    />
    <motion.div
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.15, 0.25, 0.15],
        x: [0, -25, 0],
        y: [0, 25, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-gradient-to-tl from-purple-600/30 via-pink-600/20 to-rose-600/10 blur-[140px] rounded-full"
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-rose-500/5 blur-[160px] rounded-full" />
  </div>
);

export default function Website() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden select-none font-sans">
      <Background />
      <FloatingElements step={step} />
      <CursorTrail />

      {/* Step Progress Indicator Dots */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg"
      >
        {[0, 1, 2, 3].map((index) => {
          const isActive = step === index;
          const isCompleted = step > index;
          return (
            <motion.div
              key={index}
              animate={{
                width: isActive ? 24 : 8,
                backgroundColor: isActive
                  ? "#ec4899"
                  : isCompleted
                  ? "#f43f5e"
                  : "rgba(255, 255, 255, 0.2)",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-2 rounded-full cursor-pointer"
              onClick={() => {
                // allow clicking back or navigating freely
                setStep(index);
              }}
              title={
                index === 3
                  ? "Finale"
                  : `Screen ${index + 1}`
              }
            />
          );
        })}
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center min-h-[420px] px-2">
        <AnimatePresence mode="wait">
          {step === 0 && <Screen1 key="screen1" onNext={() => setStep(1)} />}
          {step === 1 && <Screen2 key="screen2" onNext={() => setStep(2)} />}
          {step === 2 && <Screen3 key="screen3" onNext={() => setStep(3)} />}
          {step === 3 && <FinalScreen key="final-screen" />}
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="fixed bottom-4 right-4 text-xs md:text-sm text-white/40 pointer-events-none z-40 font-light flex items-center gap-1 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-sm"
      >
        <span>Made with ❤️ by</span>
        <span className="font-semibold text-pink-300/80">Manish</span>
      </motion.div>
    </div>
  );
}
