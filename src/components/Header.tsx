"use client";

import { useParkingStore } from "@/store/parkingStore";

export function Header() {
  const timestamp = useParkingStore((s) => s.timestamp);

  const formatted = timestamp
    ? new Date(timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : null;

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <h1 className="text-lg font-bold">행궁동 주차 현황</h1>
      {formatted && (
        <span className="text-xs text-gray-500">{formatted} 갱신</span>
      )}
    </header>
  );
}
