import { Check, X } from "lucide-react";
import { useEffect } from "react";

import { useDemoState } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

export function FirstRunGuide() {
  const { guideDismissed, dismissGuide, dayRead, markDayRead, stances, day, userId, hydrated } =
    useDemoState();

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(markDayRead, 1200);
    return () => window.clearTimeout(t);
  }, [hydrated, markDayRead]);

  if (!hydrated || guideDismissed) return null;

  const steps = [
    { label: "Read her day", done: dayRead },
    { label: "Tell her what to do about Duarte (in the chat)", done: Boolean(stances["duarte"]) },
    { label: "Advance the day and switch user", done: day > 1 && userId === "user-B" },
  ];

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                step.done
                  ? "border-success/60 bg-success/15 text-success"
                  : "border-line bg-surface text-text-3",
              )}
            >
              {step.done ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
            </span>
            <span className={step.done ? "text-success" : "text-text-2"}>{step.label}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={dismissGuide}
        aria-label="Dismiss the guide"
        className="self-start rounded-full p-1.5 text-text-3 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet sm:self-auto"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
