import type { FigureStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const STYLES: Record<FigureStatus, string> = {
  in_stock: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  on_demand: "bg-ember-500/15 text-ember-300 ring-ember-500/30",
  sold_out: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: FigureStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ring-1 ring-inset ${STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
