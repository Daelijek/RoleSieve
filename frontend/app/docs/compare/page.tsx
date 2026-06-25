import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsCompare } from "@/components/docs/DocsCompare";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.compare.title,
  description: dict.docs.compare.lead,
};

export default function DocsComparePage() {
  return <DocsCompare />;
}
