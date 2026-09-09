import { motion, useReducedMotion } from "framer-motion";
import { Camera, Lock, Mic, Moon, Sun, Video } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { releaseHour } from "@/engine/engine";
import type { Beat, MediaKind, Slot } from "@/engine/types";

const slotIcon = { morning: Sun, evening: Moon };

const mediaMeta: Record<
  Exclude<MediaKind, "none">,
  { icon: typeof Camera; label: string; tokens: string }
> = {
  photo: { icon: Camera, label: "PHOTO GENERATED HERE", tokens: "2 tokens" },
  video: { icon: Video, label: "VIDEO GENERATED HERE", tokens: "10 tokens" },
  voice: { icon: Mic, label: "VOICE NOTE", tokens: "1 token" },
};

function Waveform() {
  const reduced = useReducedMotion();
  const bars = Array.from({ length: 32 }, (_, i) => 0.25 + ((i * 7) % 10) / 12);

  return (
    <div className="flex h-16 items-center gap-[3px] rounded-[12px] border border-line bg-surface-3 px-4">
      <Mic className="mr-2 h-4 w-4 shrink-0 text-text-3" aria-hidden="true" />
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-violet/70"
          style={{ height: `${h * 36}px` }}
          animate={reduced ? undefined : { scaleY: [1, 0.45, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 8) * 0.08,
          }}
        />
      ))}
    </div>
  );
}

function MediaBlock({ beat }: { beat: Beat }) {
  if (beat.media.kind === "none") return null;
  const meta = mediaMeta[beat.media.kind];
  const Icon = meta.icon;

  return (
    <div className="mt-4">
      {beat.media.kind === "voice" ? (
        <Waveform />
      ) : (
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[16px] border border-line bg-[radial-gradient(120%_140%_at_20%_0%,rgba(255,79,139,0.16),rgba(138,92,255,0.10)_45%,transparent_75%)]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Icon className="h-6 w-6 text-text-2" aria-hidden="true" />
            <span className="text-[11px] tracking-[0.18em] text-text-2">{meta.label}</span>
          </div>
          <span className="absolute bottom-3 left-3 rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[11px] text-text-2">
            {meta.tokens}
          </span>
          {beat.media.premium ? (
            <span className="absolute right-3 top-3 rounded-full border border-gold/40 bg-surface/80 px-2.5 py-1 text-[11px] text-gold">
              Premium
            </span>
          ) : null}
        </div>
      )}
      {beat.media.kind === "voice" ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-text-2">
            {meta.tokens}
          </span>
        </div>
      ) : null}
      <p className="mt-3 text-sm italic leading-relaxed text-text-2">{beat.media.brief}</p>
      <p className="mt-1.5 text-xs text-text-3">
        Brief comes from this beat. Candy's media pipeline receives it as-is.
      </p>
    </div>
  );
}

export function LockedBeatCard({ slot }: { slot: Slot }) {
  const label = slot === "morning" ? "Morning" : "Evening";
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-dashed border-line bg-surface/50 px-5 py-6 text-sm text-text-3">
      <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label} beat unlocks at {String(releaseHour[slot]).padStart(2, "0")}:00 her time
    </div>
  );
}

export function BeatCard({
  beat,
  userId,
  index,
}: {
  beat: Beat;
  userId: string;
  index: number;
}) {
  const reduced = useReducedMotion();
  const Icon = slotIcon[beat.slot];

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.06 }}
      className="rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Icon className="h-4 w-4 text-text-3" aria-hidden="true" />
        <span className="text-sm font-medium text-text">{beat.slot}</span>
        {beat.arcId ? (
          <span className="rounded-full border border-violet/30 bg-violet/12 px-2.5 py-1 text-[11px] text-violet">
            {beat.arcId}
          </span>
        ) : null}
        <span className="ml-auto text-xs italic text-text-3">{beat.mood}</span>
      </div>

      <p className="mt-3 text-[16px] leading-[1.55] text-text-2">{beat.text}</p>

      <MediaBlock beat={beat} />

      {beat.openQuestion ? (
        <div className="mt-4 rounded-[12px] border border-rose/25 bg-rose/8 px-4 py-3">
          <p className="text-[10px] tracking-[0.18em] text-rose">STILL DECIDING</p>
          <p className="mt-1 text-sm text-text-2">{beat.openQuestion}</p>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default font-mono text-[10px] text-text-3">
              v{beat.variant}
            </span>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-[240px] border border-line bg-surface-3 text-xs text-text-2"
          >
            One of two variants written today. This one was picked for {userId}.
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.article>
  );
}
