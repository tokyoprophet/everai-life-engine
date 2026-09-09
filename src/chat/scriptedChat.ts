import { hash32, isReleased, pickForUser } from "@/engine/engine";
import { season } from "@/engine/season";
import type { Beat } from "@/engine/types";

export type ScriptedMessage = {
  text: string;
  sourceBeatId: string | null;
};

export const DAY0_OPENER =
  "hey. long day. duarte left me on read AGAIN and then ana casually told me she might move to berlin. over pasta. i'm fine lol. how was yours?";

const ARC_KEYWORDS: Record<string, string[]> = {
  duarte: ["duarte", "invoice", "late fee", "send", "call"],
  ana: ["ana", "berlin", "flat", "talk"],
  film: ["film", "zine", "rolls", "frames", "shoebox"],
};

const GENERIC_LINES = [
  "ha. fair. anyway, tell me something about yours, i've been in my own head all evening.",
  "mm. ok. what about you though, what did your day actually look like?",
  "lol true. i'm useless tonight, my brain is still at the café. tell me yours.",
  "noted. honestly i just want to hear about someone else's day for a minute.",
];

/** Which storyline the user's message is about, if any. */
export function classifyArc(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [arcId, words] of Object.entries(ARC_KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) return arcId;
  }
  return null;
}

/** Beats picked for this user today that have already been released. */
export function releasedBeats(day: number, userId: string, hour: number): Beat[] {
  return pickForUser(season.days[day] ?? [], userId, day).filter((b) =>
    isReleased(b.slot, hour),
  );
}

function newestReleased(day: number, userId: string, hour: number): Beat | null {
  const beats = releasedBeats(day, userId, hour);
  return beats[beats.length - 1] ?? null;
}

function clip(text: string, max = 80): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** She speaks first: 1 to 3 short bubbles built from the newest released beat. */
export function opener(
  day: number,
  userId: string,
  hour: number,
  threads: Record<string, string>,
): ScriptedMessage[] {
  const beat = newestReleased(day, userId, hour);
  if (!beat) {
    return [
      {
        text: "still asleep, honestly. give me till 8 and i'll have something to tell you.",
        sourceBeatId: null,
      },
    ];
  }

  const messages: ScriptedMessage[] = [];
  const advice = beat.arcId ? threads[beat.arcId] : undefined;
  if (advice) {
    messages.push({
      text: `you said: '${clip(advice)}'. so.`,
      sourceBeatId: beat.id,
    });
  }
  messages.push({ text: beat.text, sourceBeatId: beat.id });
  if (beat.openQuestion) {
    messages.push({ text: `${beat.openQuestion}?`, sourceBeatId: beat.id });
  }
  return messages;
}

/** Her answer to something the user typed. */
export function reply(
  userText: string,
  day: number,
  userId: string,
  hour: number,
): { messages: ScriptedMessage[]; arcId: string | null } {
  const arcId = classifyArc(userText);
  const beats = releasedBeats(day, userId, hour);
  const beat = arcId ? beats.find((b) => b.arcId === arcId) : undefined;

  if (arcId && beat) {
    const messages: ScriptedMessage[] = [
      { text: `ok. you're right. ${beat.text}`, sourceBeatId: beat.id },
    ];
    if (beat.openQuestion) {
      messages.push({ text: `${beat.openQuestion}?`, sourceBeatId: beat.id });
    }
    return { messages: messages.slice(0, 2), arcId };
  }

  const line = GENERIC_LINES[hash32(userText) % GENERIC_LINES.length]!;
  return { messages: [{ text: line, sourceBeatId: null }], arcId: null };
}

export function findBeat(beatId: string | null | undefined): Beat | null {
  if (!beatId) return null;
  for (const beats of Object.values(season.days)) {
    const found = beats.find((b) => b.id === beatId);
    if (found) return found;
  }
  return null;
}

/** The day 0 evening beat picked for this user, used by the seeded opener. */
export function day0EveningBeatId(userId: string): string | null {
  const evening = pickForUser(season.days[0] ?? [], userId, 0).find(
    (b) => b.slot === "evening",
  );
  return evening?.id ?? null;
}
