"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDict } from "@/lib/i18n";
import { buildDemoRun } from "@/lib/product-demo/build-demo-run";
import { DEFAULT_PRODUCT_PRESET_ID } from "@/lib/product-demo/preset-ids";
import { presetAccent } from "@/lib/product-demo/preset-theme";
import type { ProductPresetId } from "@/lib/product-demo/types";
import { ProductPageShell } from "@/components/product/ProductPageShell";
import { ProductPageHeader } from "@/components/product/ProductPageHeader";
import { ProductPresetPicker } from "@/components/product/ProductPresetPicker";
import { ProductAccentBackdrop } from "@/components/product/ProductAccentBackdrop";
import { ProductDemoDashboard } from "@/components/product/ProductDemoDashboard";
import { ProductExcelPreview } from "@/components/product/ProductExcelPreview";

export function SamplePageContent() {
  const dict = useDict();
  const sample = dict.productPages.sample;

  const [presetId, setPresetId] = useState<ProductPresetId>(
    DEFAULT_PRODUCT_PRESET_ID,
  );

  const demoRun = useMemo(
    () => buildDemoRun(presetId, dict),
    [presetId, dict],
  );

  const accent = presetAccent(presetId);

  return (
    <ProductPageShell>
      <ProductAccentBackdrop presetId={presetId} />

      <ProductPageHeader
        eyebrow={sample.eyebrow}
        title={sample.title}
        lead={sample.lead}
      />

      <ProductPresetPicker
        label={sample.presetPickerLabel}
        value={presetId}
        onChange={setPresetId}
      />

      <ProductDemoDashboard
        demoRun={demoRun}
        interactive
        accent={accent}
        zoneInfo={sample.zones}
      />

      <ProductExcelPreview
        title={sample.excel.title}
        lead={sample.excel.lead}
        columnsHead={sample.excel.columnsHead}
        rows={sample.excel.rows}
      />

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          href="/analyze"
          size="lg"
          trailing={<ArrowRight size={16} strokeWidth={2.25} />}
        >
          {sample.cta}
        </Button>
        <Link
          href="/docs/report"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-violet transition-colors hover:text-[color:var(--color-text-primary)]"
        >
          {sample.docsLink}
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </div>

      <p className="mt-8 rounded-2xl border border-violet/25 bg-[color:var(--color-violet)]/8 px-5 py-4 text-[14px] leading-[1.65] text-[color:var(--color-text-muted)]">
        {sample.note}
      </p>
    </ProductPageShell>
  );
}
