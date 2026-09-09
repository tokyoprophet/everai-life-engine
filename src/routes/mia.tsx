import { createFileRoute } from "@tanstack/react-router";

import { DemoDock } from "@/components/demo-dock";
import { PageHeader } from "@/components/page-header";
import { useToday } from "@/engine/use-today";

export const Route = createFileRoute("/mia")({
  head: () => ({
    meta: [
      { title: "Her life: Mia's season and daily beats" },
      {
        name: "description",
        content:
          "Mia, 26, freelance photographer in Lisbon. Three slow storylines over four weeks, two beats a day, morning and evening.",
      },
      { property: "og:title", content: "Her life: Mia's season and daily beats" },
      {
        property: "og:description",
        content: "Three storylines, four weeks, two beats a day in Mia's own timezone.",
      },
    ],
  }),
  component: MiaPage,
});

function MiaPage() {
  const { day, beats, arcsState } = useToday();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-32 sm:px-6">
      <PageHeader
        eyebrow="Her life"
        title="Mia's season, day by day"
        description="Three storylines seeded once from her card, then two beats a day written by the nightly job in Europe/Lisbon."
      />

      <div className="mt-10 grid gap-4">
        <p className="text-sm text-text-3">Temporary data check, day {day}.</p>
        {beats.map((beat) => (
          <article key={beat.id} className="rounded-[16px] border border-line bg-surface-2 p-5">
            <p className="text-xs uppercase tracking-widest text-text-3">
              {beat.slot} · {beat.arcId ?? "no storyline"} · {beat.mood}
            </p>
            <p className="mt-3 text-text">{beat.text}</p>
            {beat.openQuestion ? (
              <p className="mt-2 text-sm text-text-2">still deciding: {beat.openQuestion}</p>
            ) : null}
            <p className="mt-2 text-sm text-text-3">
              {beat.media.kind}: {beat.media.brief}
            </p>
          </article>
        ))}
        <div className="rounded-[16px] border border-line bg-surface p-5 text-sm text-text-2">
          {arcsState.map((arc) => (
            <p key={arc.id} className="mb-2 last:mb-0">
              <span className="text-text">{arc.title}:</span> {arc.state}
            </p>
          ))}
        </div>
      </div>

      <DemoDock />
    </div>
  );
}
