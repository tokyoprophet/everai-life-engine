import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { pickForUser } from "@/engine/engine";
import { MAX_DAY, season } from "@/engine/season";
import type { Beat } from "@/engine/types";
import { fetchLiveDay, type LiveDay } from "@/lib/live-engine";

export type UserId = "user-A" | "user-B";
export type Hour = 9 | 21;

export type DemoMessage = {
  id: string;
  role: "user" | "mia";
  text: string;
  at: number;
  sourceBeatId: string | null;
  quotesUser?: boolean;
};

/** What the user actually said about a storyline, kept in the conversation only. */
export type Stance = { text: string; day: number };

export type EngineMode = "scripted" | "live";

export type DemoState = {
  day: number;
  userId: UserId;
  hour: Hour;
  messages: DemoMessage[];
  stances: Record<string, Stance>;
  guideDismissed: boolean;
  dayRead: boolean;
  engineMode: EngineMode;
};

export type DemoStateValue = DemoState & {
  hydrated: boolean;
  liveActive: boolean;
  live: LiveDay | null;
  setUser: (userId: UserId) => void;
  setHour: (hour: Hour) => void;
  setDay: (day: number) => void;
  setEngineMode: (mode: EngineMode) => void;
  advanceDay: () => Beat[];
  pushMessage: (message: Omit<DemoMessage, "id" | "at">) => void;
  setStance: (arcId: string, userText: string, day: number) => void;
  dismissGuide: () => void;
  markDayRead: () => void;
  reset: () => void;
};

const STORAGE_KEY = "life-engine-demo";

const initialState: DemoState = {
  day: 1,
  userId: "user-A",
  hour: 9,
  messages: [],
  stances: {},
  guideDismissed: false,
  dayRead: false,
  engineMode: "scripted",
};

const DemoStateContext = createContext<DemoStateValue | null>(null);

function readStored(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return { ...initialState, ...parsed };
  } catch {
    return null;
  }
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable, demo still works in memory */
    }
  }, [state, hydrated]);

  const setUser = useCallback(
    (userId: UserId) => setState((s) => ({ ...s, userId })),
    [],
  );
  const setHour = useCallback((hour: Hour) => setState((s) => ({ ...s, hour })), []);
  const setDay = useCallback(
    (day: number) => setState((s) => ({ ...s, day: Math.max(1, day) })),
    [],
  );
  const advanceDay = useCallback(() => {
    let picked: Beat[] = [];
    setState((s) => {
      const day = Math.min(MAX_DAY, s.day + 1);
      picked = pickForUser(season.days[day] ?? [], s.userId, day);
      return { ...s, day };
    });
    return picked;
  }, []);
  const pushMessage = useCallback((message: Omit<DemoMessage, "id" | "at">) => {
    setState((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { ...message, id: `${Date.now()}-${s.messages.length}`, at: Date.now() },
      ],
    }));
  }, []);
  const setStance = useCallback(
    (arcId: string, userText: string, day: number) =>
      setState((s) => ({ ...s, stances: { ...s.stances, [arcId]: { text: userText, day } } })),
    [],
  );
  const setEngineMode = useCallback(
    (engineMode: EngineMode) => setState((s) => ({ ...s, engineMode })),
    [],
  );
  const dismissGuide = useCallback(
    () => setState((s) => ({ ...s, guideDismissed: true })),
    [],
  );
  const markDayRead = useCallback(
    () => setState((s) => (s.dayRead ? s : { ...s, dayRead: true })),
    [],
  );
  const reset = useCallback(() => setState(initialState), []);

  const [live, setLive] = useState<LiveDay | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (state.engineMode !== "live") {
      setLive(null);
      return;
    }
    let cancelled = false;
    void fetchLiveDay(state.userId, state.day, state.hour).then((result) => {
      if (!cancelled) setLive(result);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, state.engineMode, state.userId, state.day, state.hour]);

  const value = useMemo<DemoStateValue>(
    () => ({
      ...state,
      hydrated,
      live,
      liveActive: state.engineMode === "live" && live !== null,
      setUser,
      setHour,
      setDay,
      setEngineMode,
      advanceDay,
      pushMessage,
      setStance,
      dismissGuide,
      markDayRead,
      reset,
    }),
    [
      state,
      hydrated,
      live,
      setUser,
      setHour,
      setDay,
      setEngineMode,
      advanceDay,
      pushMessage,
      setStance,
      dismissGuide,
      markDayRead,
      reset,
    ],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateValue {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used inside DemoStateProvider");
  return ctx;
}
