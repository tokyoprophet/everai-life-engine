import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MessageSquare, Sunrise } from "lucide-react";
import { Rise } from "@/components/rise";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Engine: give every character a life between chats" },
      {
        name: "description",
        content:
          "A product demo for Candy.ai. Seasons, daily beats and a day block in the system prompt, so the character stops starting from zero.",
      },
      { property: "og:title", content: "Life Engine: a life between chats" },
      {
        property: "og:description",
        content: "Seasons, daily beats and a day block in the system prompt, built for Candy.ai retention.",
      },
    ],
  }),
  component: Overview,
});

const pillars = [
  {
    icon: CalendarDays,
    title: "Season",
    body: "Once per character, two or three slow storylines are seeded from her card and run for four weeks.",
    to: "/season" as const,
    cta: "See Mia's season",
  },
  {
    icon: Sunrise,
    title: "Her day",
    body: "A daily job writes four candidate beats per slot. Each user sees two, chosen by a hash, so days differ at no extra cost.",
    to: "/day" as const,
    cta: "Open her day",
  },
  {
    icon: MessageSquare,
    title: "The chat",
    body: "When a chat opens, the backend pastes a short day block into the system prompt. She reports her day instead of inventing one.",
    to: "/chat" as const,
    cta: "Open the chat",
  },
];

function Overview() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-16 sm:px-6 sm:pt-24">
      <Rise>
        <p className="text-sm uppercase tracking-[0.18em] text-subtle">Senior PM case, EverAI</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
          Give every character <span className="accent-text">a life that goes on</span> between chats.
        </h1>
      </Rise>
      <Rise delay={0.06}>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Around half of paid users cancel in their first month. They say she forgets, they say they have to
          do all the work. Those are one problem: after week one the relationship has no engine.
        </p>
      </Rise>
      <Rise delay={0.1}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/day"
            className="accent-bg accent-ring inline-flex items-center gap-2 rounded-[12px] px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Start the demo <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            to="/engine"
            className="inline-flex items-center gap-2 rounded-[12px] bg-surface-2 px-5 py-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            How it runs
          </Link>
        </div>
      </Rise>

      <Rise delay={0.14}>
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            ["It forgets things", "State lives in the chat window, so it dies with it."],
            ["I have to work for it", "The user is the only source of initiative."],
            ["Every chat starts from zero", "Nothing happened while they were away, because nothing could."],
          ].map(([quote, diagnosis]) => (
            <div key={quote} className="panel p-6">
              <p className="text-base text-foreground">"{quote}"</p>
              <p className="mt-3 text-sm text-muted-foreground">{diagnosis}</p>
            </div>
          ))}
        </section>
      </Rise>

      <section className="mt-20">
        <h2 className="font-display text-2xl sm:text-3xl">Three moving parts</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Rise key={p.title} delay={0.06 * i}>
              <article className="panel flex h-full flex-col p-6">
                <p.icon className="size-5 text-rose" aria-hidden />
                <h3 className="mt-4 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <Link
                  to={p.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground"
                >
                  {p.cta} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <Rise delay={0.05}>
        <section className="mt-20 panel p-6 sm:p-8">
          <h2 className="font-display text-2xl">What the engine never does</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li>It does not generate media. It writes briefs for the pipeline that already exists.</li>
            <li>It does not write per user. Four beats per slot serve every user of the character.</li>
            <li>It does not run at chat time. The day is written once, at midnight, in her timezone.</li>
            <li>It does not touch the persona card. The card seeds the season, then stays as it is.</li>
          </ul>
        </section>
      </Rise>
    </div>
  );
}
