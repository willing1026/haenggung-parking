"use client";

import { RefreshCw } from "lucide-react";
import { useParkingStore } from "@/store/parkingStore";

export function Header() {
  const timestamp = useParkingStore((s) => s.timestamp);
  const isLoading = useParkingStore((s) => s.isLoading);

  const formatted = timestamp
    ? new Date(timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : null;

  return (
    <header className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <h1 className="text-lg font-bold text-text-primary">행궁동 주차 현황</h1>
      {formatted && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          <span className="tabular-nums">{formatted} 갱신</span>
        </div>
      )}
    </header>
  );
}
