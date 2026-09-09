import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserId = "user-A" | "user-B";
export type Hour = 9 | 21;

export type DemoMessage = {
  id: string;
  role: "user" | "mia";
  text: string;
  at: number;
};

export type DemoState = {
  day: number;
  userId: UserId;
  hour: Hour;
  messages: DemoMessage[];
  guideDismissed: boolean;
};

export type DemoStateValue = DemoState & {
  hydrated: boolean;
  setUser: (userId: UserId) => void;
  setHour: (hour: Hour) => void;
  setDay: (day: number) => void;
  advanceDay: () => void;
  pushMessage: (message: Omit<DemoMessage, "id" | "at">) => void;
  dismissGuide: () => void;
  reset: () => void;
};

const STORAGE_KEY = "life-engine-demo";

const initialState: DemoState = {
  day: 1,
  userId: "user-A",
  hour: 9,
  messages: [],
  guideDismissed: false,
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
  const dismissGuide = useCallback(
    () => setState((s) => ({ ...s, guideDismissed: true })),
    [],
  );
  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<DemoStateValue>(
    () => ({
      ...state,
      hydrated,
      setUser,
      setHour,
      setDay,
      advanceDay,
      pushMessage,
      dismissGuide,
      reset,
    }),
    [state, hydrated, setUser, setHour, setDay, advanceDay, pushMessage, dismissGuide, reset],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateValue {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used inside DemoStateProvider");
  return ctx;
}
