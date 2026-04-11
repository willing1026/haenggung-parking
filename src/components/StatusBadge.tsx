import type { ParkingStatus } from "@/types/parking";
import { STATUS_CONFIG } from "@/lib/status";

export function StatusBadge({ status }: { status: ParkingStatus }) {
  const { label, badgeBg, badgeText } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeBg} ${badgeText}`}>
      {label}
    </span>
  );
}
