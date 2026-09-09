import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/integration")({
  head: () => ({
    meta: [
      { title: "For Candy: one GET when a chat opens" },
      {
        name: "description",
        content:
          "One endpoint, one prompt block and briefs that feed the existing proactive media pipeline. No new media generation.",
      },
      { property: "og:title", content: "For Candy: one GET when a chat opens" },
      {
        property: "og:description",
        content: "The API, the design decisions, the rollout and how we would measure it.",
      },
    ],
  }),
  component: IntegrationPage,
});

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-20">
      <h2 className="font-display text-2xl text-text sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const LANES = ["User", "Candy backend", "Life Engine", "Chat model"] as const;

const STEPS: { from: number; to: number; label: string }[] = [
  { from: 0, to: 1, label: "opens the chat" },
  { from: 1, to: 2, label: "GET /v1/characters/{id}/day?user_id&hour" },
  { from: 2, to: 1, label: "DayPayload, cached by character and day" },
  { from: 1, to: 3, label: "pastes injectionBlock into the system prompt" },
  { from: 3, to: 0, label: "replies, reporting her day" },
  { from: 1, to: 2, label: "nightly: scheduler POST /internal/tick per active character" },
];

function SequenceDiagram() {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5">
      <div className="grid grid-cols-4 gap-2">
        {LANES.map((lane) => (
          <div
            key={lane}
            className="rounded-[12px] border border-line bg-surface-2 px-2 py-2 text-center text-[11px] text-text-2 sm:text-xs"
          >
            {lane}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {STEPS.map((step, i) => {
          const left = Math.min(step.from, step.to);
          const right = Math.max(step.from, step.to);
          const forward = step.to > step.from;
          return (
            <div
              key={i}
              className="rise-in grid grid-cols-4 items-center gap-2"
              style={{ animationDelay: `${i * 120}ms` }}
            >
                <div className="col-span-4">
                  <svg
                    viewBox="0 0 400 34"
                    preserveAspectRatio="none"
                    className="h-9 w-full"
                    role="img"
                    aria-label={`Step ${i + 1}: from ${LANES[step.from]} to ${LANES[step.to]}, ${step.label}`}
                  >
                    {LANES.map((_, laneIndex) => (
                      <line
                        key={laneIndex}
                        x1={50 + laneIndex * 100}
                        x2={50 + laneIndex * 100}
                        y1={0}
                        y2={34}
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth={1}
                      />
                    ))}
                    <line
                      x1={50 + left * 100}
                      x2={50 + right * 100}
                      y1={17}
                      y2={17}
                      stroke="#FF4F8B"
                      strokeWidth={1.5}
                    />
                    <polygon
                      points={
                        forward
                          ? `${50 + right * 100},17 ${44 + right * 100},13 ${44 + right * 100},21`
                          : `${50 + left * 100},17 ${56 + left * 100},13 ${56 + left * 100},21`
                      }
                      fill="#8A5CFF"
                    />
                  </svg>
                </div>
                <p className="col-span-4 -mt-2 text-xs leading-relaxed text-text-2">
                  <span className="mr-2 font-mono text-[10px] text-text-3">
                    0{i + 1}
                  </span>
                  {step.label}
                </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ENDPOINTS: {
  method: string;
  path: string;
  purpose: string;
  caller: string;
  example: string;
}[] = [
  {
    method: "GET",
    path: "/v1/characters/{id}/day",
    purpose: "Her day for this user, ready to paste into the prompt.",
    caller: "Candy backend, when a chat session opens.",
    example: `{
  "characterId": "mia",
  "day": 3,
  "date": "2026-09-11",
  "tz": "Europe/Lisbon",
  "askedAt": "21:00",
  "userId": "user-A",
  "generatedOncePerCharacter": true,
  "beats": [
    {
      "id": "d3-evening-v1",
      "slot": "evening",
      "availableAt": "2026-09-11T19:00:00",
      "released": true,
      "arc": "duarte",
      "mood": "wired",
      "text": "sent the firm email. with the late fee.",
      "openQuestion": "whether to call him tomorrow",
      "media": { "kind": "photo", "brief": "her laptop on the balcony, sent mail open", "premium": false }
    }
  ],
  "arcs": [
    { "id": "duarte", "title": "The unpaid invoice", "state": "Firm email with late fee sent.", "tension": 8 }
  ],
  "usageHint": "These are things that actually happened to the character today..."
}`,
  },
  {
    method: "POST",
    path: "/v1/characters/{id}/season",
    purpose: "Once per character: turns a character card into three storylines.",
    caller: "Candy, at character creation or backfill.",
    example: `{
  "characterId": "mia",
  "seasonStart": "2026-09-08",
  "arcs": [
    { "id": "duarte", "title": "The unpaid invoice", "summary": "Duarte owes 1,800 euro and keeps saying next week." },
    { "id": "ana", "title": "Ana and Berlin", "summary": "Ana has an offer. Mia could lose her person and half the rent." },
    { "id": "film", "title": "The film project", "summary": "40 rolls in a shoebox and a zine she keeps postponing." }
  ]
}`,
  },
  {
    method: "POST",
    path: "/internal/tick",
    purpose: "The daily job: writes four candidate beats for one character.",
    caller: "Scheduler at 00:00 in the character's timezone.",
    example: `{
  "day": 4,
  "generatedBy": "scheduler",
  "ms": 1840
}`,
  },
];

const DECISIONS: { claim: string; reason: string }[] = [
  {
    claim: "Generated once per character, not per user",
    reason: "Cost scales with the catalogue, not with the number of subscribers.",
  },
  {
    claim: "Four candidates, two per user",
    reason: "Variation between users at no extra generation cost, from a hash of the user id.",
  },
  {
    claim: "Her day runs in her timezone",
    reason: "Morning and evening mean something, and the fiction holds when she is asleep.",
  },
  {
    claim: "Injection, not tool calls",
    reason: "One block in the system prompt, no extra latency and no new failure modes in the chat loop.",
  },
  {
    claim: "The service stores nothing about the user",
    reason: "It reads a user id to pick a variant. Memory stays where it already lives.",
  },
  {
    claim: "Media is a brief, not a file",
    reason: "The existing proactive pipeline keeps ownership of generation, cost and moderation.",
  },
  {
    claim: "Consistency by construction",
    reason: "State first, then the text and the media brief are written from that state.",
  },
];

const MILESTONES: { when: string; what: string }[] = [
  { when: "Week 1", what: "Diagnostics and seed arcs." },
  { when: "Week 2", what: "Service up in shadow, cancel-flow pause offer live." },
  { when: "Weeks 3 to 5", what: "Integration behind a flag, and evals." },
  { when: "Week 6", what: "A/B on 100% of new subscribers, randomised by user." },
  { when: "Weeks 7 to 10", what: "Iterate, extend to user-created characters." },
  { when: "Weeks 11 to 13", what: "First full month-1 read, ramp if it holds." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Won't a shared story break the 'she only talks to me' feeling?",
    a: "Each user sees two of four candidates, and what she says next depends on what that user told her. The events are shared, the relationship is not. Users already accept that a character has a fixed persona and backstory.",
  },
  {
    q: "Why injection instead of tool calls?",
    a: "A tool call adds a round trip and a new way for the chat to fail. The day is a short block of text that the model already knows how to use, fetched once when the session opens.",
  },
  {
    q: "What about user-created characters?",
    a: "The same season endpoint turns any character card into three storylines. We would start with the head catalogue, then generate lazily on first chat for the long tail.",
  },
  {
    q: "What about Digital Twins?",
    a: "A twin is a person with a real life, so the engine takes their own routines and calendar as input instead of inventing arcs. Same block, different source.",
  },
  {
    q: "What would make you kill it?",
    a: "No movement on month-1 churn after a full read, or immersion-break reports and thumbs-down rising against the control arm. Cost is the least likely reason to stop.",
  },
];

function IntegrationPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-24 sm:px-6">
      <PageHeader
        eyebrow="For Candy"
        title="One GET when a chat opens."
        description="The service sits next to the chat. Your model, your prompt, your media pipeline stay as they are. We only give her something to talk about."
      />

      <Section title="How a session runs">
        <SequenceDiagram />
      </Section>

      <Section title="API reference">
        <div className="grid gap-4 lg:grid-cols-3">
          {ENDPOINTS.map((e) => (
            <article key={e.path} className="rounded-[20px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${
                    e.method === "GET"
                      ? "border border-success/30 bg-success/12 text-success"
                      : "border border-warning/30 bg-warning/12 text-warning"
                  }`}
                >
                  {e.method}
                </span>
                <code className="font-mono text-xs text-text">{e.path}</code>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-2">{e.purpose}</p>
              <p className="mt-2 text-xs text-text-3">Who calls it: {e.caller}</p>
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-text-3 hover:text-text-2">
                  Example response
                </summary>
                <pre className="mt-3 max-h-72 overflow-auto rounded-[12px] border border-line bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-text-2">
                  {e.example}
                </pre>
              </details>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Design decisions">
        <div className="grid gap-4 md:grid-cols-2">
          {DECISIONS.map((d, i) => (
            <div
              key={d.claim}
              className="rise-in rounded-[16px] border border-line bg-surface p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
                <p className="text-sm font-semibold text-text">{d.claim}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-2">{d.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rollout">
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[720px] items-stretch gap-3">
            {MILESTONES.map((m, i) => (
              <div key={m.when} className="relative flex-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  {i < MILESTONES.length - 1 ? (
                    <span className="h-px flex-1 bg-line" aria-hidden="true" />
                  ) : null}
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text-3">
                  {m.when}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-2">{m.what}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Measurement">
        <div className="rounded-[20px] border border-line bg-surface p-5">
          {[
            { label: "Primary", items: ["month-1 churn (A/B, new subscribers)"] },
            {
              label: "Leading",
              items: [
                "return within 48h",
                "D7 and D14 return",
                "sessions per week",
                "opener reply rate",
                "media unlocks per session",
              ],
            },
            {
              label: "Guardrails",
              items: ["immersion-break reports", "thumbs-down rate", "cost per active user"],
            },
          ].map((row) => (
            <div key={row.label} className="flex flex-wrap items-center gap-3 border-b border-line py-3 first:pt-0">
              <span className="text-[11px] uppercase tracking-[0.16em] text-text-3">
                {row.label}
              </span>
              {row.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-text-2"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
          <p className="mt-4 text-sm leading-relaxed text-text-2">
            Baseline renewal 50%, detect 5 points at alpha 0.05 and power 0.8: about 1,600
            subscribers per arm. The wait is the month, not the sample.
          </p>
        </div>
      </Section>

      <Section title="Questions we expect">
        <Accordion type="single" collapsible className="rounded-[20px] border border-line bg-surface px-5">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-line">
              <AccordionTrigger className="text-left text-sm text-text hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-text-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </div>
  );
}
