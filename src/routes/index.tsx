import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BellOff,
  Brain,
  CalendarRange,
  Eraser,
  Lock,
  MessageSquareText,
  Sunrise,
} from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import {
  estimateMonthlyCost,
  estimatePerUserApproach,
  isReleased,
  releaseHour,
} from "@/engine/engine";
import { useToday } from "@/engine/use-today";
import { useDemoState } from "@/lib/demo-state";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Engine: a life that goes on between chats" },
      {
        name: "description",
        content:
          "A product prototype for Candy.ai: seasons, daily beats and a day block in the system prompt, so the character stops starting from zero.",
      },
      { property: "og:title", content: "Life Engine: a life between chats" },
      {
        property: "og:description",
        content: "Seasons, daily beats and a day block in the system prompt, built for retention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdeaPage,
});

const lifeEngineCost = estimateMonthlyCost({
  headCharacters: 5000,
  tailCharacters: 20000,
  headPricePerDay: 0.033,
  tailPricePerDay: 0.011,
  infra: 500,
});

const perUserCost = estimatePerUserApproach({
  sessionsPerDay: 500000,
  pricePerSession: 0.005,
});

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 sm:mt-24">
      {title ? (
        <Reveal>
          <h2 className="text-2xl sm:text-[32px] leading-tight">{title}</h2>
        </Reveal>
      ) : null}
      <div className={title ? "mt-8" : undefined}>{children}</div>
    </section>
  );
}

function Fact({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[12px] border border-line bg-surface px-4 py-3">
      <span className="mt-0.5 text-text-3" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm text-text-2">{label}</span>
    </div>
  );
}

function FlowPill({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text-2">
      {label}
    </span>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text-2">
      {label}
    </span>
  );
}

function money(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

function IdeaPage() {
  const { day, beats, payload } = useToday();
  const { hour } = useDemoState();


  const maxCost = Math.max(lifeEngineCost.total, perUserCost.total);

  const steps = [
    "Season",
    "Daily job 00:00 her time",
    "4 candidate beats",
    "2 per user",
    "released 08:00 / 19:00",
    "Candy prompt",
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
      {/* 1. Hero */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">
            Candy.ai · Senior PM case study · Retention through the companion experience
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] sm:text-[56px]">
            Give every companion a life between chats.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-2">
            Month-1 churn is ~50%. Users say she forgets, that they have to work for it, that every
            chat starts from zero. One cause: after week one, nothing happens unless the user makes
            it happen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/mia"
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white accent-ring transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              See her life
            </Link>
            <Link
              to="/integration"
              className="inline-flex items-center rounded-full border border-line bg-surface-2 px-5 py-2.5 text-sm font-medium text-text-2 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
            >
              How it plugs into Candy
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-3">
              Live from the engine · day {day} · {payload.userId} ·{" "}
              {String(hour).padStart(2, "0")}:00 her time
            </p>
            <div className="mt-4 grid gap-3">
              {beats.map((beat) =>
                isReleased(beat.slot, hour) ? (
                  <article
                    key={beat.id}
                    className="rounded-[16px] border border-line bg-surface-2 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-text">{beat.slot}</span>
                      <span className="text-xs text-text-3">{beat.mood}</span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-text-2">{beat.text}</p>
                    {beat.openQuestion ? (
                      <p className="mt-2 text-xs text-text-3">
                        still deciding: {beat.openQuestion}
                      </p>
                    ) : null}
                  </article>
                ) : (
                  <div
                    key={beat.id}
                    className="flex items-center gap-3 rounded-[16px] border border-dashed border-line bg-surface-2/50 px-4 py-5 text-sm text-text-3"
                  >
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {beat.slot === "morning" ? "Morning" : "Evening"} beat unlocks at{" "}
                    {String(releaseHour[beat.slot]).padStart(2, "0")}:00 her time
                  </div>
                ),
              )}
            </div>
          </div>

        </Reveal>
      </section>

      {/* 2. Three complaints, one cause */}
      <Section id="complaints" title="Three complaints, one cause">
        <div className="grid gap-4 sm:grid-cols-3">
          {["it forgets things", "I have to work for it", "every chat starts from zero"].map(
            (quote, i) => (
              <Reveal key={quote} delay={i * 0.05}>
                <blockquote className="h-full rounded-[20px] border border-line bg-surface p-6 font-display text-xl italic leading-snug text-text">
                  “{quote}”
                </blockquote>
              </Reveal>
            ),
          )}
        </div>

        <div className="flex justify-center">
          <span className="h-8 w-px bg-line" aria-hidden="true" />
        </div>

        <Reveal>
          <div className="panel p-6">
            <p className="text-base leading-relaxed text-text-2">
              After the first week the relationship has no engine. The character is a stateless chat
              wrapped in a persona. The user is the only source of initiative, and nothing carries
              over.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact
            icon={<Eraser className="h-4 w-4" />}
            label="Facts shared were gone about 20 turns later"
          />
          <Fact
            icon={<BellOff className="h-4 w-4" />}
            label="Characters cannot start a conversation"
          />
          <Fact
            icon={<Lock className="h-4 w-4" />}
            label="1 memory slot on Premium, 20 on Premium Plus"
          />
        </div>
      </Section>

      {/* 3. How it works */}
      <Section id="how-it-works" title="How it works">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "01",
              icon: <CalendarRange className="h-5 w-5" />,
              title: "Season",
              body: "Once per character, two or three slow storylines are seeded from her card. Four weeks long. Nothing resolves quickly.",
            },
            {
              n: "02",
              icon: <Sunrise className="h-5 w-5" />,
              title: "Her day",
              body: "A daily job writes two beats: what happened, her mood, something she has not decided, and a brief for the photo she could send. Written once, shared by everyone who talks to her.",
            },
            {
              n: "03",
              icon: <MessageSquareText className="h-5 w-5" />,
              title: "The chat",
              body: "When a chat opens, Candy pastes her day into the prompt. The model reports her day instead of inventing it.",
            },
          ].map((col, i) => (
            <Reveal key={col.n} delay={i * 0.05}>
              <div className="h-full rounded-[20px] border border-line bg-surface p-6">
                <div className="flex items-center gap-3 text-text-3">
                  <span aria-hidden="true">{col.icon}</span>
                  <span className="text-xs tracking-[0.16em]">{col.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text">{col.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{col.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 rounded-[20px] border border-line bg-surface px-5 py-4">
            {steps.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 ? <span className="h-px w-6 bg-line" aria-hidden="true" /> : null}
                <FlowPill label={step} />
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 4. Why this beats fixing memory */}
      <Section id="why" title="Why this beats fixing memory">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[20px] border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold text-text">Better memory</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-text-2">
                <li>A feature the user has to fill.</li>
                <li>Per-user cost.</li>
                <li>Collides with the memory slot paywall.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="h-full rounded-[20px] border border-line bg-surface-2 p-6">
              <h3 className="text-lg font-semibold text-text">A life of her own</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-text-2">
                <li>Content the product brings.</li>
                <li>Per-character cost.</li>
                <li>Respects pacing: one step a day, the season is the first month.</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="panel mt-6 p-6">
            <div className="grid gap-5">
              {[
                { label: `Life Engine ≈ ${money(lifeEngineCost.total)} / month`, value: lifeEngineCost.total, accent: true },
                {
                  label: `Per-user session summaries ≈ ${money(perUserCost.total)} / month`,
                  value: perUserCost.total,
                  accent: false,
                },
              ].map((bar) => (
                <div key={bar.label}>
                  <p className="text-sm text-text-2">{bar.label}</p>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-3">
                    <div
                      className={bar.accent ? "h-full rounded-full bg-accent" : "h-full rounded-full bg-text-3"}
                      style={{ width: `${(bar.value / maxCost) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-text-3">
              Assumptions, not measurements. Replace with real numbers on day one.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 5. What we would measure */}
      <Section id="measure" title="What we would measure">
        <div className="grid gap-4">
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
              items: [
                "immersion-break reports",
                "thumbs-down rate",
                "cost per active user",
              ],
            },
          ].map((row, i) => (
            <Reveal key={row.label} delay={i * 0.05}>
              <div className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line bg-surface px-5 py-4">
                <span className="text-[11px] uppercase tracking-[0.16em] text-text-3">
                  {row.label}
                </span>
                {row.items.map((item) => (
                  <Chip key={item} label={item} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6. About this prototype */}
      <Section id="about" title="About this prototype">
        <Reveal>
          <div className="grid gap-4 rounded-[20px] border border-line bg-surface p-6 text-sm leading-relaxed text-text-3 sm:grid-cols-2">
            <div className="flex gap-3">
              <Brain className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                What is real: the engine logic, the payload contract, the storyline content.
              </p>
            </div>
            <p>
              What is a placeholder: media, and the chat model is scripted unless connected.
            </p>
            <p className="sm:col-span-2">
              Framing and prioritisation with Claude, build with Lovable, storyline content edited by
              hand.
            </p>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
