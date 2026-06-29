"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ProductDemoRun, ProductInsightZone } from "@/lib/product-demo/types";
import { ResultsDashboard } from "@/components/analyze/ResultsDashboard";
import { ProductAppFrame } from "./ProductAppFrame";

type ZoneInfo = { title: string; description: string };

type ProductDemoDashboardProps = {
  demoRun: ProductDemoRun;
  interactive?: boolean;
  accent?: string;
  zoneInfo?: Partial<Record<ProductInsightZone, ZoneInfo>>;
};

export function ProductDemoDashboard({
  demoRun,
  interactive = false,
  accent,
  zoneInfo,
}: ProductDemoDashboardProps) {
  const reduce = useReducedMotion();

  return (
    <ProductAppFrame>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={demoRun.meta.runId}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ResultsDashboard
            variant="demo"
            interactive={interactive}
            accent={accent}
            zoneInfo={zoneInfo}
            summary={demoRun.summary}
            meta={demoRun.meta}
            sparklines={demoRun.sparklines}
          />
        </motion.div>
      </AnimatePresence>
    </ProductAppFrame>
  );
}
