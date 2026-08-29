import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "./supabase";
import { sortGroups, type GroupScore } from "./groups";

/**
 * Live group scores straight from Supabase.
 * Realtime first, with a lightweight polling fallback.
 * Scores are never written to browser storage.
 */
export function useGroupScores() {
  const [scores, setScores] = useState<GroupScore[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchScores = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("group_scores")
      .select("id, group_name, score, updated_at");

    if (!mounted.current) return;
    if (err) {
      setError("Unable to load the latest scores. Please try again.");
    } else {
      setScores(sortGroups((data ?? []) as GroupScore[]));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    void fetchScores();

    const channel = supabase
      .channel("group-scores-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_scores" },
        () => void fetchScores(),
      )
      .subscribe();

    const interval = window.setInterval(() => void fetchScores(), 8000);

    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, [fetchScores]);

  return { scores, loading, error, refetch: fetchScores };
}
