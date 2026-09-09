import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { LiveBadge } from "@/components/live-badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "The idea" },
  { to: "/mia", label: "Her life" },
  { to: "/chat", label: "The chat" },
  { to: "/engine", label: "Control room" },
  { to: "/integration", label: "For Candy" },
] as const;

const linkBase =
  "rounded-full px-3 py-1.5 text-sm text-text-2 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function Wordmark() {
  return (
    <Link
      to="/"
      aria-label="Life Engine home"
      className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
    >
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-accent text-[13px] font-semibold text-white"
      >
        L
      </span>
      <span className="text-sm font-medium text-text">Life Engine</span>
      <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
      <span className="hidden text-sm text-text-3 sm:block">Candy.ai case study</span>
    </Link>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark />
          <LiveBadge />
        </div>


        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-surface-2 text-text" }}
              className={linkBase}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-2 text-text-2 md:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-line bg-surface">
            <SheetTitle className="text-sm text-text-3">Navigate</SheetTitle>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "bg-surface-2 text-text" }}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-text-2 transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-8 text-sm text-text-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Prototype for the EverAI Senior PM case study. Media are placeholders on purpose:
          every brief is born from a story beat.
        </p>
        <p className="shrink-0 text-text-2">Alex Koval</p>
      </div>
    </footer>
  );
}
