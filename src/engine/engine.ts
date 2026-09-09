import type { Arc, Beat, DayPayload, PublicBeat, Season, Slot } from "./types";

/** FNV-1a, 32 bit. Deterministic across users, days and slots. */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export const releaseHour: Record<Slot, number> = { morning: 8, evening: 19 };

export function isReleased(slot: Slot, hour: number): boolean {
  return hour >= releaseHour[slot];
}

export function variantForUser(userId: string, day: number, slot: Slot): 0 | 1 {
  return (hash32(`${userId}:${day}:${slot}`) % 2) as 0 | 1;
}

/** Picks one beat per slot for this user. Always returns morning then evening. */
export function pickForUser(beats: Beat[], userId: string, day: number): Beat[] {
  const slots: Slot[] = ["morning", "evening"];
  const picked: Beat[] = [];
  for (const slot of slots) {
    const variant = variantForUser(userId, day, slot);
    const beat =
      beats.find((b) => b.slot === slot && b.variant === variant) ??
      beats.find((b) => b.slot === slot);
    if (beat) picked.push(beat);
  }
  return picked;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dateForDay(seasonStart: string, day: number): string {
  const start = new Date(`${seasonStart}T00:00:00Z`);
  const d = new Date(start.getTime() + day * 86400000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function availableAt(seasonStart: string, day: number, slot: Slot): string {
  return `${dateForDay(seasonStart, day)}T${pad(releaseHour[slot])}:00:00`;
}

export const usageHint =
  "These are things that actually happened to the character today, in her own words. Only beats with released=true have happened yet. Report them, do not invent other events. Bring up openQuestion naturally. media.brief is what her photo/video would show if she sends one.";

function arcStateForDay(arc: Arc, day: number): string {
  let state = "";
  for (let d = 0; d <= day; d += 1) {
    if (arc.stateByDay[d]) state = arc.stateByDay[d];
  }
  return state || arc.summary;
}

export function arcsState(season: Season, day: number) {
  return season.arcs.map((arc) => ({
    id: arc.id,
    title: arc.title,
    state: arcStateForDay(arc, day),
  }));
}

export function buildPayload(
  season: Season,
  day: number,
  userId: string,
  hour: number,
): DayPayload {
  const dayBeats = season.days[day] ?? [];
  const picked = pickForUser(dayBeats, userId, day);

  const beats: PublicBeat[] = picked.map((beat) => ({
    id: beat.id,
    slot: beat.slot,
    availableAt: availableAt(season.seasonStart, day, beat.slot),
    released: isReleased(beat.slot, hour),
    arc: beat.arcId,
    mood: beat.mood,
    text: beat.text,
    openQuestion: beat.openQuestion,
    media: beat.media,
  }));

  return {
    characterId: season.character.id,
    day,
    date: dateForDay(season.seasonStart, day),
    tz: season.character.tz,
    askedAt: `${pad(hour)}:00`,
    userId,
    generatedOncePerCharacter: true,
    beats,
    arcs: arcsState(season, day),
    usageHint,
  };
}

export function injectionBlock(payload: DayPayload): string {
  const lines: string[] = [];
  lines.push(
    `[LIFE ENGINE · day ${payload.day} · ${payload.date} · asked at ${payload.askedAt} ${payload.tz}]`,
  );

  const released = payload.beats.filter((b) => b.released);
  if (released.length === 0) {
    lines.push("Nothing has happened yet today. Her morning beat releases at 08:00 her time.");
  }

  for (const beat of released) {
    lines.push("");
    lines.push(`${beat.slot}${beat.arc ? ` · ${beat.arc}` : ""} · mood: ${beat.mood}`);
    lines.push(beat.text);
    if (beat.openQuestion) lines.push(`still deciding: ${beat.openQuestion}`);
    if (beat.media.kind !== "none") {
      lines.push(
        `media she could send: ${beat.media.kind}${beat.media.premium ? " (premium)" : ""}, ${beat.media.brief}`,
      );
    }
  }

  lines.push("");
  lines.push("Where your storylines stand:");
  for (const arc of payload.arcs) {
    lines.push(`- ${arc.title}: ${arc.state}`);
  }

  lines.push("");
  lines.push(payload.usageHint);
  lines.push("[/LIFE ENGINE]");

  return lines.join("\n");
}

export function estimateMonthlyCost({
  headCharacters,
  tailCharacters,
  headPricePerDay,
  tailPricePerDay,
  infra,
}: {
  headCharacters: number;
  tailCharacters: number;
  headPricePerDay: number;
  tailPricePerDay: number;
  infra: number;
}) {
  const days = 30;
  const head = headCharacters * headPricePerDay * days;
  const tail = tailCharacters * tailPricePerDay * days;
  return { head, tail, infra, total: head + tail + infra };
}

export function estimatePerUserApproach({
  sessionsPerDay,
  pricePerSession,
}: {
  sessionsPerDay: number;
  pricePerSession: number;
}) {
  const days = 30;
  const total = sessionsPerDay * pricePerSession * days;
  return { sessionsPerDay, pricePerSession, total };
}
