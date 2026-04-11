import type { ParkingStatus } from "@/types/parking";
import { STATUS_RING_COLOR } from "@/lib/status";

interface Props {
  percent: number;
  status: ParkingStatus;
  size?: number;
}

export function CircularProgress({ percent, status, size = 48 }: Props) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={STATUS_RING_COLOR[status]}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 origin-center fill-gray-700 text-xs font-semibold"
      >
        {Math.round(percent)}%
      </text>
    </svg>
  );
}
