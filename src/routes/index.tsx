import { createFileRoute } from "@tanstack/react-router";

import { PublicScoreboard } from "@/components/PublicScoreboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Group Scoreboard — Live Competition Scores" },
      {
        name: "description",
        content:
          "Live scoreboard for the Neel, Dijla and Furath group competition, with real-time score updates and a comparison chart.",
      },
      { property: "og:title", content: "Group Scoreboard — Live Competition Scores" },
      {
        property: "og:description",
        content: "Real-time scores for Neel, Dijla and Furath.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicScoreboard,
});
