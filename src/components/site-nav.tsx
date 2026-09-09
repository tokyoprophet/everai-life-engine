import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Overview" },
  { to: "/season", label: "Season" },
  { to: "/day", label: "Her day" },
  { to: "/chat", label: "Chat" },
  { to: "/engine", label: "How it runs" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="accent-bg flex size-7 items-center justify-center rounded-[12px]">
            <Sparkles className="size-4 text-primary-foreground" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">Life Engine</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-8 text-sm text-subtle sm:px-6">
        Life Engine, a product concept for Candy.ai. Mia is fictional, the demo is SFW on purpose.
      </div>
    </footer>
  );
}
