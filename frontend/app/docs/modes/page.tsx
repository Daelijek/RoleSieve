import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsModes } from "@/components/docs/DocsModes";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.modes.title,
  description: dict.docs.modes.lead,
};

export default function DocsModesPage() {
  return <DocsModes />;
}
