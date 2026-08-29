import { useEffect, useState } from "react";

import type { GroupMeta } from "@/lib/groups";

export function PublicScoreCard({
  group,
  score,
  leading,
}: {
  group: GroupMeta;
  score: number;
  leading: boolean;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(t);
  }, [score]);

  return (
    <div
      className="group-card relative overflow-hidden rounded-3xl border p-6 text-center sm:p-8 lg:p-10"
      style={{ "--group": group.color } as React.CSSProperties}
    >
      {leading && <span className="leader-badge">Leading</span>}
      <h2 className="text-2xl font-extrabold tracking-[0.2em] uppercase sm:text-3xl lg:text-4xl">
        {group.name}
      </h2>
      <p className="mt-1 text-xs font-semibold tracking-[0.35em] uppercase opacity-70 sm:text-sm">
        {group.colorLabel}
      </p>
      <div
        className={`score-value mt-6 text-6xl leading-none font-black tabular-nums sm:text-7xl lg:text-8xl xl:text-9xl ${pulse ? "score-pop" : ""}`}
      >
        {score}
      </div>
    </div>
  );
}
