import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsQuickstart } from "@/components/docs/DocsQuickstart";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.quickstart.title,
  description: dict.docs.quickstart.lead,
};

export default function DocsQuickstartPage() {
  return <DocsQuickstart />;
}
