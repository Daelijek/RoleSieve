import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { DocsFaq } from "@/components/docs/DocsFaq";

const dict = getDict();

export const metadata: Metadata = {
  title: dict.docs.faq.title,
  description: dict.docs.faq.lead,
};

export default function DocsFaqPage() {
  return <DocsFaq />;
}
