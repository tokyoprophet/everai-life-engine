import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { Rise } from "@/components/rise";
import { CodeBlock, DevPanel } from "@/components/dev-panel";
import { character, storylines } from "@/lib/life-engine";

export const Route = createFileRoute("/season")({
  head: () => ({
    meta: [
      { title: "Mia's season: three storylines, four weeks" },
      {
        name: "description",
        content: "How Life Engine seeds two or three slow storylines from a character card, once, for four weeks.",
      },
      { property: "og:title", content: "Mia's season: three storylines, four weeks" },
      {
        property: "og:description",
        content: "The unpaid invoice, Ana and Berlin, the film project. Seeded once from her card.",
      },
    ],
  }),
  component: SeasonPage,
});

function SeasonPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-12 sm:px-6 sm:pt-16">
      <Rise>
        <h1 className="font-display text-3xl sm:text-5xl">The season</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Seeded once per character from her card, then left alone. Three storylines, four weeks, slow enough
          that a user who returns after five days has not missed the plot.
        </p>
      </Rise>

      <Rise delay={0.06}>
        <section className="panel mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 p-6">
          <div>
            <p className="font-display text-2xl">{character.name}, {character.age}</p>
            <p className="text-sm text-muted-foreground">{character.role}</p>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-subtle" aria-hidden /> {character.city}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-subtle" aria-hidden /> {character.timezone}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-subtle" aria-hidden /> Season seeded {character.seededOn}, runs{" "}
            {character.seasonLength}
          </p>
        </section>
      </Rise>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {storylines.map((s, i) => (
          <Rise key={s.id} delay={0.05 * i}>
            <article className="panel h-full p-6">
              <span className="block h-1 w-12 rounded-full" style={{ backgroundColor: s.tint }} />
              <h2 className="mt-4 text-lg font-medium">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.premise}</p>
              <p className="mt-3 text-sm text-subtle">At stake: {s.stake}</p>
              <ol className="mt-5 space-y-3">
                {s.weeks.map((w) => (
                  <li key={w} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.tint }} />
                    {w}
                  </li>
                ))}
              </ol>
            </article>
          </Rise>
        ))}
      </div>

      <Rise delay={0.08}>
        <div className="mt-10">
          <DevPanel
            title="season seed"
            note="Run once when a character is published, or when an operator asks for a new season."
          >
            <CodeBlock
              code={`POST /v1/characters/mia/season
{
  "source": "character_card",
  "length_weeks": 4,
  "storylines": 3,
  "constraints": [
    "slow: at most one turn per week",
    "no resolution before week 4",
    "each storyline must be describable in one line"
  ]
}`}
            />
          </DevPanel>
        </div>
      </Rise>
    </div>
  );
}
