import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CursorTrail() {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, mouseX, mouseY]);

  // Spring physics configuration for a silky magnetic ribbon trail
  const springConfig = { stiffness: 280, damping: 22, mass: 0.08 };

  const s0X = useSpring(mouseX, springConfig);
  const s0Y = useSpring(mouseY, springConfig);

  const s1X = useSpring(s0X, springConfig);
  const s1Y = useSpring(s0Y, springConfig);

  const s2X = useSpring(s1X, springConfig);
  const s2Y = useSpring(s1Y, springConfig);

  const s3X = useSpring(s2X, springConfig);
  const s3Y = useSpring(s2Y, springConfig);

  const s4X = useSpring(s3X, springConfig);
  const s4Y = useSpring(s3Y, springConfig);

  const s5X = useSpring(s4X, springConfig);
  const s5Y = useSpring(s4Y, springConfig);

  const s6X = useSpring(s5X, springConfig);
  const s6Y = useSpring(s5Y, springConfig);

  const s7X = useSpring(s6X, springConfig);
  const s7Y = useSpring(s6Y, springConfig);

  const s8X = useSpring(s7X, springConfig);
  const s8Y = useSpring(s7Y, springConfig);

  const s9X = useSpring(s8X, springConfig);
  const s9Y = useSpring(s8Y, springConfig);

  const springs = [
    { x: s0X, y: s0Y, type: "head-heart" },
    { x: s1X, y: s1Y, type: "dot" },
    { x: s2X, y: s2Y, type: "sparkle" },
    { x: s3X, y: s3Y, type: "dot" },
    { x: s4X, y: s4Y, type: "mini-heart" },
    { x: s5X, y: s5Y, type: "dot" },
    { x: s6X, y: s6Y, type: "sparkle" },
    { x: s7X, y: s7Y, type: "dot" },
    { x: s8X, y: s8Y, type: "mini-heart" },
    { x: s9X, y: s9Y, type: "dot" },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden md:block select-none">
      {springs.map((spring, index) => {
        const size = Math.max(22 - index * 1.8, 6);
        const opacity = Math.max(1 - index / 10, 0.15);

        return (
          <motion.div
            key={index}
            style={{
              x: spring.x,
              y: spring.y,
              translateX: "-50%",
              translateY: "-50%",
              width: size,
              height: size,
              opacity: opacity,
            }}
            className="absolute pointer-events-none"
          >
            {spring.type === "head-heart" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {spring.type === "mini-heart" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-pink-400 filter drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {spring.type === "sparkle" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            )}

            {spring.type === "dot" && (
              <div
                style={{
                  backgroundColor: index % 2 === 0 ? "#ec4899" : "#c084fc",
                }}
                className="w-full h-full rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(236,72,153,0.6)]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
