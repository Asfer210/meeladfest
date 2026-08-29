import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GROUPS, type GroupScore } from "@/lib/groups";

export function ScoreChart({ scores }: { scores: GroupScore[] }) {
  const data = GROUPS.map((g) => ({
    name: g.name,
    score: scores.find((s) => s.group_name === g.name)?.score ?? 0,
    color: g.color,
  }));

  return (
    <div className="chart-panel rounded-3xl border p-4 sm:p-6">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 24, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 14, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-cursor)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <Bar dataKey="score" radius={[12, 12, 0, 0]} animationDuration={700} maxBarSize={110}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <LabelList
              dataKey="score"
              position="top"
              style={{ fill: "var(--foreground)", fontWeight: 800, fontSize: 18 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
