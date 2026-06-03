"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Run on mount instead of waiting for scroll-into-view (use for above-the-fold). */
  immediate?: boolean;
  /** y-axis offset in px. */
  offset?: number;
  className?: string;
} & Omit<
  HTMLMotionProps<"div">,
  | "children"
  | "initial"
  | "animate"
  | "whileInView"
  | "viewport"
  | "transition"
>;

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Reveal({
  children,
  delay = 0,
  immediate = false,
  offset = 10,
  className,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  const initial = { opacity: 0, y: offset };
  const final = { opacity: 1, y: 0 };
  const transition = { duration: 0.6, ease, delay };

  if (immediate) {
    return (
      <motion.div
        initial={initial}
        animate={final}
        transition={transition}
        className={className}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={final}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
