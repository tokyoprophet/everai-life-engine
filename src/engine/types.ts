export type Slot = "morning" | "evening";

export type MediaKind = "photo" | "video" | "voice" | "none";

export type Media = {
  kind: MediaKind;
  brief: string;
  premium: boolean;
};

export type BeatType = "work" | "friends" | "self" | "home" | "night_out" | "quiet";

export type Beat = {
  id: string;
  day: number;
  slot: Slot;
  variant: 0 | 1;
  arcId: string | null;
  type: BeatType;
  mood: string;
  text: string;
  openQuestion: string;
  media: Media;
};

export type Arc = {
  id: string;
  title: string;
  summary: string;
  stateByDay: Record<number, string>;
  tensionByDay: Record<number, number>;
};

export type Person = {
  name: string;
  relation: string;
  note: string;
};

export type Character = {
  id: string;
  name: string;
  age: number;
  city: string;
  tz: string;
  job: string;
  personality: string;
  speakingStyle: string;
  people: Person[];
  places: string[];
  routines: string[];
};

export type Season = {
  character: Character;
  seasonStart: string;
  arcs: Arc[];
  /** Exactly 4 beats per day: morning v0, morning v1, evening v0, evening v1. */
  days: Record<number, Beat[]>;
};

export type PublicBeat = {
  id: string;
  slot: Slot;
  availableAt: string;
  released: boolean;
  arc: string | null;
  mood: string;
  text: string;
  openQuestion: string;
  media: Media;
};

export type DayPayload = {
  characterId: string;
  day: number;
  date: string;
  tz: string;
  askedAt: string;
  userId: string;
  generatedOncePerCharacter: true;
  beats: PublicBeat[];
  arcs: { id: string; title: string; state: string }[];
  usageHint: string;
};
