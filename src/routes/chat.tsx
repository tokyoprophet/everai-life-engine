import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, PlayCircle, User } from "lucide-react";

import { PhoneChat } from "@/components/chat/phone-chat";
import { DemoDock } from "@/components/demo-dock";
import { PageHeader } from "@/components/page-header";
import { findBeat, hasOpenedToday, releasedBeats } from "@/chat/scriptedChat";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { arcTitle } from "@/engine/season";
import { useToday } from "@/engine/use-today";
import { useDemoState } from "@/lib/demo-state";


export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "The chat: Mia answers from her day" },
      {
        name: "description",
        content:
          "When a chat opens, the day block is pasted into the system prompt. She reports her day instead of inventing it.",
      },
      { property: "og:title", content: "The chat: Mia answers from her day" },
      {
        property: "og:description",
        content: "A short day block in the system prompt turns a stateless chat into a continuing one.",
      },
    ],
  }),
  component: ChatPage,
});

function SessionPanel({ onNewSession }: { onNewSession: () => void }) {
  const { userId, day, hour, messages } = useDemoState();
  const alreadyOpened = hasOpenedToday(messages, day);
  const rows = [
    { icon: User, label: "User", value: userId },
    { icon: PlayCircle, label: "Day", value: `Day ${day}` },
    { icon: Clock, label: "Her time", value: `${String(hour).padStart(2, "0")}:00` },
  ];

  const button = (
    <button
      type="button"
      onClick={onNewSession}
      disabled={alreadyOpened}
      className="mt-5 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Open a new session
    </button>
  );

  return (
    <section className="rounded-[20px] border border-line bg-surface p-5">
      <h2 className="text-sm font-medium text-text">Session</h2>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 text-sm">
            <row.icon className="h-4 w-4 shrink-0 text-text-3" aria-hidden="true" />
            <dt className="text-text-3">{row.label}</dt>
            <dd className="ml-auto tabular-nums text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
      {alreadyOpened ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block">{button}</span>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-[240px] border border-line bg-surface-3 text-xs text-text-2"
          >
            She already opened today. Advance the day to get a new one.
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
      <p className="mt-3 text-xs leading-relaxed text-text-3">
        In production this happens when the user opens the chat. Candy fetches her day and
        pastes it into the prompt.
      </p>
    </section>
  );
}


function BehindPanel({
  selectedBeatId,
  quotesUser,
}: {
  selectedBeatId: string | null;
  quotesUser: boolean;
}) {
  const { userId, hour } = useDemoState();
  const { day, injection, arcsState } = useToday();
  const beat = findBeat(selectedBeatId);
  const released = releasedBeats(day, userId, hour);

  return (
    <section className="rounded-[20px] border border-line bg-surface p-5">
      <h2 className="text-sm font-medium text-text">Behind this message</h2>

      {quotesUser ? (
        <div className="mt-4 rounded-[12px] border border-line bg-surface-2 p-3">
          <p className="text-[11px] uppercase tracking-widest text-text-3">Source</p>
          <p className="mt-1.5 text-xs leading-relaxed text-text-2">
            This conversation's history (Candy's thread), not the Life Engine. The engine stores
            nothing about the user.
          </p>
        </div>
      ) : null}

      {beat ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-3">{beat.slot}</span>
            {beat.arcId ? (
              <span className="rounded-full border border-violet/30 bg-violet/12 px-2.5 py-0.5 text-[11px] text-violet">
                {arcTitle(beat.arcId)}
              </span>
            ) : null}

          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-2">{beat.text}</p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-text-3">Today's payload</p>
          <ul className="mt-3 space-y-2 text-sm text-text-2">
            {released.length === 0 ? (
              <li className="text-text-3">Nothing released yet at this hour.</li>
            ) : (
              released.map((b) => (
                <li key={b.id}>
                  <span className="text-text-3">{b.slot}:</span> {b.text.slice(0, 70)}
                </li>
              ))
            )}
          </ul>
          <ul className="mt-4 space-y-2 text-sm text-text-2">
            {arcsState.map((arc) => (
              <li key={arc.id}>
                <span className="text-text">{arc.title}:</span> {arc.state}
              </li>
            ))}
          </ul>
          <Link
            to="/engine"
            className="mt-4 inline-block text-sm text-rose underline-offset-4 hover:underline"
          >
            See the full payload in the control room
          </Link>
        </div>
      )}

      <details className="mt-5 rounded-[12px] border border-line bg-surface-2 p-3">
        <summary className="cursor-pointer text-xs text-text-2">Injected block</summary>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-3">
          {injection}
        </pre>
      </details>

      <p className="mt-4 text-xs leading-relaxed text-text-3">
        Every line she says can be traced to a beat. That is what keeps her consistent.
      </p>
    </section>
  );
}

function ChatPage() {
  const [selected, setSelected] = useState<{ beatId: string | null; quotesUser: boolean }>({
    beatId: null,
    quotesUser: false,
  });
  const [sessionSignal, setSessionSignal] = useState(0);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-[150px] sm:px-6 sm:pb-[100px]">
      <PageHeader
        eyebrow="The chat"
        title="She answers from her day, not from nothing"
        description="The day block lands in the system prompt when the chat opens, with an open question she has not settled yet."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-3">
          <SessionPanel onNewSession={() => setSessionSignal((n) => n + 1)} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <PhoneChat
            onSelectBeat={(beatId, quotesUser) => setSelected({ beatId, quotesUser })}
            sessionSignal={sessionSignal}
          />
          <p className="mx-auto mt-4 max-w-[390px] text-xs leading-relaxed text-text-3">
            What she remembers you said lives in the chat thread, exactly where it lives in Candy
            today. v2 adds one line per storyline on the service side.
          </p>
        </div>
        <div className="order-3 lg:col-span-3">
          <BehindPanel selectedBeatId={selected.beatId} quotesUser={selected.quotesUser} />
        </div>
      </div>

      <DemoDock />
    </div>
  );
}
