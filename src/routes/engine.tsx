import { createFileRoute } from "@tanstack/react-router";

import { DemoDock } from "@/components/demo-dock";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "Control room: how the engine runs" },
      {
        name: "description",
        content:
          "The nightly job, release windows, per user beat selection, cost per character and the metrics that decide if it works.",
      },
      { property: "og:title", content: "Control room: how the engine runs" },
      {
        property: "og:description",
        content: "Cron, release windows, cost per character and the measurement plan.",
      },
    ],
  }),
  component: EnginePage,
});

function EnginePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-32 sm:px-6">
      <PageHeader
        eyebrow="Control room"
        title="One job a night, per character"
        description="Four candidate beats written once, two shown to each user, released on her local clock."
      />
      <DemoDock />
    </div>
  );
}
