import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Layers, Shuffle, Sunrise } from "lucide-react";

import { BeatCard, LockedBeatCard } from "@/components/beat-card";
import { DemoDock } from "@/components/demo-dock";
import { FirstRunGuide } from "@/components/first-run-guide";
import { PageHeader } from "@/components/page-header";
import { dateForDay, isReleased, pickForUser } from "@/engine/engine";
import { season } from "@/engine/season";
import type { Slot } from "@/engine/types";
import { useToday } from "@/engine/use-today";
import { longDate } from "@/lib/format";
import { useDemoState } from "@/lib/demo-state";

const SEASON_LENGTH = 28;
const SLOTS: Slot[] = ["evening", "morning"];

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

function tensionColor(tension: number) {
  if (tension > 6) return "bg-rose";
  if (tension >= 4) return "bg-warning";
  return "bg-text-3";
}

function ProfileHeader() {
  const { hour } = useDemoState();
  const { day, arcsState } = useToday();
  const character = season.character;
  const week = Math.floor(day / 7) + 1;

  return (
    <section className="mt-10 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] bg-accent text-2xl font-semibold text-white">
            M
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-text">
              {character.name}, {character.age}
            </h2>
            <p className="mt-1 text-sm text-text-2">
              Freelance photographer · {character.city}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs tabular-nums text-text-2">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {String(hour).padStart(2, "0")}:00 her time · {character.tz}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {arcsState.map((arc) => (
            <span
              key={arc.id}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text-2"
            >
              <span
                className={`h-2 w-2 rounded-full ${tensionColor(arc.tension)}`}
                aria-hidden="true"
              />
              {arc.title}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs tabular-nums text-text-3">
          Season · day {day} of {SEASON_LENGTH} · week {week} of 4
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.max(2, (day / SEASON_LENGTH) * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function DayBlock({ dayNumber, today }: { dayNumber: number; today: number }) {
  const { userId, hour } = useDemoState();
  const isToday = dayNumber === today;
  const beats = pickForUser(season.days[dayNumber] ?? [], userId, dayNumber);
  const bySlot = (slot: Slot) => beats.find((b) => b.slot === slot);

  return (
    <div
      key={dayNumber}
      className={`relative rounded-[20px] ${isToday ? "rise-in highlight-fade" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line pb-3">
        <span className="font-display text-lg text-text">Day {dayNumber}</span>
        <span className="text-sm text-text-2">
          {longDate(dateForDay(season.seasonStart, dayNumber))}
        </span>
        {isToday ? (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-white">
            Today
          </span>
        ) : null}
        <span className="ml-auto font-mono text-[11px] text-text-3">written 00:00 her time</span>
      </div>

      <div className="mt-4 space-y-4 border-l border-line pl-4 sm:pl-6">
        {SLOTS.map((slot, index) => {
          const beat = bySlot(slot);
          if (!beat) return null;
          if (isToday && !isReleased(slot, hour)) {
            return <LockedBeatCard key={slot} slot={slot} />;
          }
          return <BeatCard key={beat.id} beat={beat} userId={userId} index={index} />;
        })}
      </div>
    </div>
  );
}

function SidePanels() {
  const { userId } = useDemoState();
  const { day, beats, arcsState } = useToday();

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <section className="rounded-[20px] border border-line bg-surface p-5">
        <h3 className="text-sm font-medium text-text">Storylines</h3>
        <div className="mt-4 space-y-5">
          {arcsState.map((arc) => (
            <div key={arc.id}>
              <div className="flex items-center gap-2">
                <p className="text-sm text-text">{arc.title}</p>
                {arc.movedToday ? (
                  <span className="rounded-full border border-rose/30 bg-rose/10 px-2 py-0.5 text-[10px] text-rose">
                    moved today
                  </span>
                ) : null}
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(arc.tension / 10) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{arc.state}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-surface p-5">
        <h3 className="text-sm font-medium text-text">Today for {userId}</h3>
        <ul className="mt-3 space-y-2">
          {beats.map((beat) => (
            <li key={beat.id} className="text-sm text-text-2">
              <span className="text-text-3">{beat.slot}:</span> {beat.text.slice(0, 60)}
            </li>
          ))}
        </ul>
        <Link
          to="/chat"
          className="mt-4 inline-block text-sm text-rose underline-offset-4 hover:underline"
        >
          Open the chat
        </Link>
      </section>

      <section className="rounded-[20px] border border-line bg-surface p-5">
        <h3 className="text-sm font-medium text-text">How this day was made</h3>
        <ul className="mt-3 space-y-3 text-sm text-text-2">
          <li className="flex items-start gap-2">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-text-3" aria-hidden="true" />
            Written once at 00:00 Europe/Lisbon
          </li>
          <li className="flex items-start gap-2">
            <Shuffle className="mt-0.5 h-4 w-4 shrink-0 text-text-3" aria-hidden="true" />
            4 candidates, this user sees 2
          </li>
          <li className="flex items-start gap-2">
            <Sunrise className="mt-0.5 h-4 w-4 shrink-0 text-text-3" aria-hidden="true" />
            Released 08:00 and 19:00 her time
          </li>
        </ul>
        <Link
          to="/engine"
          className="mt-4 inline-block text-sm text-rose underline-offset-4 hover:underline"
        >
          Open the control room
        </Link>
        <p className="sr-only">Day {day}</p>
      </section>
    </div>
  );
}

function MiaPage() {
  const { day } = useToday();
  const days = Array.from({ length: day + 1 }, (_, i) => day - i);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-[210px] sm:px-6 sm:pb-[124px]">
      <PageHeader
        eyebrow="Her life"
        title="Mia's season, day by day"
        description="Three storylines seeded once from her card, then two beats a day written by the nightly job in Europe/Lisbon."
      />

      <FirstRunGuide />

      <ProfileHeader />

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="text-sm font-medium text-text">Her days</h3>
          <div className="mt-4 space-y-10">
            {days.map((d) => (
              <DayBlock key={d} dayNumber={d} today={day} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <SidePanels />
        </div>
      </div>

      <DemoDock />
    </div>
  );
}
