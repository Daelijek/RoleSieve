import type { Dictionary } from "./ru";

// English translation — to be filled in. For now we re-export the Russian
// dictionary as a placeholder so the type stays valid and components can
// reference `en` once translations are ready.
import { ru } from "./ru";

export const en: Dictionary = ru;
