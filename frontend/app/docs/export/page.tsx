import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsExport } from "@/components/docs/DocsExport";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.export.title,
  description: dict.docs.export.lead,
};

export default function DocsExportPage() {
  return <DocsExport />;
}
