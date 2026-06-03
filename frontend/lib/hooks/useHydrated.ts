"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** True only after client hydration — server snapshot is always false. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
