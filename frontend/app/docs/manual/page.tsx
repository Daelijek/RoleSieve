import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsManual } from "@/components/docs/DocsManual";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.manual.title,
  description: dict.docs.manual.lead,
};

export default function DocsManualPage() {
  return <DocsManual />;
}
