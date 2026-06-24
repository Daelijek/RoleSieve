import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsReport } from "@/components/docs/DocsReport";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.report.title,
  description: dict.docs.report.lead,
};

export default function DocsReportPage() {
  return <DocsReport />;
}
