import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsOverview } from "@/components/docs/DocsOverview";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.overview.title,
  description: dict.docs.meta.description,
};

export default function DocsOverviewPage() {
  return <DocsOverview />;
}
