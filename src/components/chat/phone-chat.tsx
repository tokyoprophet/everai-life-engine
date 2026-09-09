import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

import {
  DAY0_OPENER,
  day0EveningBeatId,
  findBeat,
  opener,
  reOpener,
  reply,
} from "@/chat/scriptedChat";

import { useDemoState, type DemoMessage } from "@/lib/demo-state";

const QUICK_REPLIES = [
  "send it. with a late fee. stop being polite",
  "give him till friday, then call",
  "how are you really feeling about ana?",
  "what did you shoot today?",
];

function TypingDots() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-surface-3 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-3"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function Bubble({
  message,
  grouped,
  onSelect,
}: {
  message: DemoMessage;
  grouped: boolean;
  onSelect: (beatId: string | null) => void;
}) {
  const mine = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${mine ? "justify-end" : "justify-start"} ${grouped ? "mt-1" : "mt-3"}`}
    >
      <button
        type="button"
        onMouseEnter={() => !mine && onSelect(message.sourceBeatId)}
        onFocus={() => !mine && onSelect(message.sourceBeatId)}
        onClick={() => !mine && onSelect(message.sourceBeatId)}
        className={`max-w-[78%] rounded-[18px] px-4 py-2.5 text-left text-[15px] leading-snug ${
          mine
            ? "rounded-br-[6px] bg-accent text-white"
            : "rounded-bl-[6px] bg-surface-3 text-text"
        }`}
      >
        {message.text}
      </button>
    </motion.div>
  );
}

export function PhoneChat({
  onSelectBeat,
  sessionSignal,
}: {
  onSelectBeat: (beatId: string | null) => void;
  sessionSignal: number;
}) {
  const { day, userId, hour, hydrated, messages, threads, pushMessage, setThread } =
    useDemoState();
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;
    if (messages.length === 0) {
      pushMessage({
        role: "mia",
        text: DAY0_OPENER,
        sourceBeatId: day0EveningBeatId(userId),
      });
    }
  }, [hydrated, messages.length, pushMessage, userId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  function speak(lines: { text: string; sourceBeatId: string | null }[]) {
    setTyping(true);
    const delay = 600 + Math.floor(Math.random() * 600);
    window.setTimeout(() => {
      setTyping(false);
      lines.forEach((line) =>
        pushMessage({ role: "mia", text: line.text, sourceBeatId: line.sourceBeatId }),
      );
    }, delay);
  }

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setDraft("");
    pushMessage({ role: "user", text: clean, sourceBeatId: null });
    const answer = reply(clean, day, userId, hour, messages.length);
    if (answer.arcId) setThread(answer.arcId, clean);
    speak(answer.messages);
  }

  const lastSession = useRef(sessionSignal);
  const lastDay = useRef(day);
  useEffect(() => {
    if (!hydrated) return;
    if (sessionSignal === lastSession.current && day === lastDay.current) return;
    const manual = sessionSignal !== lastSession.current && day === lastDay.current;
    lastSession.current = sessionSignal;
    lastDay.current = day;
    if (manual) {
      const used = messages
        .map((m) => m.sourceBeatId)
        .filter((id): id is string => Boolean(id));
      speak(reOpener(day, userId, hour, used));
    } else {
      speak(opener(day, userId, hour, threads));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSignal, day, hydrated]);


  let renderedDay = -1;

  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div className="rounded-[40px] border border-line bg-[#08080D] p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex h-[780px] max-h-[78vh] flex-col overflow-hidden rounded-[32px] bg-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-accent text-sm font-semibold text-white">
              M
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">Mia</p>
              <p className="flex items-center gap-1.5 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                online · Lisbon
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] text-text-3">
              Candy stand-in
            </span>
          </header>

          <div ref={listRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
            {messages.map((message, i) => {
              const beat = findBeat(message.sourceBeatId);
              const beatDay = beat?.day ?? renderedDay;
              const showSeparator = beatDay !== renderedDay;
              if (showSeparator) renderedDay = beatDay;
              const prev = messages[i - 1];
              const grouped =
                !showSeparator && prev?.role === message.role && message.role === "mia";
              return (
                <div key={message.id}>
                  {showSeparator ? (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] text-text-3">
                        Day {beatDay < 0 ? 0 : beatDay}
                      </span>
                    </div>
                  ) : null}
                  <Bubble message={message} grouped={grouped} onSelect={onSelectBeat} />
                </div>
              );
            })}
            {typing ? (
              <div className="mt-3">
                <TypingDots />
              </div>
            ) : null}
          </div>

          <div className="border-t border-line px-3 pb-3 pt-3">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
              {QUICK_REPLIES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  className="shrink-0 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text-2 transition-colors hover:text-text"
                >
                  {chip}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message Mia"
                aria-label="Message Mia"
                className="h-11 flex-1 rounded-full border border-line bg-surface-2 px-4 text-sm text-text placeholder:text-text-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
