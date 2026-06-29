import { Code2, Compass, PanelsTopLeft, Server, type LucideIcon } from "lucide-react";
import type { ProductPresetId } from "@/lib/product-demo/types";

export const PRESET_ICON: Record<ProductPresetId, LucideIcon> = {
  python: Code2,
  frontend: PanelsTopLeft,
  product: Compass,
  devops: Server,
};
