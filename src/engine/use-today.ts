import { useMemo } from "react";

import { useDemoState } from "@/lib/demo-state";
import { arcsState, buildPayload, injectionBlock, pickForUser } from "./engine";
import { season } from "./season";

export function useToday() {
  const { day, userId, hour, live, liveActive } = useDemoState();

  return useMemo(() => {
    const liveSeason =
      liveActive && live
        ? { ...season, days: { ...season.days, [day]: live.beats } }
        : season;
    const beats = pickForUser(liveSeason.days[day] ?? [], userId, day);
    const payload = buildPayload(liveSeason, day, userId, hour);
    const arcs = liveActive && live && live.arcs.length > 0 ? live.arcs : arcsState(liveSeason, day);
    return {
      day,
      beats,
      payload,
      injection: injectionBlock(payload),
      arcsState: arcs,
      live: liveActive,
    };
  }, [day, userId, hour, live, liveActive]);
}
