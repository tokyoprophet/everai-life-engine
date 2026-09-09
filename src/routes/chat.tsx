import { createFileRoute } from "@tanstack/react-router";

import { DemoDock } from "@/components/demo-dock";
import { PageHeader } from "@/components/page-header";

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

function ChatPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-32 sm:px-6">
      <PageHeader
        eyebrow="The chat"
        title="She answers from her day, not from nothing"
        description="The day block lands in the system prompt when the chat opens, with an open question she has not settled yet."
      />
      <DemoDock />
    </div>
  );
}
