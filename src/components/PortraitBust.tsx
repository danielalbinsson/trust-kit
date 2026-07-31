import type { Portrait } from "../data/gallery";

/** Aletheia relief bust — lit glyphs on a dark ground (same treatment as the engine UI). */
export function PortraitBust({
  portrait,
  className = "",
  compact = false,
}: {
  portrait: Portrait;
  className?: string;
  /** Tighter type for homepage cards. */
  compact?: boolean;
}) {
  // Drop leading blank rows so the relief sits in the frame.
  const rows = trimBust(portrait.bust);

  return (
    <div
      className={[
        "flex items-center justify-center bg-[#141210]",
        compact ? "aspect-[16/10] px-4 py-5" : "min-h-[280px] px-6 py-8 md:min-h-[320px] md:px-8",
        className,
      ].join(" ")}
    >
      <pre
        aria-hidden="true"
        className={[
          "m-0 select-none whitespace-pre font-mono text-[#f3ecdf]",
          "[text-shadow:0_0_1px_rgba(243,236,223,0.45),0_0_14px_rgba(79,183,221,0.25)]",
          compact
            ? "text-[7px] leading-[1.05] tracking-[0.04em] md:text-[9px]"
            : "text-[9px] leading-[1.05] tracking-[0.05em] md:text-[12px]",
        ].join(" ")}
      >
        {rows.join("\n")}
      </pre>
    </div>
  );
}

function trimBust(bust: string[]): string[] {
  let start = 0;
  let end = bust.length;
  while (start < end && bust[start].trim() === "") start += 1;
  while (end > start && bust[end - 1].trim() === "") end -= 1;
  return bust.slice(start, end);
}
