import { useEffect, useRef, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// Deterministic function to pick particle style (filled heart, outline heart, sparkle star, glowing orb)
function getParticleType(i) {
  const mod = (i * 7 + 3) % 10;
  if (mod < 4) return "heart-fill";      // 40% filled hearts
  if (mod < 7) return "heart-outline";   // 30% outline hearts
  if (mod < 9) return "sparkle";         // 20% sparkle stars
  return "orb";                          // 10% soft glowing orbs
}

export default function FloatingElements({ step }) {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const particlesRef = useRef([]);
  const domRefs = useRef([]);
  const dimensions = useRef({ width: 1000, height: 800 });
  const prevStep = useRef(step);

  // Track screen size
  useEffect(() => {
    if (!mounted) return;
    const updateDimensions = () => {
      dimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [mounted]);

  // Main animation loop
  useEffect(() => {
    if (!mounted) return;

    // Track mouse coordinates for interactive magnetic repel
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const width = dimensions.current.width;
    const height = dimensions.current.height;

    const tempParticles = [];

    // 1. Ambient particles (35 particles floating upwards continually)
    const NUM_AMBIENT = 35;
    for (let i = 0; i < NUM_AMBIENT; i++) {
      const size = Math.random() * 14 + 14; // balanced medium sizes: 14px to 28px
      const type = getParticleType(i);
      const baseVy = -(Math.random() * 0.6 + 0.3); // float up speed
      const baseVx = (Math.random() - 0.5) * 0.3; // side drift
      const rotation = Math.random() * 360;
      const rotSpeed = (Math.random() - 0.5) * 0.8;

      tempParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        size,
        type,
        rotation,
        rotSpeed,
        scale: Math.random() * 0.3 + 0.75, // scale 0.75x to 1.05x
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * 10,
        opacity: Math.random() * 0.25 + 0.2,
        targetOpacity: Math.random() * 0.2 + 0.3,
        swaySpeed: Math.random() * 0.018 + 0.006,
        swayRange: Math.random() * 35 + 15,
        swayOffset: Math.random() * 100,
        isBurst: false,
        active: true,
        life: 1.0,
      });
    }

    // 2. Burst particles (35 particles that explode outwards on step change)
    const NUM_BURST = 35;
    for (let i = 0; i < NUM_BURST; i++) {
      const index = NUM_AMBIENT + i;
      const size = Math.random() * 12 + 10; // balanced burst sizes: 10px to 22px
      const type = getParticleType(index);
      const rotation = Math.random() * 360;
      const rotSpeed = (Math.random() - 0.5) * 1.5;

      tempParticles.push({
        x: -1000,
        y: -1000,
        vx: 0,
        vy: 0,
        baseVx: 0,
        baseVy: -(Math.random() * 0.8 + 0.4),
        size,
        type,
        rotation,
        rotSpeed,
        scale: 0,
        opacity: 0,
        targetOpacity: Math.random() * 0.3 + 0.4,
        swaySpeed: Math.random() * 0.03 + 0.015,
        swayRange: Math.random() * 30 + 10,
        swayOffset: Math.random() * 100,
        pulseSpeed: Math.random() * 0.05 + 0.02,
        pulseOffset: Math.random() * 10,
        isBurst: true,
        active: false,
        life: 0,
      });
    }

    particlesRef.current = tempParticles;

    let animationFrameId;
    let time = 0;

    const REPEL_RADIUS = 160;
    const REPEL_STRENGTH = 0.6;

    const update = () => {
      time += 1;
      const currentWidth = dimensions.current.width;
      const currentHeight = dimensions.current.height;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dom = domRefs.current[i];
        if (!p || !dom) continue;

        dom.style.width = `${p.size}px`;
        dom.style.height = `${p.size}px`;

        if (p.isBurst && !p.active) {
          dom.style.transform = "translate3d(-1000px, -1000px, 0) scale(0)";
          dom.style.opacity = 0;
          continue;
        }

        // Magnetic repel from cursor
        const pCenterX = p.x + p.size / 2;
        const pCenterY = p.y + p.size / 2;
        const dx = pCenterX - mouse.x;
        const dy = pCenterY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 5) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          const pushX = (dx / dist) * force * REPEL_STRENGTH * 2.5;
          const pushY = (dy / dist) * force * REPEL_STRENGTH * 2.5;
          p.vx += pushX;
          p.vy += pushY;
        }

        p.rotation += p.rotSpeed;

        if (!p.isBurst) {
          // Ambient particles logic
          p.vx = p.vx * 0.94 + p.baseVx * 0.06;
          p.vy = p.vy * 0.94 + p.baseVy * 0.06;

          const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayRange * 0.02;
          const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.15 + 1;

          p.x += p.vx + sway;
          p.y += p.vy;

          const currentScale = p.scale * pulse;

          // Boundary wrapping
          if (p.y < -60) {
            p.y = currentHeight + 60;
            p.x = Math.random() * currentWidth;
            p.vx = p.baseVx;
            p.vy = p.baseVy;
          } else if (p.y > currentHeight + 100) {
            p.y = -60;
            p.x = Math.random() * currentWidth;
          }

          if (p.x < -p.size - 60) {
            p.x = currentWidth + 60;
          } else if (p.x > currentWidth + 60) {
            p.x = -p.size - 60;
          }

          dom.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg) scale(${currentScale})`;
          dom.style.opacity = p.opacity;
        } else {
          // Burst particles logic
          p.vx *= 0.94;
          p.vy = p.vy * 0.94 + p.baseVy * 0.06;

          const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayRange * 0.015;
          p.x += p.vx + sway;
          p.y += p.vy;

          p.life -= 0.005;

          if (p.life <= 0 || p.y < -60 || p.x < -100 || p.x > currentWidth + 100) {
            p.active = false;
            p.opacity = 0;
            p.scale = 0;
          } else {
            p.opacity = Math.min(p.life * 2.5, 1) * p.targetOpacity;
            const currentScale = Math.min(p.life * 2, 1) * p.scale;
            dom.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg) scale(${currentScale})`;
            dom.style.opacity = p.opacity;
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  // Burst explosion on screen change
  useEffect(() => {
    if (!mounted) return;

    if (step !== prevStep.current) {
      prevStep.current = step;

      const width = dimensions.current.width;
      const height = dimensions.current.height;

      const startX = width / 2;
      const startY = height * 0.6;

      const particles = particlesRef.current;
      const NUM_AMBIENT = 35;

      for (let i = NUM_AMBIENT; i < particles.length; i++) {
        const p = particles[i];
        if (p) {
          p.active = true;
          p.x = startX + (Math.random() - 0.5) * 80;
          p.y = startY + (Math.random() - 0.5) * 80;

          // 360 degree radial explosion
          const angle = Math.PI * 2 * Math.random();
          const speed = Math.random() * 11 + 6;

          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed - 2; // slightly upward bias

          p.scale = Math.random() * 0.5 + 0.7;
          p.life = 1.0;
        }
      }
    }
  }, [step, mounted]);

  if (!mounted) return null;

  const totalParticles = 70; // 35 ambient + 35 burst
  const tempArray = Array.from({ length: totalParticles });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {tempArray.map((_, i) => {
        const type = getParticleType(i);
        return (
          <div
            key={i}
            ref={(el) => (domRefs.current[i] = el)}
            style={{
              position: "absolute",
              transform: "translate3d(-1000px, -1000px, 0) scale(0)",
              opacity: 0,
              willChange: "transform, opacity",
            }}
            className="pointer-events-none"
          >
            {type === "heart-fill" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-pink-500/25 stroke-pink-400/40 stroke-[0.8] filter drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {type === "heart-outline" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-rose-500/10 stroke-rose-400/60 stroke-[1.5] filter drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {type === "sparkle" && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-pink-300/40 stroke-purple-300/60 stroke-[0.5] filter drop-shadow-[0_0_8px_rgba(216,180,254,0.5)]"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            )}

            {type === "orb" && (
              <div className="w-full h-full rounded-full border border-purple-400/30 bg-gradient-to-tr from-pink-500/10 to-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.3)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
