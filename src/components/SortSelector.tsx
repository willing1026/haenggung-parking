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
  const userLocation = useParkingStore((s) => s.userLocation);

  return (
    <div className="flex gap-2 px-4 py-2">
      {OPTIONS.map((opt) => {
        const disabled = opt.value === "distance" && !userLocation;
        const active = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            disabled={disabled}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-gray-900 text-white"
                : disabled
                  ? "bg-gray-100 text-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
