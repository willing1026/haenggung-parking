"use client";

import { useMemo } from "react";
import { WifiOff } from "lucide-react";
import { useParkingStore } from "@/store/parkingStore";
import { ParkingCard } from "./ParkingCard";
import type { ParkingLot } from "@/types/parking";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sortLots(
  lots: ParkingLot[],
  sortBy: string,
  userLocation: { lat: number; lng: number } | null,
): ParkingLot[] {
  const sorted = [...lots];
  switch (sortBy) {
    case "availability":
      sorted.sort((a, b) => b.available - a.available);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
      break;
    case "distance":
      if (userLocation) {
        sorted.sort((a, b) => {
          const da = a.lat != null && a.lng != null
            ? haversine(userLocation.lat, userLocation.lng, a.lat, a.lng) : Infinity;
          const db = b.lat != null && b.lng != null
            ? haversine(userLocation.lat, userLocation.lng, b.lat, b.lng) : Infinity;
          return da - db;
        });
      }
      break;
  }
  return sorted;
}

export function ParkingCardList() {
  const lots = useParkingStore((s) => s.lots);
  const sortBy = useParkingStore((s) => s.sortBy);
  const userLocation = useParkingStore((s) => s.userLocation);
  const isLoading = useParkingStore((s) => s.isLoading);
  const error = useParkingStore((s) => s.error);
  const fetchLots = useParkingStore((s) => s.fetchLots);

  const sorted = useMemo(
    () => sortLots(lots, sortBy, userLocation),
    [lots, sortBy, userLocation],
  );

  if (isLoading) {
    return (
      <div className="space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-bg-card border border-border overflow-hidden">
            <div className="h-1 w-full bg-border animate-pulse" />
            <div className="px-4 py-3 space-y-3">
              <div className="h-4 w-32 bg-border rounded animate-pulse" />
              <div className="h-2 w-full bg-border rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && sorted.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <WifiOff size={40} className="mx-auto text-text-secondary mb-3" />
        <p className="text-text-primary font-medium mb-1">데이터를 불러올 수 없어요</p>
        <p className="text-sm text-text-secondary mb-4">인터넷 연결을 확인해주세요</p>
        <button
          onClick={() => fetchLots()}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4">
      {sorted.map((lot) => (
        <ParkingCard key={lot.id} lot={lot} />
      ))}
    </div>
  );
}
