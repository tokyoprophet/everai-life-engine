import { LIVE_ENGINE_URL } from "@/config";
import type { Beat, Slot } from "@/engine/types";

export type LiveArcState = {
  id: string;
  title: string;
  state: string;
  tension: number;
  movedToday: boolean;
};

export type LiveDay = {
  beats: Beat[];
  arcs: LiveArcState[];
};

type RawBeat = {
  id?: string;
  slot?: string;
  variant?: number;
  arc_id?: string | null;
  type?: string;
  mood?: string;
  text?: string;
  open_question?: string | null;
  media?: { kind?: string; brief?: string; premium?: boolean } | null;
};

type RawArc = {
  id?: string;
  title?: string;
  state?: string;
  tension?: number;
  moved_today?: boolean;
};

function toSlot(value: unknown): Slot {
  return value === "evening" ? "evening" : "morning";
}

function toBeat(raw: RawBeat, day: number, index: number): Beat {
  const slot = toSlot(raw.slot);
  const kind = raw.media?.kind;
  return {
    id: raw.id ?? `live-${day}-${slot}-${index}`,
    day,
    slot,
    variant: (raw.variant === 1 ? 1 : 0) as 0 | 1,
    arcId: (raw.arc_id as Beat["arcId"]) ?? null,
    type: (raw.type as Beat["type"]) ?? "quiet",
    mood: raw.mood ?? "",
    text: raw.text ?? "",
    openQuestion: raw.open_question ?? "",
    media:
      kind === "photo" || kind === "voice" || kind === "video"
        ? { kind, brief: raw.media?.brief ?? "", premium: Boolean(raw.media?.premium) }
        : { kind: "none", brief: "", premium: false },
  };
}

/** Runs the daily job on the live service. Resolves false on any error. */
export async function liveTick(characterId = "mia"): Promise<boolean> {
  if (!LIVE_ENGINE_URL) return false;
  try {
    const res = await fetch(`${LIVE_ENGINE_URL}/api/internal/tick`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character_id: characterId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fetches a live day and maps it to the local Season shape. Null on any error. */
export async function fetchLiveDay(
  userId: string,
  day: number,
  hour: number,
  characterId = "mia",
): Promise<LiveDay | null> {
  if (!LIVE_ENGINE_URL) return null;
  try {
    const url = `${LIVE_ENGINE_URL}/api/v1/characters/${characterId}/day?user_id=${encodeURIComponent(
      userId,
    )}&day=${day}&hour=${hour}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: RawBeat[];
      beats?: RawBeat[];
      arcs_after?: RawArc[];
    };
    const rawBeats = data.candidates ?? data.beats ?? [];
    const beats = rawBeats.map((raw, i) => toBeat(raw, day, i));
    if (beats.length === 0) return null;
    const arcs = (data.arcs_after ?? []).map((arc) => ({
      id: arc.id ?? "",
      title: arc.title ?? arc.id ?? "",
      state: arc.state ?? "",
      tension: arc.tension ?? 0,
      movedToday: Boolean(arc.moved_today),
    }));
    return { beats, arcs };
  } catch {
    return null;
  }
}
