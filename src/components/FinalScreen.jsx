import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function FinalScreen() {
  const prefersReducedMotion = useReducedMotion();

  const audioRef = useRef(null);
  const timeoutsRef = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isOver, setIsOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const lyrics = useMemo(
    () => [
      { text: "Vaada tha kab ka", duration: 2000 },
      { text: "Ab jaa ke aaye", duration: 2000 },
      { text: "Phir bhi ganeemat, aaye toh hain", duration: 3700 },
      { text: "Aaiye, aaiye, shauq se aaiye", duration: 3800 },
      { text: "Aaiye, aake iss baar na jaiye ❤️", duration: 3000 },
    ],
    []
  );

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const start = async () => {
    if (isStarted) return;
    setIsStarted(true);

    // Start audio (best-effort). If blocked, lyrics still progress.
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (e) {
        // autoplay restrictions can block play; user gesture already happened
        console.log("Audio play failed:", e);
      }
    }

    clearAllTimeouts();
    setCurrentIndex(0);

    const advanceLyric = (index) => {
      if (index < lyrics.length - 1) {
        const id = setTimeout(() => {
          setCurrentIndex(index + 1);
          advanceLyric(index + 1);
        }, lyrics[index].duration);
        timeoutsRef.current.push(id);
      } else {
        const id = setTimeout(() => {
          setIsOver(true);
        }, 2000);
        timeoutsRef.current.push(id);
      }
    };

    // Keep initial beat slightly delayed for nicer entrance.
    const id = setTimeout(() => {
      advanceLyric(0);
    }, 100);
    timeoutsRef.current.push(id);
  };

  const replay = () => {
    setIsOver(false);
    setCurrentIndex(-1);
    setIsStarted(false);
    clearAllTimeouts();

    // Attempt immediate start; if browser blocks, user can tap start again.
    start();
  };

  useEffect(() => {
    // Best-effort autoplay for desktop.
    // If it fails (or reduced motion is enabled), user can tap to start.
    if (!prefersReducedMotion) {
      start();
    }

    return () => {
      clearAllTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);


  const lyricMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0, y: 0, scale: 1 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 0, scale: 1 },
      }
    : {
        initial: { opacity: 0, y: 20, scale: 0.95, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, y: -20, scale: 0.95, filter: "blur(6px)" },
      };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10 will-change-transform"
      >
        <audio ref={audioRef} src="/music.mp3" preload="auto" />

        <img
          src="sticker.webp"
          alt="sticker"
          className="absolute w-44 -top-24 left-1/2 -translate-x-1/2 z-20"
        />

        <div className="bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl shadow-pink-900/20 relative overflow-hidden group min-h-50 flex flex-col items-center justify-center">

          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />


          <div className="relative z-10 flex flex-col items-center space-y-10 w-full">
            <div className="w-full min-h-15 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentIndex}
                  {...lyricMotion}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="text-center text-slate-200 text-xl md:text-2xl font-semibold italic tracking-wide absolute w-full"
                >
                  {currentIndex >= 0 ? lyrics[currentIndex]?.text : ""}
                </motion.p>
              </AnimatePresence>
            </div>

            {!isStarted && (
              <button
                onClick={start}
                className="px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-pink-500/50 transition-all duration-300 text-slate-300 hover:text-pink-300 shadow-lg font-medium"
                aria-label="Tap to start music"
              >
                Tap to start music 🎶
              </button>
            )}
          </div>

        </div>
      </motion.div>

      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/95 z-50 pointer-events-auto flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: "easeOut" }}
              className="w-full max-w-sm bg-slate-900/70 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl">❤️</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-200 text-center">
                Happy ending ❤️
              </h2>
              <p className="mt-2 text-slate-400 text-center leading-relaxed">
                You made it. Replay the lyrics or watch it again.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={replay}
                  className="px-6 py-3 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/30 transition-all duration-300 text-rose-200 font-semibold"
                >
                  Replay
                </button>
                <button
                  onClick={() => {
                    // lightweight dismiss: just fade overlay out (keep state)
                    setIsOver(false);
                  }}
                  className="px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-300 text-slate-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

