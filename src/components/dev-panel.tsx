import { useState, type ReactNode } from "react";
import { ChevronDown, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function DevPanel({
  title,
  note,
  children,
  defaultOpen = false,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[16px] border border-border bg-surface-2/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Terminal className="size-4 text-subtle" aria-hidden />
        <span className="text-sm font-medium text-muted-foreground">Developer view: {title}</span>
        <ChevronDown
          aria-hidden
          className={cn("ml-auto size-4 text-subtle transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-4 py-4">
          {note ? <p className="text-xs text-subtle">{note}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-[12px] bg-background/80 p-4 text-[12px] leading-relaxed text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}
