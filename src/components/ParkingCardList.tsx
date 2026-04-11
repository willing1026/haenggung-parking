"use client";

import { useMemo } from "react";
import { useParkingStore } from "@/store/parkingStore";
import { ParkingCard } from "./ParkingCard";
import type { ParkingLot } from "@/types/parking";

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
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
          const da =
            a.lat != null && a.lng != null
              ? haversine(userLocation.lat, userLocation.lng, a.lat, a.lng)
              : Infinity;
          const db =
            b.lat != null && b.lng != null
              ? haversine(userLocation.lat, userLocation.lng, b.lat, b.lng)
              : Infinity;
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

  const sorted = useMemo(
    () => sortLots(lots, sortBy, userLocation),
    [lots, sortBy, userLocation],
  );

  if (isLoading) {
    return (
      <div className="space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-400">
        주차장 정보를 불러올 수 없습니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((lot) => (
        <ParkingCard key={lot.id} lot={lot} />
      ))}
    </div>
  );
}
