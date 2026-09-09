import { useMemo } from "react";

import { useDemoState } from "@/lib/demo-state";
import { arcsState, buildPayload, injectionBlock, pickForUser } from "./engine";
import { season } from "./season";

export function useToday() {
  const { day, userId, hour } = useDemoState();

  return useMemo(() => {
    const beats = pickForUser(season.days[day] ?? [], userId, day);
    const payload = buildPayload(season, day, userId, hour);
    return {
      day,
      beats,
      payload,
      injection: injectionBlock(payload),
      arcsState: arcsState(season, day),
    };
  }, [day, userId, hour]);
}
