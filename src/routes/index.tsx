import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Engine: a life that goes on between chats" },
      {
        name: "description",
        content:
          "A product prototype for Candy.ai: seasons, daily beats and a day block in the system prompt, so the character stops starting from zero.",
      },
      { property: "og:title", content: "Life Engine: a life between chats" },
      {
        property: "og:description",
        content: "Seasons, daily beats and a day block in the system prompt, built for retention.",
      },
    ],
  }),
  component: IdeaPage,
});

function IdeaPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="The idea"
        title="Give every character a life that goes on between chats"
        description="Half of paid users leave in month one. The engine gives the character her own days, so she has something to bring to the conversation."
      />
    </div>
  );
}
