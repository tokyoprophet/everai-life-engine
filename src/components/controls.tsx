import { cn } from "@/lib/utils";
import { demoUsers, useEngine } from "@/lib/engine-context";
import { dayDate, days } from "@/lib/life-engine";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[12px] px-3 py-1.5 text-sm transition-colors duration-200",
        active
          ? "accent-bg text-primary-foreground"
          : "bg-surface-3/70 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function DemoControls({ showEvening = false }: { showEvening?: boolean }) {
  const { userId, setUserId, day, setDay, eveningReleased, setEveningReleased } = useEngine();
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[16px] border border-border bg-surface/70 p-3">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-subtle">Viewing as</span>
        {demoUsers.map((u) => (
          <Pill key={u.id} active={u.id === userId} onClick={() => setUserId(u.id)}>
            {u.label}
          </Pill>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-subtle">Day</span>
        {days.map((d) => (
          <Pill key={d} active={d === day} onClick={() => setDay(d)}>
            {dayDate(d).split(" ")[0]}
          </Pill>
        ))}
      </div>
      {showEvening ? (
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-subtle">Local time</span>
          <Pill active={!eveningReleased} onClick={() => setEveningReleased(false)}>
            10:00
          </Pill>
          <Pill active={eveningReleased} onClick={() => setEveningReleased(true)}>
            21:00
          </Pill>
        </div>
      ) : null}
    </div>
  );
}
