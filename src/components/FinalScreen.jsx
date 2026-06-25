import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FinalScreen() {
    const audioRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isOver, setIsOver] = useState(false);

    const lyrics = [
        { text: "Vaada tha kab ka", duration: 2000 },
        { text: "Ab jaa ke aaye", duration: 2000 },
        { text: "Phir bhi ganeemat, aaye toh hain", duration: 3700 },
        { text: "Aaiye, aaiye, shauq se aaiye", duration: 3800 },
        { text: "Aaiye, aake iss baar na jaiye ❤️", duration: 3000 }
    ];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }

        let timeoutId;

        const advanceLyric = (index) => {
            if (index < lyrics.length) {
                timeoutId = setTimeout(() => {
                    if (index + 1 < lyrics.length) {
                        setCurrentIndex(index + 1);
                        advanceLyric(index + 1);
                    } else {
                        setTimeout(() => {
                            setIsOver(true);
                        }, 2000);
                    }
                }, lyrics[index].duration);
            }
        };

        const startDelay = setTimeout(() => {
            setCurrentIndex(0);
            advanceLyric(0);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(startDelay);
        };
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10 will-change-transform"
            >

                <audio ref={audioRef} src="/music.mp3" preload="auto" />

                <img src="sticker.webp" alt="sticker" className="absolute w-44 -top-24 left-1/2 -translate-x-1/2 z-20" />

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-pink-900/20 relative overflow-hidden group min-h-50 flex flex-col items-center justify-center">

                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center space-y-10 w-full">
                        <div className="w-full min-h-15 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(6px)" }}
                                    transition={{ duration: 0.7, ease: "easeInOut" }}
                                    className="text-center text-slate-200 text-xl md:text-2xl font-semibold italic tracking-wide absolute w-full"
                                >
                                    {currentIndex >= 0 && lyrics[currentIndex]?.text}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* The Black Overlay at the end */}
            <AnimatePresence>
                {isOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black z-50 pointer-events-auto"
                    />
                )}
            </AnimatePresence>
        </>
    );
}