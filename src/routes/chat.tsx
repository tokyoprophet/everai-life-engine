import { useMemo, useRef, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Rise } from "@/components/rise";
import { DemoControls } from "@/components/controls";
import { CodeBlock, DevPanel } from "@/components/dev-panel";
import { useEngine } from "@/lib/engine-context";
import { dayDate, pickBeat, promptBlock } from "@/lib/life-engine";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "The chat: she reports her day instead of inventing one" },
      {
        name: "description",
        content:
          "A short day block is pasted into the system prompt when a chat opens, so the character carries yesterday into today.",
      },
      { property: "og:title", content: "The chat: she reports her day" },
      {
        property: "og:description",
        content: "See the day block that Candy's backend pastes into the system prompt, and the reply it produces.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; from: "user" | "mia"; text: string; media?: string };

const prompts = ["Hey, how was your day?", "What is on your mind?", "Send me something.", "Anything new with Ana?"];

function ChatPage() {
  const { userId, day, eveningReleased } = useEngine();
  const morning = pickBeat(userId, day, "morning");
  const evening = pickBeat(userId, day, "evening");
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const idRef = useRef(0);

  const opener = useMemo(() => {
    const b = eveningReleased ? evening : morning;
    return `${b.what} ${capitalise(b.mood)}, if I am honest.`;
  }, [morning, evening, eveningReleased]);

  useEffect(() => {
    idRef.current = 0;
    setMessages([{ id: 0, from: "mia", text: opener }]);
  }, [opener]);

  function reply(text: string): Msg {
    const b = eveningReleased ? evening : morning;
    const lower = text.toLowerCase();
    idRef.current += 1;
    if (lower.includes("send") || lower.includes("photo") || lower.includes("picture")) {
      return {
        id: idRef.current,
        from: "mia",
        text: "Fine, but it is not flattering, it is just where I am.",
        media: b.media.brief,
      };
    }
    if (lower.includes("ana")) {
      return {
        id: idRef.current,
        from: "mia",
        text: "Ana is Ana. She is being careful with me, which is worse than her being blunt.",
      };
    }
    if (lower.includes("mind") || lower.includes("thinking")) {
      return { id: idRef.current, from: "mia", text: `${b.openQuestion} I keep circling it.` };
    }
    return {
      id: idRef.current,
      from: "mia",
      text: `${b.what} So: ${lowerFirst(b.openQuestion)}`,
    };
  }

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    idRef.current += 1;
    const userMsg: Msg = { id: idRef.current, from: "user", text: clean };
    setMessages((m) => [...m, userMsg, reply(clean)]);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-12 sm:px-6 sm:pt-16">
      <Rise>
        <h1 className="font-display text-3xl sm:text-5xl">The chat</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Same character, same model. The only change is a short block of her day in the system prompt. She
          answers from it, and she can raise the unresolved thing herself.
        </p>
      </Rise>

      <Rise delay={0.05}>
        <div className="mt-6">
          <DemoControls showEvening />
        </div>
      </Rise>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Rise delay={0.08}>
          <section className="panel flex h-full flex-col overflow-hidden">
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="accent-bg size-9 rounded-full" aria-hidden />
              <div>
                <p className="text-sm font-medium">Mia</p>
                <p className="text-xs text-subtle">Lisbon, {eveningReleased ? "21:04" : "10:12"} local</p>
              </div>
            </header>

            <div className="flex-1 space-y-3 px-4 py-5 sm:px-5">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        "max-w-[85%] rounded-[16px] px-4 py-3 text-sm leading-relaxed " +
                        (m.from === "user"
                          ? "accent-bg text-primary-foreground"
                          : "bg-surface-2 text-foreground")
                      }
                    >
                      <p>{m.text}</p>
                      {m.media ? (
                        <div className="mt-3 flex items-start gap-2 rounded-[12px] bg-background/60 p-3 text-xs text-subtle">
                          <Camera className="mt-0.5 size-3.5 text-gold" aria-hidden />
                          <span>
                            Photo request sent to the media pipeline, 2 tokens. Brief: {m.media}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border px-4 py-4 sm:px-5">
              <div className="flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-[12px] bg-surface-3/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                className="mt-3 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write to Mia"
                  aria-label="Write to Mia"
                  className="min-w-0 flex-1 rounded-[12px] bg-surface-2 px-4 py-3 text-sm text-foreground outline-none placeholder:text-subtle focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="accent-bg accent-ring rounded-[12px] p-3 text-primary-foreground"
                >
                  <Send className="size-4" aria-hidden />
                </button>
              </form>
            </div>
          </section>
        </Rise>

        <Rise delay={0.12}>
          <aside className="panel h-full p-6">
            <h2 className="text-lg font-medium">What she is working from</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {dayDate(day)}. The block below is the whole memory addition. It is about eighty tokens.
            </p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[12px] bg-background/70 p-4 text-[12px] leading-relaxed text-muted-foreground">
              <code>{promptBlock(userId, day, eveningReleased)}</code>
            </pre>
          </aside>
        </Rise>
      </div>

      <Rise delay={0.14}>
        <div className="mt-6">
          <DevPanel title="prompt assembly" note="Injected on chat open, after the persona card and before history.">
            <CodeBlock
              code={`system = [
  persona_card(character_id),
  day_block(character_id, user_id),   // the block on the right
  safety_policy(),
].join("\\n\\n")`}
            />
          </DevPanel>
        </div>
      </Rise>
    </div>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
