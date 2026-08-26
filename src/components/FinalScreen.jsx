import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Play, Pause, Music, Heart } from "lucide-react";

export default function FinalScreen() {
    const audioRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isOver, setIsOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);

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
                .then(() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                })
                .catch((e) => {
                    console.log("Audio autoplay restricted:", e);
                    setAutoplayBlocked(true);
                });
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
                .then(() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                })
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
        setAutoplayBlocked(false);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log("Replay failed:", e));
        }
    };

    return (
        <>
            {/* Music Controls Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="fixed top-6 right-6 z-[60] flex items-center gap-2 bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl shadow-black/50"
            >
                {/* Audio Equalizer animation when playing */}
                <div className="flex items-end gap-[2px] h-4 px-2 select-none">
                    <span className={`w-1 bg-pink-400 rounded-full ${isPlaying ? 'animate-bar-1' : 'h-1'}`} />
                    <span className={`w-1 bg-rose-400 rounded-full ${isPlaying ? 'animate-bar-2' : 'h-2'}`} />
                    <span className={`w-1 bg-purple-400 rounded-full ${isPlaying ? 'animate-bar-3' : 'h-1'}`} />
                    <span className={`w-1 bg-pink-400 rounded-full ${isPlaying ? 'animate-bar-4' : 'h-2'}`} />
                </div>

                <div className="w-[1px] h-4 bg-white/10" />

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
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="w-[1px] h-4 bg-white/10" />

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

            {/* Main Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm relative z-10 will-change-transform"
            >
                <audio
                    ref={audioRef}
                    src="/music.mp3"
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => {
                        setIsPlaying(true);
                        setAutoplayBlocked(false);
                    }}
                    onPause={() => setIsPlaying(false)}
                />

                <Image
                    src="/sticker.webp"
                    alt="sticker"
                    width={176}
                    height={176}
                    className="absolute w-44 -top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none h-auto filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />

                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-pink-900/30 relative overflow-hidden group min-h-[220px] flex flex-col items-center justify-center border-t-white/20">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
                        
                        {/* Audio Autoplay Fallback Trigger */}
                        {autoplayBlocked && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handlePlayPause}
                                className="px-5 py-2.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-200 text-xs font-semibold flex items-center gap-2 shadow-lg hover:bg-pink-500/30 transition-all cursor-pointer"
                            >
                                <Music className="w-4 h-4 animate-bounce" />
                                <span>Tap to start music 🎵</span>
                            </motion.button>
                        )}

                        {/* Synced Lyrics Container */}
                        <div className="w-full min-h-[64px] flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {currentIndex >= 0 && (
                                    <motion.p
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(8px)" }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(8px)" }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-purple-200 text-xl md:text-2xl font-bold italic tracking-wide absolute w-full drop-shadow-[0_2px_12px_rgba(236,72,153,0.3)] px-2"
                                    >
                                        {lyrics[currentIndex]?.text}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* End Romantic Overlay */}
            <AnimatePresence>
                {isOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black/95 z-50 pointer-events-auto flex flex-col items-center justify-center p-6 backdrop-blur-lg"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                            className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl shadow-rose-950/50 relative overflow-hidden"
                        >
                            <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex justify-center">
                                <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/30">
                                    <Heart className="w-10 h-10 text-rose-400 fill-rose-400 animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300">
                                    Happy Ending ❤️
                                </h2>
                                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                                    Thanks for staying till the end! Hope this brought a smile to your face.
                                </p>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <button
                                    onClick={handleReplay}
                                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-pink-600/30 via-rose-600/30 to-purple-600/30 border border-rose-500/40 hover:border-rose-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Play Again</span>
                                </button>
                                <button
                                    onClick={() => setIsOver(false)}
                                    className="w-full px-6 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
