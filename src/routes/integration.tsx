import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/integration")({
  head: () => ({
    meta: [
      { title: "For Candy: how this drops into the product" },
      {
        name: "description",
        content:
          "One endpoint, one prompt block and briefs that feed the existing proactive media pipeline. No new media generation.",
      },
      { property: "og:title", content: "For Candy: how this drops into the product" },
      {
        property: "og:description",
        content: "One endpoint, one prompt block, briefs into the existing media pipeline.",
      },
    ],
  }),
  component: IntegrationPage,
});

function IntegrationPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="For Candy"
        title="One endpoint, one prompt block"
        description="The engine writes beats and briefs. Candy keeps the chat, the media pipeline and the token economics exactly as they are."
      />
    </div>
  );
}
