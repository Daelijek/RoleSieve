import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { SamplePageContent } from "@/components/sample/SamplePageContent";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.productPages.sample.meta.title,
  description: dict.productPages.sample.meta.description,
};

export default function SamplePage() {
  return <SamplePageContent />;
}
