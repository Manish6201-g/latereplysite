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
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
  </div>
);

export default function Website() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Background />
      <FloatingElements step={step} />
      <CursorTrail />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center min-h-[360px]">
        <AnimatePresence mode="wait">
          {step === 0 && <Screen1 key="screen1" onNext={() => setStep(1)} />}
          {step === 1 && <Screen2 key="screen2" onNext={() => setStep(2)} />}
          {step === 2 && <Screen3 key="screen3" onNext={() => setStep(3)} />}
          {step === 3 && <FinalScreen key="final-screen" />}
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
        }}
        className="fixed bottom-4 right-4 text-sm text-white/40 pointer-events-none z-50 font-light"
      >
        Made with ❤️ by Manish
      </motion.div>
    </div>
  );
}





