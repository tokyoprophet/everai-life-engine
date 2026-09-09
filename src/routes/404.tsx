import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page not found: Life Engine" },
      { name: "description", content: "This page does not exist in the Life Engine prototype." },
      { property: "og:title", content: "Page not found: Life Engine" },
      {
        property: "og:description",
        content: "This page does not exist in the Life Engine prototype.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-text-3">404</p>
      <h1 className="mt-3 font-display text-3xl text-text">This page is not part of the demo.</h1>
      <p className="mt-3 text-sm text-text-2">
        You are looking at a page that does not exist. The demo lives on five pages, starting with
        the idea.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white accent-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Back to the idea
      </Link>
    </div>
  );
}
