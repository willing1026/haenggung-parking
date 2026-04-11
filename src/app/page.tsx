"use client";

import { Header } from "@/components/Header";
import { HeroRecommendation } from "@/components/HeroRecommendation";
import { SortSelector } from "@/components/SortSelector";
import { ParkingCardList } from "@/components/ParkingCardList";
import { useParkingStore } from "@/store/parkingStore";
import { usePolling } from "@/hooks/usePolling";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Home() {
  usePolling();
  useGeolocation();

  const lots = useParkingStore((s) => s.lots);
  const availableCount = lots.filter((l) => l.available > 0).length;

  return (
    <main className="mx-auto w-full max-w-lg space-y-4 pb-8">
      <Header />
      <HeroRecommendation />

      {/* 섹션 헤더: 리스트 타이틀 + 인라인 정렬 */}
      <div className="flex items-center justify-between px-4 pt-2">
        <span className="text-sm text-text-secondary">
          다른 주차장 <span className="text-text-primary font-medium">{Math.max(0, availableCount - 1)}</span>곳 여유
        </span>
        <SortSelector />
      </div>

      <ParkingCardList />
    </main>
  );
}
