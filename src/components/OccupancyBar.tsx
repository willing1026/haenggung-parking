import type { ParkingStatus } from "@/types/parking";
import { STATUS_CONFIG } from "@/lib/status";

interface Props {
  available: number;
  total: number;
  status: ParkingStatus;
}

export function OccupancyBar({ available, total, status }: Props) {
  const occupiedPercent = total > 0 ? ((total - available) / total) * 100 : 100;
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 rounded-full bg-border/40 overflow-hidden">
        <div
          className={`h-full rounded-full ${config.barColor} transition-all duration-500`}
          style={{ width: `${occupiedPercent}%` }}
        />
      </div>
      <span className="text-sm tabular-nums font-medium whitespace-nowrap">
        <span className={`text-lg font-bold ${available > 0 ? config.badgeText : "text-text-muted"}`}>
          {available}
        </span>
        <span className="text-text-muted text-xs">/{total}</span>
      </span>
    </div>
  );
}
