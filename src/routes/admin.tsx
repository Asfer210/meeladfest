import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminLogin } from "@/components/AdminLogin";
import { AdminScoreboard } from "@/components/AdminScoreboard";
import { checkCredentials, readSession, writeSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Group Scoreboard" },
      {
        name: "description",
        content: "Private admin area for updating the Neel, Dijla and Furath group scores.",
      },
      { property: "og:title", content: "Admin — Group Scoreboard" },
      { property: "og:description", content: "Private score management area." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(readSession());
  }, []);

  if (!authed) {
    return (
      <AdminLogin
        onLogin={(u, p) => {
          if (!checkCredentials(u, p)) return false;
          writeSession(true);
          setAuthed(true);
          return true;
        }}
      />
    );
  }

  return (
    <AdminScoreboard
      onLogout={() => {
        writeSession(false);
        setAuthed(false);
      }}
    />
  );
}
