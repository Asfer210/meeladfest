export type GroupName = "Neel" | "Dijla" | "Furath";

export interface GroupScore {
  id: string;
  group_name: GroupName;
  score: number;
  updated_at: string;
}

export interface GroupMeta {
  name: GroupName;
  colorLabel: string;
  /** CSS color value (design token) used for themed surfaces and the chart. */
  color: string;
  /** Tailwind-friendly token names defined in src/styles.css */
  varName: string;
}

export const GROUPS: GroupMeta[] = [
  { name: "Neel", colorLabel: "Blue", color: "var(--group-neel)", varName: "--group-neel" },
  { name: "Dijla", colorLabel: "Red", color: "var(--group-dijla)", varName: "--group-dijla" },
  { name: "Furath", colorLabel: "Green", color: "var(--group-furath)", varName: "--group-furath" },
];

export const GROUP_ORDER: GroupName[] = ["Neel", "Dijla", "Furath"];

export function sortGroups(rows: GroupScore[]): GroupScore[] {
  return [...rows].sort(
    (a, b) => GROUP_ORDER.indexOf(a.group_name) - GROUP_ORDER.indexOf(b.group_name),
  );
}

export function latestUpdatedAt(rows: GroupScore[]): string | null {
  const first = rows[0];
  if (!first) return null;
  return rows.reduce(
    (latest, row) => (new Date(row.updated_at) > new Date(latest) ? row.updated_at : latest),
    first.updated_at,
  );
}

