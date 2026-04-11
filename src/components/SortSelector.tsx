"use client";

import type { SortBy } from "@/types/parking";
import { useParkingStore } from "@/store/parkingStore";

const OPTIONS: { value: SortBy; label: string }[] = [
  { value: "availability", label: "잔여순" },
  { value: "name", label: "이름순" },
  { value: "distance", label: "거리순" },
];

export function SortSelector() {
  const sortBy = useParkingStore((s) => s.sortBy);
  const setSortBy = useParkingStore((s) => s.setSortBy);

  return (
    <div className="flex rounded-lg bg-bg-card/60 backdrop-blur-sm border border-border/30 p-0.5">
      {OPTIONS.map((opt) => {
        const active = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              active
                ? "bg-blue-500/15 text-blue-400"
                : "text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
