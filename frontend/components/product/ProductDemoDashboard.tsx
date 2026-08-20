"use client";

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
  return (
    <ProductAppFrame>
      <ResultsDashboard
        variant="demo"
        interactive={interactive}
        accent={accent}
        zoneInfo={zoneInfo}
        summary={demoRun.summary}
        meta={demoRun.meta}
        sparklines={demoRun.sparklines}
      />
    </ProductAppFrame>
  );
}
