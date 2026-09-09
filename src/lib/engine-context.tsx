import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { days } from "./life-engine";

export const demoUsers = [
  { id: "u_8412", label: "User A" },
  { id: "u_2973", label: "User B" },
  { id: "u_5510", label: "User C" },
] as const;

type EngineState = {
  userId: string;
  day: number;
  eveningReleased: boolean;
  setUserId: (id: string) => void;
  setDay: (day: number) => void;
  setEveningReleased: (v: boolean) => void;
};

const EngineContext = createContext<EngineState | null>(null);

const KEY = "life-engine-state";

export function EngineProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>(demoUsers[0].id);
  const [day, setDay] = useState<number>(days[0] ?? 1);
  const [eveningReleased, setEveningReleased] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<EngineState>;
      if (typeof saved.userId === "string") setUserId(saved.userId);
      if (typeof saved.day === "number" && days.includes(saved.day)) setDay(saved.day);
      if (typeof saved.eveningReleased === "boolean") setEveningReleased(saved.eveningReleased);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ userId, day, eveningReleased }));
    } catch {
      /* ignore */
    }
  }, [userId, day, eveningReleased]);

  const value = useMemo(
    () => ({ userId, day, eveningReleased, setUserId, setDay, setEveningReleased }),
    [userId, day, eveningReleased],
  );

  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngine(): EngineState {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error("useEngine must be used inside EngineProvider");
  return ctx;
}
