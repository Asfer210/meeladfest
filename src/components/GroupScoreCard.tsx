import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import type { GroupMeta } from "@/lib/groups";

import { ScoreAdjustmentControl } from "./ScoreAdjustmentControl";

export function GroupScoreCard({
  group,
  score,
  onAdjust,
}: {
  group: GroupMeta;
  score: number;
  onAdjust: (amount: number) => Promise<boolean>;
}) {
  const [success, setSuccess] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(t);
  }, [score]);

  async function handleAdjust(amount: number) {
    const ok = await onAdjust(amount);
    if (ok) {
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 1800);
    }
    return ok;
  }

  return (
    <div
      className="group-card relative rounded-3xl border p-6 text-center"
      style={{ "--group": group.color } as React.CSSProperties}
    >
      {success && (
        <span className="leader-badge">
          <Check className="mr-1 inline size-3" />
          Updated
        </span>
      )}
      <h2 className="text-xl font-extrabold tracking-[0.2em] uppercase">{group.name}</h2>
      <p className="mt-1 text-xs font-semibold tracking-[0.3em] uppercase opacity-70">
        {group.colorLabel}
      </p>
      <div
        className={`score-value mt-4 text-5xl leading-none font-black tabular-nums ${pulse ? "score-pop" : ""}`}
      >
        {score}
      </div>
      <ScoreAdjustmentControl onAdjust={handleAdjust} />
    </div>
  );
}
