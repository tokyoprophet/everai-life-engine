import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  Check,
  Clock,
  Copy,
  Layers,
  ListChecks,
  Play,
  RotateCcw,
  Send,
  Shuffle,
} from "lucide-react";

import { DemoDock } from "@/components/demo-dock";
import { JsonView } from "@/components/json-view";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  estimateMonthlyCost,
  estimatePerUserApproach,
  isReleased,
  variantForUser,
} from "@/engine/engine";
import { MAX_DAY, season } from "@/engine/season";
import type { Beat } from "@/engine/types";
import { useToday } from "@/engine/use-today";
import { useDemoState } from "@/lib/demo-state";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "Control room: run the daily job and read the payload" },
      {
        name: "description",
        content:
          "One job per character per day. Run it, switch user, move the clock, and read the payload Candy would receive.",
      },
      { property: "og:title", content: "Control room: run the daily job" },
      {
        property: "og:description",
        content: "Candidates, payload, system prompt and the cost model, in one place.",
      },
    ],
  }),
  component: EnginePage,
});

type TabKey = "candidates" | "payload" | "prompt" | "cost";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Pipeline({
  running,
  onSelect,
}: {
  running: boolean;
  onSelect: (tab: TabKey) => void;
}) {
  const { userId, hour } = useDemoState();
  const { day, payload } = useToday();
  const releasedCount = payload.beats.filter((b) => b.released).length;
  const mv = variantForUser(userId, day, "morning");
  const ev = variantForUser(userId, day, "evening");

  const nodes = [
    {
      icon: Layers,
      title: "Season",
      line: "Seeded once from her card",
      value: `${season.arcs.length} storylines · 4 weeks`,
      tab: "candidates" as TabKey,
    },
    {
      icon: CalendarClock,
      title: "Daily job",
      line: "00:00 Europe/Lisbon",
      value: `day ${day} written`,
      tab: "candidates" as TabKey,
    },
    {
      icon: ListChecks,
      title: "4 candidate beats",
      line: "Written once per character",
      value: `day ${day} · 4 beats`,
      tab: "candidates" as TabKey,
    },
    {
      icon: Shuffle,
      title: "Pick 2 per user",
      line: "Hash of user id, day and slot",
      value: `${userId} → m:v${mv}, e:v${ev}`,
      tab: "candidates" as TabKey,
    },
    {
      icon: Clock,
      title: "Release schedule",
      line: "08:00 and 19:00 her time",
      value: `${String(hour).padStart(2, "0")}:00 · ${releasedCount} released`,
      tab: "payload" as TabKey,
    },
    {
      icon: Send,
      title: "Payload to Candy",
      line: "Pasted into the system prompt",
      value: `GET /day · user ${userId}`,
      tab: "prompt" as TabKey,
    },
  ];

  return (
    <div className="mt-10 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {nodes.map((node, i) => (
        <div key={node.title} className="relative">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className={`absolute -top-2 left-1/2 hidden h-2 w-px -translate-x-1/2 xl:-left-2 xl:top-1/2 xl:h-px xl:w-4 xl:translate-x-0 xl:block ${
                running ? "bg-rose" : "bg-line"
              }`}
            />
          ) : null}
          <button
            type="button"
            onClick={() => onSelect(node.tab)}
            className={`h-full w-full rounded-[16px] border bg-surface p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40 ${
              running ? "border-rose/40" : "border-line hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-2">
              <node.icon className="h-4 w-4 text-text-3" aria-hidden="true" />
              <span className="font-mono text-[10px] text-text-3">
                0{i + 1}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-text">{node.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-3">{node.line}</p>
            <p className="mt-2 text-xs tabular-nums text-text-2">{node.value}</p>
          </button>
        </div>
      ))}
    </div>
  );
}

function CandidateCard({
  beat,
  picked,
  userId,
}: {
  beat: Beat;
  picked: boolean;
  userId: string;
}) {
  return (
    <article
      className={`rounded-[16px] border bg-surface p-4 transition-opacity ${
        picked ? "border-rose/50 ring-1 ring-rose/40" : "border-line opacity-50"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-2">{beat.slot}</span>
        <span className="font-mono text-[10px] text-text-3">v{beat.variant}</span>
        {beat.arcId ? (
          <span className="rounded-full border border-violet/30 bg-violet/12 px-2 py-0.5 text-[10px] text-violet">
            {beat.arcId}
          </span>
        ) : null}
        {!picked ? (
          <span className="ml-auto text-[10px] text-text-3">not shown to {userId}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-2">{beat.text}</p>
    </article>
  );
}

function CostTab() {
  const [headCharacters, setHead] = useState(5000);
  const [tailCharacters, setTail] = useState(20000);
  const [headPricePerDay, setHeadPrice] = useState(0.033);
  const [tailPricePerDay, setTailPrice] = useState(0.011);
  const [infra, setInfra] = useState(500);
  const [sessionsPerDay, setSessions] = useState(500000);
  const [pricePerSession, setPricePerSession] = useState(0.005);

  const engine = estimateMonthlyCost({
    headCharacters,
    tailCharacters,
    headPricePerDay,
    tailPricePerDay,
    infra,
  });
  const perUser = estimatePerUserApproach({ sessionsPerDay, pricePerSession });
  const ratio = engine.total > 0 ? perUser.total / engine.total : 0;
  const money = (n: number) => `$${Math.round(n).toLocaleString("en-GB")}`;

  const sliders: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    set: (n: number) => void;
    format: (n: number) => string;
  }[] = [
    {
      label: "Head characters",
      value: headCharacters,
      min: 0,
      max: 20000,
      step: 500,
      set: setHead,
      format: (n) => n.toLocaleString("en-GB"),
    },
    {
      label: "Tail characters",
      value: tailCharacters,
      min: 0,
      max: 100000,
      step: 1000,
      set: setTail,
      format: (n) => n.toLocaleString("en-GB"),
    },
    {
      label: "Price per head day",
      value: headPricePerDay,
      min: 0.01,
      max: 0.1,
      step: 0.001,
      set: setHeadPrice,
      format: (n) => `$${n.toFixed(3)}`,
    },
    {
      label: "Price per tail day",
      value: tailPricePerDay,
      min: 0.001,
      max: 0.05,
      step: 0.001,
      set: setTailPrice,
      format: (n) => `$${n.toFixed(3)}`,
    },
    {
      label: "Infra per month",
      value: infra,
      min: 0,
      max: 5000,
      step: 100,
      set: setInfra,
      format: money,
    },
  ];

  const comparison: typeof sliders = [
    {
      label: "Sessions per day",
      value: sessionsPerDay,
      min: 0,
      max: 2000000,
      step: 50000,
      set: setSessions,
      format: (n) => n.toLocaleString("en-GB"),
    },
    {
      label: "Price per session",
      value: pricePerSession,
      min: 0.001,
      max: 0.02,
      step: 0.001,
      set: setPricePerSession,
      format: (n) => `$${n.toFixed(3)}`,
    },
  ];

  const renderSlider = (s: (typeof sliders)[number]) => (
    <div key={s.label}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-3">{s.label}</span>
        <span className="tabular-nums text-text-2">{s.format(s.value)}</span>
      </div>
      <Slider
        className="mt-2"
        aria-label={s.label}
        value={[s.value]}
        min={s.min}
        max={s.max}
        step={s.step}
        onValueChange={(v) => s.set(v[0] ?? s.value)}
      />
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-text">Life Engine</p>
        <div className="mt-4 space-y-5">{sliders.map(renderSlider)}</div>
        <p className="mt-6 font-display text-4xl text-text tabular-nums">
          {money(engine.total)}
          <span className="ml-2 text-sm text-text-3">/ month</span>
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-text">Per-user session summaries</p>
        <div className="mt-4 space-y-5">{comparison.map(renderSlider)}</div>
        <p className="mt-6 font-display text-4xl text-text tabular-nums">
          {money(perUser.total)}
          <span className="ml-2 text-sm text-text-3">/ month</span>
        </p>
      </div>
      <p className="text-sm leading-relaxed text-text-2 lg:col-span-2">
        Life Engine grows with characters. Session summaries grow with users. At these
        numbers the difference is {ratio.toFixed(1)} times.
      </p>
    </div>
  );
}

function EnginePage() {
  const { userId, hour, day, setUser, setHour, advanceDay, reset } = useDemoState();
  const { payload, injection, beats: picked } = useToday();
  const [tab, setTab] = useState<TabKey>("candidates");
  const [writing, setWriting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const panelsRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const candidates = season.days[day] ?? [];
  const pickedIds = new Set(picked.map((b) => b.id));

  function runDay() {
    const started = performance.now();
    setWriting(true);
    const next = advanceDay();
    timer.current = window.setTimeout(() => {
      setWriting(false);
      const seconds = (performance.now() - started) / 1000;
      setStatus(
        `Day ${Math.min(MAX_DAY, day + 1)} written once for every user · ${seconds.toFixed(1)}s · scripted · ${next.length} shown to ${userId}`,
      );
    }, 900);
  }

  function focusPanels(next: TabKey) {
    setTab(next);
    setHighlight(false);
    panelsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(() => setHighlight(true));
  }

  const endpoint = `GET /api/v1/characters/mia/day?user_id=${userId}&day=${day}&hour=${hour}`;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-32 sm:px-6">
      <PageHeader
        eyebrow="Control room"
        title="One job per character per day."
        description="This is the whole service. Run the daily job, switch the user, move the clock, and watch the payload Candy would receive."
      />

      <Pipeline running={writing} onSelect={focusPanels} />

      <section className="mt-8 rounded-[20px] border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm tabular-nums text-text">
            Day {day}
          </span>
          <div className="flex rounded-full border border-line bg-surface-2 p-1" role="group" aria-label="User">
            {(["user-A", "user-B"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUser(u)}
                className={`rounded-full px-3 py-1.5 text-sm ${u === userId ? "bg-accent text-white" : "text-text-3 hover:text-text"}`}
              >
                {u}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-line bg-surface-2 p-1" role="group" aria-label="Her time">
            {([9, 21] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHour(h)}
                className={`rounded-full px-3 py-1.5 text-sm tabular-nums ${h === hour ? "bg-accent text-white" : "text-text-3 hover:text-text"}`}
              >
                {String(h).padStart(2, "0")}:00
              </button>
            ))}
            <span className="self-center px-2 text-xs text-text-3">her time</span>
          </div>
          <button
            type="button"
            onClick={runDay}
            disabled={day >= MAX_DAY || writing}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Advance day
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setStatus(null);
            }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-text-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>

        <p className="mt-4 min-h-5 font-mono text-xs text-text-3" aria-live="polite">
          {writing ? "writing four candidate beats…" : status}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {writing
            ? [0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-[16px] bg-surface-2" />
              ))
            : candidates.map((beat) => (
                <CandidateCard
                  key={beat.id}
                  beat={beat}
                  picked={pickedIds.has(beat.id)}
                  userId={userId}
                />
              ))}
        </div>
      </section>

      <div ref={panelsRef} className="mt-8 scroll-mt-24">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className="bg-surface-2">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="payload">Payload</TabsTrigger>
            <TabsTrigger value="prompt">System prompt</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
          </TabsList>

          <div
            className={`mt-4 rounded-[20px] border border-line bg-surface p-5 ${highlight ? "highlight-fade" : ""}`}
          >
            <TabsContent value="candidates" className="mt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {candidates.map((beat) => (
                  <CandidateCard
                    key={beat.id}
                    beat={beat}
                    picked={pickedIds.has(beat.id)}
                    userId={userId}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payload" className="mt-0">
              <div className="flex flex-wrap items-center gap-3">
                <code className="min-w-0 flex-1 truncate font-mono text-xs text-text-2">
                  {endpoint}
                </code>
                <CopyButton text={JSON.stringify(payload, null, 2)} />
              </div>
              <div className="mt-4 rounded-[12px] border border-line bg-surface-2 p-4">
                <JsonView value={payload} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-3">
                generatedOncePerCharacter is in the payload so nobody downstream assumes it
                was written for one user.
              </p>
            </TabsContent>

            <TabsContent value="prompt" className="mt-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-text-2">Candy's system prompt, with the block pasted in</p>
                <CopyButton text={injection} />
              </div>
              <div className="mt-4 rounded-[12px] border border-line bg-surface-2 p-4">
                <details className="mb-4">
                  <summary className="cursor-pointer font-mono text-[11px] text-text-3">
                    persona header (Mia, 26, photographer, Lisbon) …
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-text-3">
                    {`You are Mia. ${season.character.speakingStyle}`}
                  </pre>
                </details>
                <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-2">
                  {injection.split("\n").map((line, i) => (
                    <span
                      key={i}
                      className={
                        line.startsWith("[LIFE ENGINE") || line.startsWith("[/LIFE ENGINE")
                          ? "block text-rose"
                          : "block"
                      }
                    >
                      {line || " "}
                    </span>
                  ))}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="cost" className="mt-0">
              <CostTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-text-3">
        In production the daily job is a scheduler at 00:00 in each character's timezone for
        active characters, and a lazy generation on first request for the long tail. Storage
        is one small table keyed by character and day.
      </p>

      <DemoDock />
    </div>
  );
}
