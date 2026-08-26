import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Play, Pause } from "lucide-react";

export default function FinalScreen() {
    const audioRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isOver, setIsOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const lyrics = [
        { text: "Vaada tha kab ka", start: 0.1, end: 2.1 },
        { text: "Ab jaa ke aaye", start: 2.1, end: 4.1 },
        { text: "Phir bhi ganeemat, aaye toh hain", start: 4.1, end: 7.8 },
        { text: "Aaiye, aaiye, shauq se aaiye", start: 7.8, end: 11.6 },
        { text: "Aaiye, aake iss baar na jaiye ❤️", start: 11.6, end: 14.6 }
    ];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Audio play failed (waiting for user interaction):", e));
        }
    }, [isMuted]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const time = audioRef.current.currentTime;

        const activeLyricIndex = lyrics.findIndex(
            (lyric) => time >= lyric.start && time < lyric.end
        );
        setCurrentIndex(activeLyricIndex);

        if (time >= 15.5 && !isOver) {
            setIsOver(true);
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log("Playback failed:", e));
        }
    };

    const handleToggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };

    const handleReplay = () => {
        setIsOver(false);
        setCurrentIndex(-1);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log("Replay failed:", e));
        }
    };

    return (
        <>
            {/* Music Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="fixed top-6 right-6 z-[60] flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-xl shadow-black/40"
            >
                <button
                    onClick={handlePlayPause}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 text-slate-300 hover:text-pink-400 active:scale-95 cursor-pointer"
                    title={isPlaying ? "Pause" : "Play"}
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-300 hover:fill-pink-400" />}
                </button>

                <button
                    onClick={handleToggleMute}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 text-slate-300 hover:text-pink-400 active:scale-95 cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

                <button
                    onClick={handleReplay}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 text-slate-300 hover:text-pink-400 active:scale-95 flex items-center gap-1.5 text-xs font-semibold pr-3 pl-2 cursor-pointer"
                    title="Replay"
                    aria-label="Replay audio and animation"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay</span>
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10 will-change-transform"
            >
                <audio
                    ref={audioRef}
                    src="/music.mp3"
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                <Image
                    src="/sticker.webp"
                    alt="sticker"
                    width={176}
                    height={176}
                    className="absolute w-44 -top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none h-auto"
                />

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-pink-900/20 relative overflow-hidden group min-h-50 flex flex-col items-center justify-center">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center space-y-10 w-full">
                        <div className="w-full min-h-15 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {currentIndex >= 0 && (
                                    <motion.p
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(6px)" }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -15, scale: 0.95, filter: "blur(6px)" }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 text-xl md:text-2xl font-semibold italic tracking-wide absolute w-full drop-shadow-[0_2px_10px_rgba(236,72,153,0.15)]"
                                    >
                                        {lyrics[currentIndex]?.text}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* End overlay */}
            <AnimatePresence>
                {isOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black z-50 pointer-events-auto flex flex-col items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-center space-y-4 max-w-xs px-6"
                        >
                            <p className="text-slate-400 font-light text-sm tracking-widest uppercase">The End ❤️</p>
                            <button
                                onClick={handleReplay}
                                className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-pink-300 hover:border-pink-500/30 transition-all duration-300 font-medium text-sm flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Play Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
