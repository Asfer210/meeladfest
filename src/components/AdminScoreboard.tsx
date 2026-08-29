import { LogOut } from "lucide-react";
import { useState } from "react";

import { GROUPS, type GroupName } from "@/lib/groups";
import { ADMIN_PASSWORD } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { useGroupScores } from "@/lib/useGroupScores";

import { GroupScoreCard } from "./GroupScoreCard";

export function AdminScoreboard({ onLogout }: { onLogout: () => void }) {
  const { scores, loading, error, refetch } = useGroupScores();
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function adjust(groupName: GroupName, amount: number) {
    setUpdateError(null);
    const { error: err } = await supabase.rpc("update_group_score", {
      target_group: groupName,
      adjustment: amount,
      admin_key: ADMIN_PASSWORD,
    });
    if (err) {
      setUpdateError("Unable to update the score. Please try again.");
      return false;
    }
    await refetch();
    return true;
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em] uppercase sm:text-3xl">
              Score Management
            </h1>
            <p className="mt-1 text-xs tracking-[0.25em] text-muted-foreground uppercase">
              Enter an adjustment, then add or subtract
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:bg-accent"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </header>

        {loading && !scores && (
          <p className="mt-20 text-center text-muted-foreground">Loading latest scores...</p>
        )}

        {error && !scores && (
          <p className="mt-20 text-center text-destructive">
            Unable to load the latest scores. Please try again.
          </p>
        )}

        {updateError && <p className="mt-6 text-center text-sm text-destructive">{updateError}</p>}

        {scores && (
          <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <GroupScoreCard
                key={group.name}
                group={group}
                score={scores.find((s) => s.group_name === group.name)?.score ?? 0}
                onAdjust={(amount) => adjust(group.name, amount)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
