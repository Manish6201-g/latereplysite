import { useEffect, useRef, useState } from "react";

// A stable deterministic function to decide particle type (heart/bubble) based on index
// to avoid accessing ref during render
function getIsHeart(i) {
  return (i * 7 + 3) % 10 < 6; // Roughly 60% hearts with a pseudo-random pattern
}

export default function FloatingElements({ step }) {
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef([]);
  const domRefs = useRef([]);
  const dimensions = useRef({ width: 1000, height: 800 });
  const prevStep = useRef(step);

  // Set mounted on client to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Initial particle generation & main update loop
  useEffect(() => {
    if (!mounted) return;

    // Track mouse coordinates
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const width = dimensions.current.width;
    const height = dimensions.current.height;

    // Generate stable particles pool
    const tempParticles = [];

    // 1. Ambient particles (continually rising)
    const NUM_AMBIENT = 25;
    for (let i = 0; i < NUM_AMBIENT; i++) {
      const size = Math.random() * 24 + 14; // sizes from 14px to 38px
      const isHeart = getIsHeart(i);
      const baseVy = -(Math.random() * 0.6 + 0.5); // float up speed
      const baseVx = (Math.random() - 0.5) * 0.3; // gentle side drift
      
      tempParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        size,
        isHeart,
        scale: Math.random() * 0.3 + 0.85,
        opacity: Math.random() * 0.25 + 0.2, // 0.2 to 0.45 opacity
        targetOpacity: Math.random() * 0.2 + 0.25,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayRange: Math.random() * 40 + 20,
        swayOffset: Math.random() * 100,
        isBurst: false,
        active: true,
        life: 1.0,
      });
    }

    // 2. Burst particles (normally inactive, explode on step transition)
    const NUM_BURST = 25;
    for (let i = 0; i < NUM_BURST; i++) {
      const index = NUM_AMBIENT + i;
      const size = Math.random() * 20 + 12; // sizes from 12px to 32px
      const isHeart = getIsHeart(index);
      
      tempParticles.push({
        x: -100,
        y: -100,
        vx: 0,
        vy: 0,
        baseVx: 0,
        baseVy: -(Math.random() * 0.8 + 0.6), // natural drift up
        size,
        isHeart,
        scale: 0,
        opacity: 0,
        targetOpacity: Math.random() * 0.3 + 0.5, // Brighter for burst (0.5 to 0.8)
        swaySpeed: Math.random() * 0.03 + 0.015,
        swayRange: Math.random() * 25 + 10,
        swayOffset: Math.random() * 100,
        isBurst: true,
        active: false,
        life: 0,
      });
    }

    particlesRef.current = tempParticles;

    let animationFrameId;
    let time = 0;

    // Repel physics parameters
    const REPEL_RADIUS = 150;
    const REPEL_STRENGTH = 0.5;

    const update = () => {
      time += 1;
      const currentWidth = dimensions.current.width;
      const currentHeight = dimensions.current.height;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dom = domRefs.current[i];
        if (!p || !dom) continue;

        // If inactive burst particle, keep hidden
        if (p.isBurst && !p.active) {
          dom.style.transform = "translate3d(-1000px, -1000px, 0) scale(0)";
          dom.style.opacity = 0;
          continue;
        }

        // Calculate distance from mouse
        const pCenterX = p.x + p.size / 2;
        const pCenterY = p.y + p.size / 2;
        const dx = pCenterX - mouse.x;
        const dy = pCenterY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 5) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          // Repel vector away from mouse
          const pushX = (dx / dist) * force * REPEL_STRENGTH * 2;
          const pushY = (dy / dist) * force * REPEL_STRENGTH * 2;

          p.vx += pushX;
          p.vy += pushY;
        }

        if (!p.isBurst) {
          // Ambient physics
          // Slow down velocity back to baseline drift
          p.vx = p.vx * 0.94 + p.baseVx * 0.06;
          p.vy = p.vy * 0.94 + p.baseVy * 0.06;

          // Apply horizontal swaying
          const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayRange * 0.02;
          
          p.x += p.vx + sway;
          p.y += p.vy;

          // Boundary wrap
          if (p.y < -50) {
            p.y = currentHeight + 50;
            p.x = Math.random() * currentWidth;
            p.vx = p.baseVx;
            p.vy = p.baseVy;
          } else if (p.y > currentHeight + 100) {
            p.y = -50;
            p.x = Math.random() * currentWidth;
          }

          if (p.x < -p.size - 50) {
            p.x = currentWidth + 50;
          } else if (p.x > currentWidth + 50) {
            p.x = -p.size - 50;
          }
        } else {
          // Burst physics
          // Decay initial burst speed towards gentle floating
          p.vx *= 0.95;
          p.vy = p.vy * 0.94 + p.baseVy * 0.06;

          const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayRange * 0.015;

          p.x += p.vx + sway;
          p.y += p.vy;

          // Decay life span
          p.life -= 0.006; // fade out over approx 166 frames (~2.7s)
          
          if (p.life <= 0 || p.y < -50 || p.x < -100 || p.x > currentWidth + 100) {
            p.active = false;
            p.opacity = 0;
            p.scale = 0;
          } else {
            // Smoothly ease opacity and scale out
            p.opacity = Math.min(p.life * 2, 1) * p.targetOpacity;
            p.scale = Math.min(p.life * 1.5, 1) * (0.8 + Math.random() * 0.2);
          }
        }

        // Apply visual updates directly to the DOM to avoid React re-renders
        dom.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`;
        dom.style.opacity = p.opacity;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  // Trigger burst when screen changes
  useEffect(() => {
    if (!mounted) return;
    
    // Trigger splash/burst animation if step has progressed
    if (step !== prevStep.current) {
      prevStep.current = step;
      
      const width = dimensions.current.width;
      const height = dimensions.current.height;
      
      // Center of screen/action area
      const startX = width / 2;
      const startY = height * 0.65; // around button area

      const particles = particlesRef.current;
      const NUM_AMBIENT = 25; // Burst particles occupy index 25 to 49

      for (let i = NUM_AMBIENT; i < particles.length; i++) {
        const p = particles[i];
        if (p) {
          p.active = true;
          // Random offset around click source
          p.x = startX + (Math.random() - 0.5) * 60;
          p.y = startY + (Math.random() - 0.5) * 60;
          
          // Explosion angle pointing upwards and outwards
          const angle = Math.PI * 1.1 + Math.random() * Math.PI * 0.8; // angle pointing up (roughly 198 to 342 deg)
          const speed = Math.random() * 9 + 5; // velocity
          
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          
          p.scale = Math.random() * 0.4 + 0.6; // scale 0.6 to 1.0
          p.life = 1.0; // full life
        }
      }
    }
  }, [step, mounted]);

  if (!mounted) return null;

  // Render stable divs that will be mutated by the animationFrame loop
  const totalParticles = 50; // 25 Ambient + 25 Burst
  const tempArray = Array.from({ length: totalParticles });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {tempArray.map((_, i) => {
        const isHeart = getIsHeart(i);
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
            {isHeart ? (
              <svg
                viewBox="0 0 24 24"
                className="fill-pink-500/15 stroke-pink-500/30 stroke-[0.5] drop-shadow-[0_0_6px_rgba(236,72,153,0.15)]"
                style={{ width: "100%", height: "100%" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <div 
                className="w-full h-full rounded-full border border-purple-500/20 bg-gradient-to-tr from-pink-500/5 to-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]" 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
