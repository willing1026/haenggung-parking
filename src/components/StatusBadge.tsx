import type { ParkingStatus } from "@/types/parking";
import { STATUS_CONFIG } from "@/lib/status";

interface Props {
  status: ParkingStatus;
}

export function StatusBadge({ status }: Props) {
  const { label, color, bgColor } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} ${bgColor}`}
    >
      {label}
    </span>
  );
}
