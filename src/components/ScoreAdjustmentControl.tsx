import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function ScoreAdjustmentControl({
  onAdjust,
}: {
  onAdjust: (amount: number) => Promise<boolean>;
}) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState<"add" | "sub" | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);

  const parsed = /^\d+$/.test(value.trim()) ? Number(value.trim()) : NaN;
  const valid = Number.isInteger(parsed) && parsed > 0;

  async function run(direction: "add" | "sub") {
    if (!valid) {
      setInvalid("Enter a positive whole number.");
      return;
    }
    setInvalid(null);
    setPending(direction);
    const ok = await onAdjust(direction === "add" ? parsed : -parsed);
    setPending(null);
    if (ok) setValue("");
  }

  return (
    <div className="mt-6">
      <label className="block text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
        Adjustment Amount
      </label>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d]/g, "");
          setValue(next);
          setInvalid(null);
        }}
        placeholder="25"
        className="adjust-input mt-2 w-full rounded-xl border px-4 py-3 text-center text-2xl font-bold tabular-nums"
      />
      {invalid && <p className="mt-2 text-center text-xs text-destructive">{invalid}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => void run("sub")}
          className="adjust-btn adjust-btn-sub inline-flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-bold uppercase"
        >
          <Minus className="size-4" /> {pending === "sub" ? "..." : "Subtract"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => void run("add")}
          className="adjust-btn adjust-btn-add inline-flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-bold uppercase"
        >
          <Plus className="size-4" /> {pending === "add" ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
}
