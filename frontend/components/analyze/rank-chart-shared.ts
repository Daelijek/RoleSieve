/** Paired rank charts (skills + phrases) use the same row count and list height. */
export const RANK_CHART_VISIBLE_ROWS = 10;

export const rankChartListClass =
  "flex flex-1 flex-col justify-start space-y-3 min-h-[calc(10*2.25rem+9*0.75rem)]";

export const rankChartCardClass =
  "flex h-full flex-col bg-[color:var(--color-surface)]/40 p-5 sm:p-7";

/** Body area below panel title — fills paired row height without extra bottom gap. */
export const resultsPanelBodyClass = "flex flex-1 flex-col justify-center";

export const rankChartRowClass = "flex min-h-9 items-center gap-3";
