import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("max-w-2xl", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-3">{eyebrow}</p>
      <h1 className="mt-3 text-3xl leading-tight text-text sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-text-2">{description}</p>
    </header>
  );
}
