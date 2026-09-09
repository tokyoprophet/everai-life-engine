import { createFileRoute } from "@tanstack/react-router";
import { Rise } from "@/components/rise";
import { CodeBlock, DevPanel } from "@/components/dev-panel";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "How Life Engine runs: cron, cost and the media pipeline" },
      {
        name: "description",
        content:
          "One daily job per character at midnight local time, four beats per slot, briefs handed to the media pipeline that already exists.",
      },
      { property: "og:title", content: "How Life Engine runs" },
      {
        property: "og:description",
        content: "Cron at 00:00 local, writes shared beats, releases at 08:00 and 19:00, no per user generation.",
      },
    ],
  }),
  component: EnginePage,
});

const steps = [
  {
    time: "00:00 local",
    title: "The daily job runs",
    body: "One call per character, not per user. It reads the season, yesterday's beats and the character card, then writes four candidate beats for the morning slot and four for the evening.",
  },
  {
    time: "08:00 local",
    title: "The morning beat releases",
    body: "Any chat opened after this hour includes the morning beat in the system prompt. Before it, the day is simply not hers yet.",
  },
  {
    time: "On chat open",
    title: "The backend pastes the day block",
    body: "GET /v1/characters/{id}/day returns two beats for that user. The block is short on purpose, around eighty tokens, so it does not fight the persona.",
  },
  {
    time: "19:00 local",
    title: "The evening beat releases",
    body: "The mood can turn between morning and evening. That is the point: a user who returns at night finds a day that moved.",
  },
];

function EnginePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-12 sm:px-6 sm:pt-16">
      <Rise>
        <h1 className="font-display text-3xl sm:text-5xl">How it runs</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          One scheduled job per character per day. Nothing is generated while a user waits, and the engine
          never produces media itself.
        </p>
      </Rise>

      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <Rise key={s.title} delay={0.05 * i}>
            <li className="panel flex flex-col gap-2 p-6 sm:flex-row sm:gap-8">
              <p className="w-32 shrink-0 text-sm text-rose">{s.time}</p>
              <div>
                <h2 className="text-lg font-medium">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          </Rise>
        ))}
      </ol>

      <Rise delay={0.08}>
        <section className="panel mt-10 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Cost, honestly</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-subtle">
                <tr>
                  <th className="pb-3 font-normal">Item</th>
                  <th className="pb-3 font-normal">Frequency</th>
                  <th className="pb-3 font-normal">Scales with</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Season seed", "Once per character, per season", "Characters"],
                  ["Daily beats, 8 candidates", "Once per character, per day", "Characters"],
                  ["Beat selection", "Per chat open", "Nothing, it is a hash"],
                  ["Day block in the prompt", "Per chat open", "About 80 tokens"],
                  ["Photo, voice, video", "Only when the existing pipeline sends one", "2, 1 and 10 tokens"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    <td className="py-3 text-foreground">{row[0]}</td>
                    <td className="py-3">{row[1]}</td>
                    <td className="py-3">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-subtle">
            A character with ten thousand users costs the same to run as a character with ten.
          </p>
        </section>
      </Rise>

      <Rise delay={0.1}>
        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <h2 className="text-lg font-medium">What we would measure</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Day 30 retention on paid, split by characters with and without a season.</li>
              <li>Share of sessions opened by her, not by the user.</li>
              <li>Median days between a user's first and second week of activity.</li>
              <li>Media accept rate when the brief comes from a beat, against today's baseline.</li>
            </ul>
          </div>
          <div className="panel p-6">
            <h2 className="text-lg font-medium">Known risks</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>A shared day can collide with a user's own version of events. The block is small so the model can yield.</li>
              <li>Storylines that resolve too fast leave the character flat in week five. Seasons are re seeded, not extended.</li>
              <li>Beats that drift from the card break the persona. Every beat is checked against the card before release.</li>
            </ul>
          </div>
        </section>
      </Rise>

      <Rise delay={0.12}>
        <div className="mt-10 space-y-4">
          <DevPanel title="scheduler" note="One entry per character, in her own timezone.">
            <CodeBlock
              code={`# 00:00 Europe/Lisbon
0 0 * * *  write_day --character mia --candidates 4 --slots morning,evening

# release gates are read at request time, not scheduled
morning -> 08:00 local
evening -> 19:00 local`}
            />
          </DevPanel>
          <DevPanel title="media handoff" note="The engine emits briefs. It never calls an image or voice model.">
            <CodeBlock
              code={`POST /internal/media/proactive
{
  "character_id": "mia",
  "user_id": "u_8412",
  "source_beat": "day-3-evening",
  "type": "photo",
  "tokens": 2,
  "brief": "Prints laid in a grid on the floor, three set aside, bare feet at the edge."
}`}
            />
          </DevPanel>
        </div>
      </Rise>
    </div>
  );
}
