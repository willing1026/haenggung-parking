"use client";

import { useParkingStore } from "@/store/parkingStore";

export function SummaryBar() {
  const lots = useParkingStore((s) => s.lots);

  const totalSpaces = lots.reduce((sum, l) => sum + l.total, 0);
  const totalAvailable = lots.reduce((sum, l) => sum + l.available, 0);
  const occupancyPercent =
    totalSpaces > 0 ? Math.round(((totalSpaces - totalAvailable) / totalSpaces) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      <Stat label="전체" value={totalSpaces} unit="면" />
      <Stat label="잔여" value={totalAvailable} unit="면" highlight />
      <Stat label="이용률" value={occupancyPercent} unit="%" />
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center rounded-lg bg-bg-card px-3 py-2.5">
      <p className="text-xs text-text-secondary mb-0.5">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${highlight ? "text-green-400" : "text-text-primary"}`}>
        {value}
        <span className="text-xs font-normal text-text-secondary ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
