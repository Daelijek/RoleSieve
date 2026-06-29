export function ProductPageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mb-10 max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
        {title}
      </h1>
      <p className="mt-4 text-pretty text-[15px] leading-[1.65] text-[color:var(--color-text-muted)] sm:text-[16px]">
        {lead}
      </p>
    </header>
  );
}
