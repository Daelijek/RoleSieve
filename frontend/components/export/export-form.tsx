"use client";

import { useMemo, useRef, useState } from "react";
import { TooltipIcon } from "@/components/ui/tooltip-icon";
import { LongRunningProgress } from "@/components/ui/long-running-progress";
import {
  defaultExportPreset,
  mergeExportPreset,
  pushExportHistory,
  type ExportFormPreset,
  type ExportSummary,
} from "@/lib/export-history";
import { useI18n } from "@/lib/i18n";
import { parseApiErrorText } from "@/lib/hh-api-helpers";

function filenameFromContentDisposition(header: string | null): string {
  if (!header) return "hh_export.xlsx";
  const quoted = header.match(/filename="([^"]+)"/i);
  if (quoted?.[1]) return quoted[1];
  const plain = header.match(/filename=([^;\s]+)/i);
  if (plain?.[1]) return plain[1].replace(/"/g, "");
  return "hh_export.xlsx";
}

function linesFromTextarea(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

type PerQueryRow = { query: string; summary: ExportSummary };

export function ExportForm({
  onSummary,
  onByQuery,
  onHistoryChange,
  initialPreset,
}: {
  onSummary?: (summary: ExportSummary | null) => void;
  onByQuery?: (rows: PerQueryRow[]) => void;
  onHistoryChange?: () => void;
  initialPreset?: ExportFormPreset | null;
}) {
  const { t } = useI18n();
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "", []);
  const seed = mergeExportPreset(initialPreset ?? undefined);

  const [mode, setMode] = useState<"manual" | "auto">(seed.mode);
  const [autoVariant, setAutoVariant] = useState<"aggregate" | "per_query">(seed.autoVariant ?? "aggregate");
  const [manualLines, setManualLines] = useState(seed.manualLines);
  const [queriesText, setQueriesText] = useState(seed.queriesText);
  const [pages, setPages] = useState<number | "">(seed.pages);
  const [perPage, setPerPage] = useState<number | "">(seed.perPage);
  const [kwTopN, setKwTopN] = useState(seed.kwTopN);
  const [kwMaxNgram, setKwMaxNgram] = useState(seed.kwMaxNgram);
  const [sleepS, setSleepS] = useState(seed.sleepS);
  const [searchSleepS, setSearchSleepS] = useState(seed.searchSleepS);
  const [hhToken, setHhToken] = useState("");
  const [apiKey, setApiKey] = useState(() => process.env.NEXT_PUBLIC_API_KEY ?? "");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pollAbortRef = useRef<AbortController | null>(null);
  const byQueryAbortRef = useRef<AbortController | null>(null);
  const [jobProgress, setJobProgress] = useState<{ done: number; total: number } | null>(null);
  const [pendingDownload, setPendingDownload] = useState<{
    downloadPath: string;
    warnings: number | null;
    summary: ExportSummary | null;
    preset: ExportFormPreset;
  } | null>(null);

  type JobStatus = {
    job_id: string;
    status: string;
    kind?: string | null;
    progress_done?: number | null;
    progress_total?: number | null;
    warnings_count?: number | null;
    summary?: ExportSummary | null;
    download_url?: string | null;
  };

  function stopAllRequests() {
    abortRef.current?.abort();
    pollAbortRef.current?.abort();
    byQueryAbortRef.current?.abort();
  }

  function resetResults() {
    setPendingDownload(null);
    setJobProgress(null);
    onSummary?.(null);
    onByQuery?.([]);
  }

  function presetSnapshot(): ExportFormPreset {
    return mergeExportPreset({
      mode,
      autoVariant: mode === "auto" ? autoVariant : undefined,
      manualLines,
      queriesText,
      pages: pages === "" ? defaultExportPreset().pages : pages,
      perPage: perPage === "" ? defaultExportPreset().perPage : perPage,
      kwTopN,
      kwMaxNgram,
      sleepS,
      searchSleepS,
    });
  }

  function validateCommonAuto(): boolean {
    const queries = linesFromTextarea(queriesText);
    if (queries.length === 0) {
      setError(t("form.errNoAuto"));
      return false;
    }
    if (pages === "" || pages <= 0) {
      setError(t("form.errPagesRequired"));
      return false;
    }
    if (perPage === "" || perPage <= 0) {
      setError(t("form.errPerPageRequired"));
      return false;
    }
    return true;
  }

  async function downloadFromPath(downloadPath: string) {
    if (!baseUrl) {
      setError(t("form.errNoUrl"));
      return;
    }
    setError(null);
    setMessage(null);
    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const downloadUrl = `${baseUrl}${downloadPath}`;
      const fileResp = await fetch(downloadUrl, {
        method: "GET",
        headers: apiKey.trim() ? { "X-API-Key": apiKey.trim() } : undefined,
        signal: ac.signal,
      });
      if (!fileResp.ok) throw new Error(t("form.errDownload"));
      const blob = await fileResp.blob();
      const fileName = filenameFromContentDisposition(fileResp.headers.get("Content-Disposition"));
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(href);

      const p = pendingDownload;
      if (p?.summary) {
        pushExportHistory({
          mode: p.preset.mode,
          warnings: p.warnings,
          fileName,
          summary: { requested: p.summary.requested, processed: p.summary.processed, errors: p.summary.errors },
          preset: p.preset,
        });
        onHistoryChange?.();
      }

      setMessage(
        typeof pendingDownload?.warnings === "number" && pendingDownload.warnings > 0
          ? t("form.successWarn", { n: String(pendingDownload.warnings) })
          : t("form.success")
      );
    } catch (e) {
      const isAbort = (e instanceof DOMException && e.name === "AbortError") || (e instanceof Error && e.name === "AbortError");
      if (isAbort) {
        setMessage(t("form.exportAborted"));
        return;
      }
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  async function runExportJobOnly() {
    setError(null);
    setMessage(null);
    setJobProgress(null);
    setPendingDownload(null);
    onByQuery?.([]);

    if (!baseUrl) {
      setError(t("form.errNoUrl"));
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey.trim()) headers["X-API-Key"] = apiKey.trim();

    let url = `${baseUrl}/api/v1/export/manual/async`;
    let body: Record<string, unknown>;

    if (mode === "manual") {
      const vacancyIdsOrUrls = linesFromTextarea(manualLines);
      if (vacancyIdsOrUrls.length === 0) {
        setError(t("form.errNoManual"));
        return;
      }
      body = {
        vacancy_ids_or_urls: vacancyIdsOrUrls,
        kw_top_n: kwTopN,
        kw_max_ngram: kwMaxNgram,
        sleep_s: sleepS,
        ...(hhToken.trim() ? { token: hhToken.trim() } : {}),
      };
    } else {
      url = `${baseUrl}/api/v1/export/auto/async`;
      if (!validateCommonAuto()) return;
      const queries = linesFromTextarea(queriesText);
      body = {
        queries,
        pages,
        per_page: perPage,
        kw_top_n: kwTopN,
        kw_max_ngram: kwMaxNgram,
        sleep_s: sleepS,
        search_sleep_s: searchSleepS,
        ...(hhToken.trim() ? { token: hhToken.trim() } : {}),
      };
    }

    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const pollAc = new AbortController();
    pollAbortRef.current = pollAc;

    try {
      const startResp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: ac.signal,
      });

      if (!startResp.ok) {
        const text = await startResp.text();
        const apiErr = parseApiErrorText(text);

        const code = apiErr.code;
        const vars = apiErr.vars ?? {};
        const messageFallback = apiErr.message || startResp.statusText || t("form.errUnknown");

        if (code === "too_many_vacancies") {
          const search_countVal = vars["search_count"];
          const maxVal = vars["max"];
          const search_count = typeof search_countVal === "number" ? String(search_countVal) : undefined;
          const max = typeof maxVal === "number" ? String(maxVal) : undefined;
          setError(t("form.errTooManyVacancies", { search_count: search_count ?? "0", max: max ?? "0" }));
          return;
        }

        if (code === "invalid_vacancy_ref") {
          setError(t("form.errInvalidVacancyRef"));
          return;
        }

        if (code === "search_failed") {
          setError(t("form.errSearchFailed"));
          return;
        }

        if (code === "export_failed") {
          setError(t("form.errExportFailed"));
          return;
        }

        setError(messageFallback);
        return;
      }

      const started = (await startResp.json()) as any;
      const jobId = typeof started?.job_id === "string" ? started.job_id : "";
      if (!jobId) {
        setError(t("form.errBadJob"));
        return;
      }

      setMessage(t("form.jobStarted"));

      let last: JobStatus | null = null;
      for (let attempt = 0; attempt < 10_000; attempt++) {
        if (pollAc.signal.aborted) throw new DOMException("Aborted", "AbortError");
        const stResp = await fetch(`${baseUrl}/api/v1/jobs/${jobId}`, {
          method: "GET",
          headers: apiKey.trim() ? { "X-API-Key": apiKey.trim() } : undefined,
          signal: pollAc.signal,
        });
        if (!stResp.ok) throw new Error(t("form.errJobStatus"));
        const st = (await stResp.json()) as JobStatus;
        last = st;

        const done = typeof st.progress_done === "number" ? st.progress_done : 0;
        const total = typeof st.progress_total === "number" ? st.progress_total : 0;
        if (total > 0) setJobProgress({ done, total });

        if (st.status === "succeeded") break;
        if (st.status === "failed") throw new Error(t("form.errJobFailed"));
        await new Promise((r) => setTimeout(r, 800));
      }

      const parsedSummary = last?.summary ?? null;
      if (parsedSummary) onSummary?.(parsedSummary);
      else onSummary?.(null);

      const downloadPath = last?.download_url;
      if (!downloadPath) {
        setError(t("form.errJobNoDownload"));
        return;
      }

      setPendingDownload({
        downloadPath,
        warnings: typeof last?.warnings_count === "number" ? last.warnings_count : null,
        summary: parsedSummary,
        preset: presetSnapshot(),
      });

      setMessage(t("form.summaryReady"));
    } catch (e) {
      const isAbort = (e instanceof DOMException && e.name === "AbortError") || (e instanceof Error && e.name === "AbortError");
      if (isAbort) {
        setMessage(t("form.exportAborted"));
        return;
      }
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      abortRef.current = null;
      pollAbortRef.current = null;
    }
  }

  async function runByQuery() {
    setError(null);
    setMessage(null);
    setJobProgress(null);
    setPendingDownload(null);
    onSummary?.(null);
    onByQuery?.([]);

    if (!baseUrl) {
      setError(t("form.errNoUrl"));
      return;
    }
    if (!validateCommonAuto()) return;

    const queries = linesFromTextarea(queriesText);
    setMessage(t("form.jobStarted"));
    setBusy(true);
    const ac = new AbortController();
    byQueryAbortRef.current = ac;
    setJobProgress({ done: 0, total: queries.length });

    try {
      const limit = 3;
      const results: PerQueryRow[] = [];
      let i = 0;

      async function fetchOne(q: string): Promise<ExportSummary> {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey.trim()) headers["X-API-Key"] = apiKey.trim();
        const resp = await fetch(`${baseUrl}/api/v1/summary/auto`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            queries: [q],
            pages,
            per_page: perPage,
            kw_top_n: kwTopN,
            kw_max_ngram: kwMaxNgram,
            sleep_s: sleepS,
            search_sleep_s: searchSleepS,
            ...(hhToken.trim() ? { token: hhToken.trim() } : {}),
          }),
          signal: ac.signal,
        });
        if (!resp.ok) {
          const text = await resp.text();
          const apiErr = parseApiErrorText(text);
          const code = apiErr.code;
          const vars = apiErr.vars ?? {};
          if (code === "too_many_vacancies") {
            const search_countVal = vars["search_count"];
            const maxVal = vars["max"];
            const search_count = typeof search_countVal === "number" ? String(search_countVal) : "0";
            const max = typeof maxVal === "number" ? String(maxVal) : "0";
            throw new Error(t("form.errTooManyVacancies", { search_count, max }));
          }
          if (code === "search_failed") throw new Error(t("form.errSearchFailed"));
          throw new Error(apiErr.message || resp.statusText || t("summary.errUnknown"));
        }
        const json = (await resp.json()) as { summary?: ExportSummary };
        const s = json?.summary;
        if (!s) throw new Error(t("summary.errBadResponse"));
        return s;
      }

      async function worker() {
        while (i < queries.length) {
          if (ac.signal.aborted) return;
          const idx = i++;
          const q = queries[idx];
          const s = await fetchOne(q);
          results.push({ query: q, summary: s });
          const next = [...results].sort((a, b) => a.query.localeCompare(b.query));
          onByQuery?.(next);
          setJobProgress({ done: results.length, total: queries.length });
        }
      }

      await Promise.all(Array.from({ length: Math.min(limit, queries.length) }, () => worker()));
      onByQuery?.(results);
      setMessage(t("form.summaryReady"));
    } catch (e) {
      const isAbort = (e instanceof DOMException && e.name === "AbortError") || (e instanceof Error && e.name === "AbortError");
      if (isAbort) {
        setError(null);
        onByQuery?.([]);
        setMessage(t("form.exportAborted"));
        return;
      }
      setMessage(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setJobProgress(null);
      byQueryAbortRef.current = null;
    }
  }

  async function exportAndDownloadAutoAll() {
    setError(null);
    setMessage(null);
    setJobProgress(null);
    setPendingDownload(null);

    if (!baseUrl) {
      setError(t("form.errNoUrl"));
      return;
    }
    if (!validateCommonAuto()) return;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey.trim()) headers["X-API-Key"] = apiKey.trim();

    const queries = linesFromTextarea(queriesText);
    const body = {
      queries,
      pages,
      per_page: perPage,
      kw_top_n: kwTopN,
      kw_max_ngram: kwMaxNgram,
      sleep_s: sleepS,
      search_sleep_s: searchSleepS,
      ...(hhToken.trim() ? { token: hhToken.trim() } : {}),
    };

    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const pollAc = new AbortController();
    pollAbortRef.current = pollAc;
    try {
      const startResp = await fetch(`${baseUrl}/api/v1/export/auto/async`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: ac.signal,
      });
      if (!startResp.ok) {
        const text = await startResp.text();
        const apiErr = parseApiErrorText(text);
        const code = apiErr.code;
        const vars = apiErr.vars ?? {};
        const messageFallback = apiErr.message || startResp.statusText || t("form.errUnknown");

        if (code === "too_many_vacancies") {
          const search_countVal = vars["search_count"];
          const maxVal = vars["max"];
          const search_count = typeof search_countVal === "number" ? String(search_countVal) : undefined;
          const max = typeof maxVal === "number" ? String(maxVal) : undefined;
          setError(t("form.errTooManyVacancies", { search_count: search_count ?? "0", max: max ?? "0" }));
          return;
        }
        if (code === "search_failed") {
          setError(t("form.errSearchFailed"));
          return;
        }
        if (code === "export_failed") {
          setError(t("form.errExportFailed"));
          return;
        }
        setError(messageFallback);
        return;
      }

      const started = (await startResp.json()) as any;
      const jobId = typeof started?.job_id === "string" ? started.job_id : "";
      if (!jobId) {
        setError(t("form.errBadJob"));
        return;
      }
      setMessage(t("form.jobStarted"));

      let last: JobStatus | null = null;
      for (let attempt = 0; attempt < 10_000; attempt++) {
        if (pollAc.signal.aborted) throw new DOMException("Aborted", "AbortError");
        const stResp = await fetch(`${baseUrl}/api/v1/jobs/${jobId}`, {
          method: "GET",
          headers: apiKey.trim() ? { "X-API-Key": apiKey.trim() } : undefined,
          signal: pollAc.signal,
        });
        if (!stResp.ok) throw new Error(t("form.errJobStatus"));
        const st = (await stResp.json()) as JobStatus;
        last = st;

        const done = typeof st.progress_done === "number" ? st.progress_done : 0;
        const total = typeof st.progress_total === "number" ? st.progress_total : 0;
        if (total > 0) setJobProgress({ done, total });

        if (st.status === "succeeded") break;
        if (st.status === "failed") throw new Error(t("form.errJobFailed"));
        await new Promise((r) => setTimeout(r, 800));
      }

      const downloadPath = last?.download_url;
      if (!downloadPath) {
        setError(t("form.errJobNoDownload"));
        return;
      }
      const parsedSummary = last?.summary ?? null;

      setPendingDownload({
        downloadPath,
        warnings: typeof last?.warnings_count === "number" ? last.warnings_count : null,
        summary: parsedSummary,
        preset: mergeExportPreset({
          ...presetSnapshot(),
          mode: "auto",
          autoVariant: "aggregate",
        }),
      });

      await downloadFromPath(downloadPath);
    } catch (e) {
      const isAbort =
        (e instanceof DOMException && e.name === "AbortError") || (e instanceof Error && e.name === "AbortError");
      if (isAbort) {
        setMessage(t("form.exportAborted"));
        return;
      }
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setJobProgress(null);
      abortRef.current = null;
      pollAbortRef.current = null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    stopAllRequests();
    resetResults();
    if (mode === "auto" && autoVariant === "per_query") {
      await runByQuery();
      return;
    }
    await runExportJobOnly();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label={t("analyze.title")}>
      {!baseUrl && (
        <p
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            background: "var(--warning-bg)",
            color: "var(--warning-text)",
            borderColor: "color-mix(in srgb, var(--warning-text), transparent 55%)",
          }}
        >
          {t("form.noApiUrl")}
        </p>
      )}

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 inline-flex items-center text-sm font-medium text-[var(--muted)] lg:text-base">
          {t("form.modeLegend")}
          <TooltipIcon
            text={mode === "manual" ? t("form.modeHelpManual") : t("form.modeHelpAuto")}
            alt={t("form.tooltipAlt")}
          />
        </legend>
        <label className="surface-glass-sm anim-fade-up flex cursor-pointer items-center gap-2 p-3 text-sm lg:p-3.5 lg:text-base">
          <input
            type="radio"
            checked={mode === "manual"}
            onChange={() => {
              setMode("manual");
              resetResults();
            }}
            className="accent-[var(--primary)]"
          />
          {t("form.modeManual")}
        </label>
        <label className="surface-glass-sm anim-fade-up flex cursor-pointer items-center gap-2 p-3 text-sm lg:p-3.5 lg:text-base">
          <input
            type="radio"
            checked={mode === "auto"}
            onChange={() => {
              setMode("auto");
              resetResults();
            }}
            className="accent-[var(--primary)]"
          />
          {t("form.modeAuto")}
        </label>
      </fieldset>

      {mode === "manual" ? (
        <label className="form-field">
          <span className="form-label inline-flex items-center">
            {t("form.manualLabel")}
            <TooltipIcon text={t("form.manualLabelHelp")} alt={t("form.tooltipAlt")} />
          </span>
          <textarea
            value={manualLines}
            onChange={(e) => {
              setManualLines(e.target.value);
              resetResults();
            }}
            placeholder="131474430&#10;https://hh.ru/vacancy/131234053"
            className="input-ui min-h-40 text-sm tabular-nums lg:text-base"
            spellCheck={false}
          />
        </label>
      ) : (
        <section className="grid gap-4">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-2 inline-flex items-center text-sm font-medium text-[var(--muted)] lg:text-base">
              {t("form.autoVariantLegend")}
              <TooltipIcon text={t("form.autoVariantHelp")} alt={t("form.tooltipAlt")} />
            </legend>
            <label className="surface-glass-sm anim-fade-up flex cursor-pointer items-center gap-2 p-3 text-sm lg:p-3.5 lg:text-base">
              <input
                type="radio"
                className="accent-[var(--primary)]"
                checked={autoVariant === "aggregate"}
                onChange={() => {
                  setAutoVariant("aggregate");
                  resetResults();
                }}
              />
              {t("form.autoVariantAggregate")}
            </label>
            <label className="surface-glass-sm anim-fade-up flex cursor-pointer items-center gap-2 p-3 text-sm lg:p-3.5 lg:text-base">
              <input
                type="radio"
                className="accent-[var(--primary)]"
                checked={autoVariant === "per_query"}
                onChange={() => {
                  setAutoVariant("per_query");
                  resetResults();
                }}
              />
              {t("form.autoVariantPerQuery")}
            </label>
          </fieldset>

          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.autoLabel")}
              <TooltipIcon text={t("form.autoLabelHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <textarea
              value={queriesText}
              onChange={(e) => {
                setQueriesText(e.target.value);
                resetResults();
              }}
              className="input-ui min-h-28 text-sm lg:text-base"
              spellCheck={false}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-field">
              <span className="form-label inline-flex items-center">
                {t("form.pages")}
                <TooltipIcon text={t("form.pagesHelp")} alt={t("form.tooltipAlt")} />
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={pages}
                onChange={(e) => {
                  setPages(e.target.value === "" ? "" : Number(e.target.value));
                  resetResults();
                }}
                className="input-ui"
              />
            </label>
            <label className="form-field">
              <span className="form-label inline-flex items-center">
                {t("form.perPage")}
                <TooltipIcon text={t("form.perPageHelp")} alt={t("form.tooltipAlt")} />
              </span>
              <input
                type="number"
                min={1}
                max={100}
                value={perPage}
                onChange={(e) => {
                  setPerPage(e.target.value === "" ? "" : Number(e.target.value));
                  resetResults();
                }}
                className="input-ui"
              />
            </label>
          </div>
        </section>
      )}

      <details className="surface-glass-sm rounded-xl p-3">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--text)]">{t("summary.advanced")}</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.kwTopN")}
              <TooltipIcon text={t("form.kwTopNHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <input
              type="number"
              min={1}
              max={200}
              value={kwTopN}
              onChange={(e) => {
                setKwTopN(Number(e.target.value));
                resetResults();
              }}
              className="input-ui"
            />
          </label>
          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.kwMaxNgram")}
              <TooltipIcon text={t("form.kwMaxNgramHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <input
              type="number"
              min={1}
              max={5}
              value={kwMaxNgram}
              onChange={(e) => {
                setKwMaxNgram(Number(e.target.value));
                resetResults();
              }}
              className="input-ui"
            />
          </label>
          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.sleep")}
              <TooltipIcon text={t("form.sleepHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.05}
              value={sleepS}
              onChange={(e) => {
                setSleepS(Number(e.target.value));
                resetResults();
              }}
              className="input-ui"
            />
          </label>
          {mode === "auto" && (
            <label className="form-field">
              <span className="form-label inline-flex items-center">
                {t("form.searchSleep")}
                <TooltipIcon text={t("form.searchSleepHelp")} alt={t("form.tooltipAlt")} />
              </span>
              <input
                type="number"
                min={0}
                max={5}
                step={0.05}
                value={searchSleepS}
                onChange={(e) => {
                  setSearchSleepS(Number(e.target.value));
                  resetResults();
                }}
                className="input-ui"
              />
            </label>
          )}
          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.hhToken")}
              <TooltipIcon text={t("form.hhTokenHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <input
              type="password"
              value={hhToken}
              onChange={(e) => {
                setHhToken(e.target.value);
                resetResults();
              }}
              className="input-ui"
              autoComplete="off"
            />
          </label>
          <label className="form-field">
            <span className="form-label inline-flex items-center">
              {t("form.apiKey")}
              <TooltipIcon text={t("form.apiKeyHelp")} alt={t("form.tooltipAlt")} />
            </span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                resetResults();
              }}
              className="input-ui"
              autoComplete="off"
            />
          </label>
        </div>
      </details>

      {error && (
        <p
          className="rounded-xl border px-4 py-3 text-sm whitespace-pre-wrap"
          style={{
            background: "var(--error-bg)",
            color: "var(--error-text)",
            borderColor: "color-mix(in srgb, var(--error-text), transparent 60%)",
          }}
        >
          {error}
        </p>
      )}

      {message && (
        <p
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            background: "var(--success-bg)",
            color: "var(--success-text)",
            borderColor: "color-mix(in srgb, var(--success-text), transparent 65%)",
          }}
        >
          {message}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto lg:px-6 lg:py-3.5 lg:text-base"
        >
          {busy ? t("form.btnBusy") : t("form.btnRun")}
        </button>

        {pendingDownload?.downloadPath && (
          <button
            type="button"
            disabled={busy}
            className="btn-soft w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto lg:px-6 lg:py-3.5 lg:text-base"
            onClick={() => void downloadFromPath(pendingDownload.downloadPath)}
          >
            {t("form.btnDownload")}
          </button>
        )}

        {mode === "auto" && autoVariant === "per_query" && (
          <button
            type="button"
            disabled={busy}
            className="btn-soft w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto lg:px-6 lg:py-3.5 lg:text-base"
            onClick={() => void exportAndDownloadAutoAll()}
          >
            {t("form.btnDownload")}
          </button>
        )}
      </div>

      {mode === "auto" && autoVariant === "per_query" && (
        <p className="text-sm text-[var(--muted)] lg:text-base">{t("form.perQueryExcelNote")}</p>
      )}

      <LongRunningProgress
        visible={busy}
        variant={jobProgress ? "determinate" : "indeterminate"}
        label={
          jobProgress
            ? t("form.progressExportPct", { done: String(jobProgress.done), total: String(jobProgress.total) })
            : t("form.progressExport")
        }
        done={jobProgress?.done}
        total={jobProgress?.total}
        cancelLabel={t("form.btnCancel")}
        onCancel={() => stopAllRequests()}
      />
    </form>
  );
}
