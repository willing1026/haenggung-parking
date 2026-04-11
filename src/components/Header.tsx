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
    <header className="relative overflow-hidden px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-600/8 via-transparent to-transparent" />
      <div className="relative flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-blue-400/70 uppercase">수원 행궁동</p>
          <h1 className="text-xl font-bold text-text-primary mt-0.5">주차 현황</h1>
        </div>
        {formatted && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary pb-0.5">
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            <span className="tabular-nums">{formatted}</span>
          </div>
        )}
      </div>
    </header>
  );
}
