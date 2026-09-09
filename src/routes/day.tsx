import { createFileRoute } from "@tanstack/react-router";
import { Rise } from "@/components/rise";
import { BeatCard } from "@/components/beat-card";
import { DemoControls } from "@/components/controls";
import { CodeBlock, DevPanel } from "@/components/dev-panel";
import { useEngine } from "@/lib/engine-context";
import { candidates, dayDate, dayJson, hash, pickBeat } from "@/lib/life-engine";

export const Route = createFileRoute("/day")({
  head: () => ({
    meta: [
      { title: "Her day: two beats, written once, shared by everyone" },
      {
        name: "description",
        content:
          "A daily job writes four candidate beats per slot at midnight in Lisbon. Each user sees two, picked by a hash of user, day and slot.",
      },
      { property: "og:title", content: "Her day: two beats a day" },
      {
        property: "og:description",
        content: "Morning at 08:00, evening at 19:00, local time. Different users, different days, same cost.",
      },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const { userId, day, eveningReleased } = useEngine();
  const morning = pickBeat(userId, day, "morning");
  const evening = pickBeat(userId, day, "evening");
  const pool = candidates[day]!;

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-12 sm:px-6 sm:pt-16">
      <Rise>
        <h1 className="font-display text-3xl sm:text-5xl">Her day</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {dayDate(day)} in Lisbon. Two beats: what happened, how she feels, and one thing she has not
          decided. Switch user to see the same day land differently.
        </p>
      </Rise>

      <Rise delay={0.05}>
        <div className="mt-6">
          <DemoControls showEvening />
        </div>
      </Rise>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Rise delay={0.08}>
          <BeatCard beat={morning} />
        </Rise>
        <Rise delay={0.12}>
          <BeatCard beat={evening} locked={!eveningReleased} />
        </Rise>
      </div>

      <Rise delay={0.14}>
        <section className="mt-10 space-y-4">
          <DevPanel
            title="candidate pool and selection"
            note="Four beats per slot are written once for the character. Selection is a hash, not a model call."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {(["morning", "evening"] as const).map((slot) => (
                <div key={slot}>
                  <p className="text-xs uppercase tracking-wide text-subtle">{slot} pool</p>
                  <ol className="mt-2 space-y-2">
                    {pool[slot].map((b, i) => {
                      const chosen = hash(userId, day, slot) % pool[slot].length === i;
                      return (
                        <li
                          key={b.id}
                          className={
                            "rounded-[12px] p-3 text-sm " +
                            (chosen
                              ? "bg-surface-3 text-foreground"
                              : "bg-background/60 text-subtle")
                          }
                        >
                          <span className="mr-2 text-xs text-subtle">[{i}]</span>
                          {b.what}
                          {chosen ? <span className="ml-2 text-xs text-success">selected</span> : null}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
            <CodeBlock
              code={`index = fnv1a("${userId}:${day}:morning") % 4  ->  ${hash(userId, day, "morning") % 4}
index = fnv1a("${userId}:${day}:evening") % 4  ->  ${hash(userId, day, "evening") % 4}`}
            />
          </DevPanel>

          <DevPanel title="GET /v1/characters/mia/day" note="What Candy's backend reads when a chat opens.">
            <CodeBlock code={JSON.stringify(dayJson(userId, day), null, 2)} />
          </DevPanel>
        </section>
      </Rise>
    </div>
  );
}
