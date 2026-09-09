export type Slot = "morning" | "evening";

export type MediaBrief = {
  kind: "photo" | "voice" | "video";
  tokens: number;
  brief: string;
};

export type Beat = {
  id: string;
  day: number;
  slot: Slot;
  storyline: StorylineId;
  what: string;
  mood: string;
  openQuestion: string;
  media: MediaBrief;
};

export type StorylineId = "invoice" | "ana" | "film";

export type Storyline = {
  id: StorylineId;
  title: string;
  premise: string;
  stake: string;
  weeks: string[];
  tint: string;
};

export const character = {
  name: "Mia",
  age: 26,
  role: "Freelance photographer",
  city: "Lisbon",
  timezone: "Europe/Lisbon",
  seasonLength: "4 weeks",
  seededOn: "2026-09-01",
};

export const storylines: Storyline[] = [
  {
    id: "invoice",
    title: "The unpaid invoice",
    premise: "A client, Duarte, owes her 1,800 EUR for a hotel shoot in July.",
    stake: "Rent, and whether she keeps chasing polite emails or gets hard about it.",
    tint: "var(--warning)",
    weeks: [
      "Week 1: the third reminder goes out, no reply.",
      "Week 2: Duarte answers, offers half now and half later.",
      "Week 3: she talks to a friend who works in law.",
      "Week 4: she decides what her work is worth.",
    ],
  },
  {
    id: "ana",
    title: "Ana and Berlin",
    premise: "Her best friend and flatmate has a job offer in Berlin.",
    stake: "The flat, the friendship, and who Mia is in Lisbon without her.",
    tint: "var(--violet)",
    weeks: [
      "Week 1: Ana mentions the offer as if it were nothing.",
      "Week 2: they look at the numbers of splitting the flat.",
      "Week 3: Ana books a trip to see the city.",
      "Week 4: the answer is due.",
    ],
  },
  {
    id: "film",
    title: "The film project",
    premise: "A shoebox of undeveloped 35mm rolls she wants to turn into a zine.",
    stake: "Whether she finishes something for herself, or keeps working for others.",
    tint: "var(--success)",
    weeks: [
      "Week 1: she counts the rolls, twenty three of them.",
      "Week 2: the first four come back from the lab.",
      "Week 3: a printer quotes her more than she hoped.",
      "Week 4: the first copy exists, or it does not.",
    ],
  },
];

const beat = (
  day: number,
  slot: Slot,
  storyline: StorylineId,
  what: string,
  mood: string,
  openQuestion: string,
  media: MediaBrief,
): Beat => ({ id: `${day}-${slot}-${storyline}-${what.length}`, day, slot, storyline, what, mood, openQuestion, media });

/** Four candidate beats per slot, per day. Written once, shared by every user. */
export const candidates: Record<number, Record<Slot, Beat[]>> = {
  1: {
    morning: [
      beat(1, "morning", "invoice", "She sent Duarte a third reminder before coffee, shorter and colder than the last two.", "Tight, a little embarrassed", "Whether being polite is costing her money.", { kind: "photo", tokens: 2, brief: "Kitchen table, laptop half closed, one coffee, hard morning light through slatted blinds." }),
      beat(1, "morning", "film", "She emptied the shoebox onto the bed and counted twenty three rolls of film.", "Curious, slightly guilty", "Which roll she is afraid to develop.", { kind: "photo", tokens: 2, brief: "Overhead of rolls of 35mm film scattered on a linen bedspread, hand in frame." }),
      beat(1, "morning", "ana", "Ana said the Berlin thing out loud over breakfast, then changed the subject fast.", "Off balance", "Whether Ana already knows her answer.", { kind: "voice", tokens: 1, brief: "Twelve seconds, low voice, kitchen noise behind her, telling you what Ana just said." }),
      beat(1, "morning", "film", "She walked to the lab in Anjos with four rolls and left them for Friday.", "Light, a bit reckless", "Whether she can afford the other nineteen.", { kind: "photo", tokens: 2, brief: "Lab counter, paper receipt with a Friday date, tiled Lisbon wall behind." }),
    ],
    evening: [
      beat(1, "evening", "ana", "She and Ana sat on the balcony and did not talk about Berlin for two hours.", "Warm and heavy at once", "Whether avoiding it counts as being kind.", { kind: "photo", tokens: 2, brief: "Balcony at dusk, two glasses, rooftops, one chair empty, warm sodium light." }),
      beat(1, "evening", "invoice", "She drafted a harder email at midnight and did not send it.", "Stubborn", "Whether tomorrow she sends it.", { kind: "voice", tokens: 1, brief: "Eighteen seconds, whispered, reading the first line of the draft to you." }),
      beat(1, "evening", "film", "She pinned six old prints above her desk to see if a zine was actually in there.", "Focused", "What the zine is about, if anything.", { kind: "photo", tokens: 2, brief: "Wall of small prints held with tape, desk lamp raking across them." }),
      beat(1, "evening", "invoice", "A friend told her to add late fees. She looked up how.", "Sharper than this morning", "Whether she wants to be the person who charges fees.", { kind: "photo", tokens: 2, brief: "Phone screen with a notes app, invoice numbers, sofa in low light." }),
    ],
  },
  2: {
    morning: [
      beat(2, "morning", "invoice", "Duarte replied at 07:40. Half now, half in October.", "Relief mixed with irritation", "Whether half now is a win or a habit.", { kind: "voice", tokens: 1, brief: "Fifteen seconds, reading his reply out loud in a flat voice." }),
      beat(2, "morning", "ana", "She opened a spreadsheet to see what the flat costs alone. She closed it again.", "Quietly worried", "Whether she stays in this flat at all.", { kind: "photo", tokens: 2, brief: "Laptop on the floor, morning shadow of a window frame across the screen." }),
      beat(2, "morning", "film", "The lab called: two rolls were blank, the rest are fine.", "Disappointed, then fine", "Which two years she just lost.", { kind: "photo", tokens: 2, brief: "Hand holding a strip of clear film against a bright window." }),
      beat(2, "morning", "ana", "Ana left a note on the fridge saying they should talk properly tonight.", "Braced", "What Ana wants her to say.", { kind: "photo", tokens: 2, brief: "Yellow note on a fridge door, magnet, kitchen out of focus." }),
    ],
    evening: [
      beat(2, "evening", "invoice", "She accepted half and asked for it by Friday, in writing.", "Steady", "Whether Friday actually means Friday.", { kind: "photo", tokens: 2, brief: "Laptop, sent folder, glass of water, desk lamp, late blue light outside." }),
      beat(2, "evening", "ana", "They talked properly. Ana is going to visit, not decide, not yet.", "Softer, still unsettled", "What she wants Ana to choose.", { kind: "voice", tokens: 1, brief: "Twenty seconds, tired voice, sitting on the floor of the hallway." }),
      beat(2, "evening", "film", "She scanned the four good rolls and found one frame she has been looking for.", "Awake, pleased", "Whether one good frame is enough to start.", { kind: "photo", tokens: 2, brief: "Screen showing a grainy scanned negative, room dark around it." }),
      beat(2, "evening", "film", "She named the zine on a napkin. The name is bad and she likes it.", "Playful", "Whether to tell anyone the name yet.", { kind: "photo", tokens: 2, brief: "Napkin with handwriting, bar table, wine glass edge in frame." }),
    ],
  },
  3: {
    morning: [
      beat(3, "morning", "ana", "Ana booked flights to Berlin for the weekend after next.", "Flat, then sad", "Whether she should ask to go too.", { kind: "photo", tokens: 2, brief: "Two phones on a table, one showing a flight confirmation, morning light." }),
      beat(3, "morning", "invoice", "The first 900 EUR landed. She checked the app three times.", "Lighter", "What the money is for first.", { kind: "voice", tokens: 1, brief: "Ten seconds, laughing slightly, saying it arrived." }),
      beat(3, "morning", "film", "A printer in Marvila quoted her 640 EUR for a hundred copies.", "Deflated", "Whether fifty copies is giving up or being sensible.", { kind: "photo", tokens: 2, brief: "Print shop interior, paper samples fanned out on a metal counter." }),
      beat(3, "morning", "invoice", "She spent the morning on a job she does not like, to be safe.", "Practical, a bit dull", "Whether safe work is what got her here.", { kind: "photo", tokens: 2, brief: "Product shoot setup, white sweep, softbox, no people." }),
    ],
    evening: [
      beat(3, "evening", "film", "She cut the zine down to twenty pages by taking her own favourites out.", "Ruthless, satisfied", "Whether the best photo belongs in it at all.", { kind: "photo", tokens: 2, brief: "Prints laid in a grid on the floor, three set aside, bare feet at the edge." }),
      beat(3, "evening", "ana", "She helped Ana pack a bag for the trip and it felt like a rehearsal.", "Tender, dreading it", "Whether she can be happy for her honestly.", { kind: "voice", tokens: 1, brief: "Twenty five seconds, quiet, sitting on the edge of a bed." }),
      beat(3, "evening", "invoice", "She paid rent, then bought film with what was left.", "Defiant", "Whether that was clever or stupid.", { kind: "photo", tokens: 2, brief: "Five boxes of 35mm film on a duvet, receipt beside them." }),
      beat(3, "evening", "film", "She shot a roll on the walk home for no client and no reason.", "Free", "Whether she remembers how to shoot for herself.", { kind: "video", tokens: 10, brief: "Eight seconds, handheld, walking down Rua da Bica at night, camera swinging." }),
    ],
  },
};

export const days = Object.keys(candidates).map(Number).sort((a, b) => a - b);

export const releaseTimes: Record<Slot, string> = { morning: "08:00", evening: "19:00" };

/** Stable hash of user id + day + slot, so two users get different days for free. */
export function hash(userId: string, day: number, slot: Slot): number {
  const input = `${userId}:${day}:${slot}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickBeat(userId: string, day: number, slot: Slot): Beat {
  const pool = candidates[day]![slot];
  return pool[hash(userId, day, slot) % pool.length]!;
}

export function storylineOf(id: StorylineId): Storyline {
  return storylines.find((s) => s.id === id)!;
}

export function dayDate(day: number): string {
  const base = new Date("2026-09-07T00:00:00Z");
  base.setUTCDate(base.getUTCDate() + day - 1);
  return base.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** The block Candy's backend pastes into the system prompt when a chat opens. */
export function promptBlock(userId: string, day: number, includeEvening: boolean): string {
  const morning = pickBeat(userId, day, "morning");
  const evening = pickBeat(userId, day, "evening");
  const lines = [
    `HER DAY (${dayDate(day)}, Europe/Lisbon)`,
    `08:00 ${morning.what}`,
    `mood: ${morning.mood}`,
    `unresolved: ${morning.openQuestion}`,
  ];
  if (includeEvening) {
    lines.push(
      `19:00 ${evening.what}`,
      `mood: ${evening.mood}`,
      `unresolved: ${evening.openQuestion}`,
    );
  }
  lines.push(
    "",
    "Report this day as lived. Do not invent other events. You may bring up the unresolved item yourself.",
  );
  return lines.join("\n");
}

export function dayJson(userId: string, day: number) {
  const morning = pickBeat(userId, day, "morning");
  const evening = pickBeat(userId, day, "evening");
  const shape = (b: Beat) => ({
    slot: b.slot,
    release_local: releaseTimes[b.slot],
    storyline: b.storyline,
    what_happened: b.what,
    mood: b.mood,
    open_question: b.openQuestion,
    media_brief: { type: b.media.kind, tokens: b.media.tokens, brief: b.media.brief },
  });
  return {
    character_id: "mia",
    date: "2026-09-" + String(6 + day).padStart(2, "0"),
    timezone: character.timezone,
    user_id: userId,
    beats: [shape(morning), shape(evening)],
  };
}
