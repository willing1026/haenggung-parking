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
    <div className="flex rounded-lg bg-bg-card p-1 mx-4">
      {OPTIONS.map((opt) => {
        const active = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              active
                ? "bg-border text-text-primary shadow-sm"
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
