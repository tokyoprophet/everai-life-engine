import { createFileRoute } from "@tanstack/react-router";

import { DemoDock } from "@/components/demo-dock";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/mia")({
  head: () => ({
    meta: [
      { title: "Her life: Mia's season and daily beats" },
      {
        name: "description",
        content:
          "Mia, 26, freelance photographer in Lisbon. Three slow storylines over four weeks, two beats a day, morning and evening.",
      },
      { property: "og:title", content: "Her life: Mia's season and daily beats" },
      {
        property: "og:description",
        content: "Three storylines, four weeks, two beats a day in Mia's own timezone.",
      },
    ],
  }),
  component: MiaPage,
});

function MiaPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 pb-32 sm:px-6">
      <PageHeader
        eyebrow="Her life"
        title="Mia's season, day by day"
        description="Three storylines seeded once from her card, then two beats a day written by the nightly job in Europe/Lisbon."
      />
      <DemoDock />
    </div>
  );
}
