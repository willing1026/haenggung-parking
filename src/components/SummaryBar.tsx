"use client";

import { useParkingStore } from "@/store/parkingStore";

export function SummaryBar() {
  const lots = useParkingStore((s) => s.lots);

  const totalSpaces = lots.reduce((sum, l) => sum + l.total, 0);
  const totalAvailable = lots.reduce((sum, l) => sum + l.available, 0);
  const occupancyPercent =
    totalSpaces > 0 ? Math.round(((totalSpaces - totalAvailable) / totalSpaces) * 100) : 0;

  return (
    <div className="mx-4 flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm">
      <Stat label="전체" value={`${totalSpaces}면`} />
      <Stat label="잔여" value={`${totalAvailable}면`} highlight />
      <Stat label="이용률" value={`${occupancyPercent}%`} />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex-1 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-base font-bold ${highlight ? "text-blue-600" : ""}`}>
        {value}
      </div>
    </div>
  );
}
