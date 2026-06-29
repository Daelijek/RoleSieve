"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ProductPresetId } from "@/lib/product-demo/types";
import { PRESET_THEME } from "@/lib/product-demo/preset-theme";

export function ProductAccentBackdrop({
  presetId,
}: {
  presetId: ProductPresetId;
}) {
  const reduce = useReducedMotion();
  const { primary, secondary } = PRESET_THEME[presetId];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={presetId}
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Primary, top-right — dominant segment color */}
          <div
            className="absolute h-[940px] w-[940px] rounded-full blur-[150px]"
            style={{
              top: "-300px",
              right: "-240px",
              background: `radial-gradient(circle at center, rgb(${primary} / 0.42) 0%, rgb(${primary} / 0.13) 46%, transparent 72%)`,
            }}
          />
          {/* Primary, mid-left — keeps the dominant hue across the page */}
          <div
            className="absolute h-[680px] w-[680px] rounded-full blur-[150px]"
            style={{
              top: "32%",
              left: "-220px",
              background: `radial-gradient(circle at center, rgb(${primary} / 0.3) 0%, rgb(${primary} / 0.1) 46%, transparent 72%)`,
            }}
          />
          {/* Primary, center glow */}
          <div
            className="absolute left-1/2 top-1/4 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-[170px]"
            style={{
              background: `radial-gradient(circle at center, rgb(${primary} / 0.18) 0%, transparent 70%)`,
            }}
          />
          {/* Secondary, bottom-left — complementary accent */}
          <div
            className="absolute h-[760px] w-[760px] rounded-full blur-[150px]"
            style={{
              bottom: "-320px",
              left: "-160px",
              background: `radial-gradient(circle at center, rgb(${secondary} / 0.3) 0%, rgb(${secondary} / 0.09) 46%, transparent 72%)`,
            }}
          />
          {/* Secondary, bottom-right — complementary accent */}
          <div
            className="absolute h-[600px] w-[600px] rounded-full blur-[160px]"
            style={{
              bottom: "-220px",
              right: "-140px",
              background: `radial-gradient(circle at center, rgb(${secondary} / 0.22) 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
