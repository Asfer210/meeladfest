import { GROUPS, latestUpdatedAt } from "@/lib/groups";
import { useGroupScores } from "@/lib/useGroupScores";

import { PublicScoreCard } from "./PublicScoreCard";
import { ScoreChart } from "./ScoreChart";

export function PublicScoreboard() {
  const { scores, loading, error } = useGroupScores();

  const updatedAt = scores ? latestUpdatedAt(scores) : null;
  const max = scores ? Math.max(...scores.map((s) => s.score), 0) : 0;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="text-center">
          <h1 className="text-3xl font-black tracking-[0.18em] uppercase sm:text-5xl lg:text-6xl">
            Group Scoreboard
          </h1>
          <p className="mt-3 text-sm tracking-[0.3em] text-muted-foreground uppercase sm:text-base">
            Live competition standings
          </p>
        </header>

        {loading && !scores && (
          <p className="mt-20 text-center text-lg text-muted-foreground">
            Loading latest scores...
          </p>
        )}

        {error && !scores && (
          <p className="mt-20 text-center text-lg text-destructive">
            Unable to load the latest scores.
            <br />
            Please try again.
          </p>
        )}

        {scores && (
          <>
            <section className="mt-10 grid gap-6 sm:grid-cols-3 lg:mt-14 lg:gap-8">
              {GROUPS.map((group) => {
                const score = scores.find((s) => s.group_name === group.name)?.score ?? 0;
                return (
                  <PublicScoreCard
                    key={group.name}
                    group={group}
                    score={score}
                    leading={max > 0 && score === max}
                  />
                );
              })}
            </section>

            <section className="mt-14 lg:mt-20">
              <h2 className="mb-6 text-center text-lg font-bold tracking-[0.3em] text-muted-foreground uppercase sm:text-xl">
                Current Scores
              </h2>
              <ScoreChart scores={scores} />
            </section>

            <p className="mt-10 text-center text-xs tracking-widest text-muted-foreground uppercase sm:text-sm">
              Last updated:{" "}
              {updatedAt
                ? new Date(updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
            {error && (
              <p className="mt-2 text-center text-xs text-destructive">
                Connection issue — showing the last received scores.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
