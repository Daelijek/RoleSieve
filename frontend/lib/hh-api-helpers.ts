export type ApiErrorDetail = { error?: string; message?: string } & Record<string, unknown>;

export function parseApiErrorText(text: string): { code?: string; message?: string; vars?: Record<string, unknown> } {
  try {
    const json = JSON.parse(text);
    const detail = json?.detail;
    if (detail && typeof detail === "object") {
      const d = detail as ApiErrorDetail;
      const code = typeof d.error === "string" ? d.error : undefined;
      const message = typeof d.message === "string" ? d.message : undefined;
      return { code, message, vars: d };
    }
    if (typeof detail === "string") return { message: detail };
    return { message: text };
  } catch {
    return { message: text };
  }
}

/** GET with per-request timeout; user abort still wins. */
export async function fetchWithTimeout(
  url: string,
  pollSignal: AbortSignal,
  fetchTimeoutMs: number,
  init?: Omit<RequestInit, "signal">,
): Promise<Response> {
  if (pollSignal.aborted) throw new DOMException("Aborted", "AbortError");

  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.any === "function") {
    const timeoutCtrl = new AbortController();
    const tid = setTimeout(() => timeoutCtrl.abort(), fetchTimeoutMs);
    pollSignal.addEventListener(
      "abort",
      () => {
        clearTimeout(tid);
        timeoutCtrl.abort();
      },
      { once: true },
    );
    try {
      return await fetch(url, { ...init, signal: AbortSignal.any([pollSignal, timeoutCtrl.signal]) });
    } finally {
      clearTimeout(tid);
    }
  }

  const req = fetch(url, { ...init, signal: pollSignal });
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutReq = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new DOMException("Timeout", "AbortError")), fetchTimeoutMs);
    pollSignal.addEventListener(
      "abort",
      () => {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
  try {
    return await Promise.race([req, timeoutReq]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

