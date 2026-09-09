import { useDemoState } from "@/lib/demo-state";

/** Shows how the current day was written: the live service, or the scripted season. */
export function LiveBadge({ showScripted = false }: { showScripted?: boolean }) {
  const { engineMode, liveActive, hydrated } = useDemoState();
  if (!hydrated) return null;
  if (!liveActive && !showScripted && engineMode !== "live") return null;

  return liveActive ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-success/40 bg-success/12 px-2.5 py-0.5 text-[11px] text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      live · claude
    </span>
  ) : (
    <span className="whitespace-nowrap rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11px] text-text-3">
      scripted
    </span>
  );
}
