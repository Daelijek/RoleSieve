type ProductExcelPreviewProps = {
  title: string;
  lead: string;
  columnsHead: readonly string[];
  rows: readonly (readonly string[])[];
};

export function ProductExcelPreview({
  title,
  lead,
  columnsHead,
  rows,
}: ProductExcelPreviewProps) {
  return (
    <section className="mt-16">
      <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)] sm:text-[22px]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.65] text-[color:var(--color-text-muted)] sm:text-[15px]">
        {lead}
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[color:var(--color-surface-2)]/50">
              {columnsHead.map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-[color:var(--color-border-subtle)] align-top"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-[13px] leading-[1.55] text-[color:var(--color-text-muted)]"
                  >
                    {cell || (
                      <span className="text-[color:var(--color-text-subtle)]">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
