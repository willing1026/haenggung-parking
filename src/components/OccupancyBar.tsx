import type { ParkingStatus } from "@/types/parking";
import { STATUS_CONFIG } from "@/lib/status";

interface Props {
  available: number;
  total: number;
  status: ParkingStatus;
}

export function OccupancyBar({ available, total, status }: Props) {
  const occupiedPercent = total > 0 ? ((total - available) / total) * 100 : 100;

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${STATUS_CONFIG[status].barColor}`}
          style={{ width: `${occupiedPercent}%` }}
        />
      </div>
      <span className="text-sm tabular-nums font-medium text-text-primary whitespace-nowrap">
        <span className="text-lg font-bold">{available}</span>
        <span className="text-text-secondary">/{total}</span>
      </span>
    </div>
  );
}
