import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorTrail() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const springConfig = { stiffness: 220, damping: 25, mass: 0.1 };

  // Explicit hook calls for each step of the trail to satisfy React rules-of-hooks
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

  const springs = [
    { x: s0X, y: s0Y },
    { x: s1X, y: s1Y },
    { x: s2X, y: s2Y },
    { x: s3X, y: s3Y },
    { x: s4X, y: s4Y },
    { x: s5X, y: s5Y },
    { x: s6X, y: s6Y },
    { x: s7X, y: s7Y }
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden md:block">
      {springs.map((spring, index) => {
        const size = 14 - index * 1.5;
        const opacity = 1 - index / 8;

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
            {index === 0 ? (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-pink-500 filter drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <div
                style={{
                  backgroundColor: index % 2 === 0 ? "#ec4899" : "#a855f7",
                }}
                className="w-full h-full rounded-full blur-[1px] shadow-[0_0_6px_rgba(236,72,153,0.4)]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
