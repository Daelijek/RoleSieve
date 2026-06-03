"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    restDelta: 0.001,
  });

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[2px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[color:var(--color-border-subtle)]/40" />
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="absolute inset-0 bg-[image:var(--signature-gradient)] opacity-80"
      />
    </div>
  );
}
