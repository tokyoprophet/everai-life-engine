import { Clock, MoreHorizontal, Play, RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MAX_DAY } from "@/engine/season";
import { useDemoState, type EngineMode, type Hour, type UserId } from "@/lib/demo-state";
import { liveTick } from "@/lib/live-engine";
import { cn } from "@/lib/utils";

function Hint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[240px] border border-line bg-surface-3 text-xs leading-relaxed text-text-2"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

const segment =
  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet";

export function DemoDock() {
  const {
    day,
    userId,
    hour,
    hydrated,
    engineMode,
    setEngineMode,
    setUser,
    setHour,
    advanceDay,
    reset,
  } = useDemoState();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const users: UserId[] = ["user-A", "user-B"];
  const hours: Hour[] = [9, 21];
  const modes: EngineMode[] = ["scripted", "live"];
  const atSeasonEnd = hydrated && day >= MAX_DAY;

  function onAdvance() {
    if (engineMode === "live") void liveTick("mia");
    advanceDay();
    const next = Math.min(MAX_DAY, day + 1);
    toast(`Day ${next} written once for every user`);
  }


  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-4">
      <div
        role="group"
        aria-label="Demo controls"
        className="pointer-events-auto flex w-full max-w-[680px] sm:max-w-none flex-wrap items-center justify-center gap-2 rounded-[20px] border border-line bg-surface-2/90 px-3 py-2.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:w-auto sm:flex-nowrap sm:rounded-full"
      >
        <Hint label="The day inside Mia's four week season. Beats are written once per character, per day.">
          <span className="rounded-full border border-line bg-surface-3 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-text">
            Day {hydrated ? day : 1}
          </span>
        </Hint>

        <Hint label="Two users on the same day. Each one sees a different pair of beats, picked by hashing user id, day and slot.">
          <div
            role="radiogroup"
            aria-label="Demo user"
            className="flex items-center gap-1 rounded-full border border-line bg-surface p-1"
          >
            {users.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={userId === id}
                onClick={() => setUser(id)}
                className={cn(
                  segment,
                  userId === id ? "bg-accent text-white" : "text-text-3 hover:text-text",
                )}
              >
                {id}
              </button>
            ))}
          </div>
        </Hint>

        <Hint label="Her local clock. Morning beats release at 08:00 Europe/Lisbon, evening beats at 19:00.">
          <div
            role="radiogroup"
            aria-label="Time of day, her time"
            className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 pl-2.5"
          >
            <Clock className="h-3.5 w-3.5 text-text-3" aria-hidden="true" />
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={hour === h}
                onClick={() => setHour(h)}
                className={cn(
                  segment,
                  hour === h ? "bg-accent text-white" : "text-text-3 hover:text-text",
                )}
              >
                {h === 9 ? "09:00" : "21:00"}
              </button>
            ))}
            <span className="whitespace-nowrap pr-2 text-[11px] text-text-3">her time</span>
          </div>
        </Hint>

        <Hint
          label={
            atSeasonEnd
              ? "Season demo ends at day 6"
              : "Simulates the daily cron for Mia. In production it runs at 00:00 Europe/Lisbon."
          }
        >
          <button
            type="button"
            onClick={onAdvance}
            disabled={atSeasonEnd}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white accent-ring transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Advance day
          </button>
        </Hint>

        <Hint label="Clears the demo back to day 1, user-A, morning. Nothing leaves your browser.">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-text-3 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </Hint>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More demo options"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-text-3 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-60 border-line bg-surface-2 text-text"
          >
            <DropdownMenuLabel className="text-xs font-normal text-text-3">
              Engine
            </DropdownMenuLabel>
            <div
              role="radiogroup"
              aria-label="Engine mode"
              className="m-1 flex items-center gap-1 rounded-full border border-line bg-surface p-1"
            >
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={engineMode === mode}
                  onClick={() => setEngineMode(mode)}
                  className={cn(
                    segment,
                    "flex-1",
                    engineMode === mode ? "bg-accent text-white" : "text-text-3 hover:text-text",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="px-2 pb-2 pt-1 text-[11px] leading-relaxed text-text-3">
              Live calls the deployed service to write the day. If it is unreachable the demo
              falls back to scripted.
            </p>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-line bg-surface-2 text-text">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Reset the demo?</AlertDialogTitle>
            <AlertDialogDescription className="text-text-2">
              This clears the day, the user, the clock and the whole chat back to day 1. Nothing
              leaves your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-line bg-surface text-text-2">
              Keep going
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-white"
              onClick={() => {
                reset();
                toast("Demo reset to day 1, user-A, morning");
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
