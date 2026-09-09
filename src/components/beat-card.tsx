import { Camera, HelpCircle, Mic, Video, Sunrise, Moon } from "lucide-react";
import { type Beat, releaseTimes, storylineOf } from "@/lib/life-engine";

const mediaIcon = { photo: Camera, voice: Mic, video: Video } as const;

export function BeatCard({ beat, locked = false }: { beat: Beat; locked?: boolean }) {
  const story = storylineOf(beat.storyline);
  const MediaIcon = mediaIcon[beat.media.kind];
  const SlotIcon = beat.slot === "morning" ? Sunrise : Moon;

  if (locked) {
    return (
      <div className="rounded-[20px] border border-dashed border-border bg-surface/40 p-6">
        <div className="flex items-center gap-2 text-sm text-subtle">
          <SlotIcon className="size-4" aria-hidden />
          Evening beat releases at {releaseTimes.evening} in Lisbon.
        </div>
        <p className="mt-2 text-sm text-subtle">
          Nothing is written on demand. The day already exists, it is just not hers yet.
        </p>
      </div>
    );
  }

  return (
    <article className="panel p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlotIcon className="size-4" aria-hidden />
          {releaseTimes[beat.slot]}
        </span>
        <span
          className="rounded-[12px] px-2.5 py-1 text-xs"
          style={{ color: story.tint, backgroundColor: "color-mix(in oklab, " + story.tint + " 14%, transparent)" }}
        >
          {story.title}
        </span>
      </div>

      <p className="mt-4 text-lg leading-relaxed text-foreground">{beat.what}</p>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-subtle">Mood</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{beat.mood}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-subtle">
            <HelpCircle className="size-3.5" aria-hidden /> Open question
          </dt>
          <dd className="mt-1 text-sm text-muted-foreground">{beat.openQuestion}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-start gap-3 rounded-[16px] bg-surface-2/70 p-4">
        <MediaIcon className="mt-0.5 size-4 text-gold" aria-hidden />
        <div className="text-sm">
          <p className="text-muted-foreground">{beat.media.brief}</p>
          <p className="mt-1 text-xs text-subtle">
            Brief only, handed to Candy's existing media pipeline. {beat.media.kind}, {beat.media.tokens} tokens.
          </p>
        </div>
      </div>
    </article>
  );
}
