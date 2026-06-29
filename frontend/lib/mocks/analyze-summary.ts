import { getDict } from "@/lib/i18n";
import { buildDemoRun } from "@/lib/product-demo/build-demo-run";

const pythonDemo = buildDemoRun("python", getDict());

export const mockAnalyzeRunMeta = pythonDemo.meta;
export const mockExportSummary = pythonDemo.summary;
export const mockKpiSparklines = pythonDemo.sparklines;
