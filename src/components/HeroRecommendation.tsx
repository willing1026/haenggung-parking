"use client";

import { Navigation } from "lucide-react";
import { useParkingStore } from "@/store/parkingStore";
import { STATUS_CONFIG } from "@/lib/status";
import { getNaviUrl } from "@/lib/navi";
import type { ParkingLot } from "@/types/parking";

function pickRecommendation(lots: ParkingLot[]): ParkingLot | null {
  const available = lots.filter((l) => l.available > 0);
  if (available.length === 0) return null;
  // 잔여석 가장 많은 주차장
  return available.sort((a, b) => b.available - a.available)[0];
}

export function HeroRecommendation() {
  const lots = useParkingStore((s) => s.lots);
  const isLoading = useParkingStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="mx-4 rounded-2xl bg-bg-card border border-border/50 p-5 animate-pulse">
        <div className="h-3 w-20 bg-border rounded mb-3" />
        <div className="h-8 w-32 bg-border rounded mb-3" />
        <div className="h-4 w-48 bg-border rounded" />
      </div>
    );
  }

  const totalAvailable = lots.reduce((sum, l) => sum + l.available, 0);
  const availableCount = lots.filter((l) => l.available > 0).length;
  const recommended = pickRecommendation(lots);

  // 전부 만차
  if (!recommended) {
    return (
      <div className="mx-4 rounded-2xl bg-bg-card border border-red-500/20 p-5 glow-red">
        <p className="text-xs text-red-400 font-medium mb-1">현재 상황</p>
        <p className="text-2xl font-bold text-red-400">모든 주차장 만차</p>
        <p className="text-sm text-text-secondary mt-2">잠시 후 다시 확인해주세요</p>
      </div>
    );
  }

  const config = STATUS_CONFIG[recommended.status];
  const naviUrl = recommended.lat && recommended.lng
    ? getNaviUrl(recommended.lat, recommended.lng, recommended.name)
    : null;

  return (
    <div className={`mx-4 rounded-2xl bg-bg-card border border-border/50 p-5 ${config.cardGlow}`}>
      {/* 상단: 추천 라벨 + 전체 현황 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-blue-400 font-medium">추천 주차장</p>
        <p className="text-xs text-text-muted">
          {lots.length}곳 중 {availableCount}곳 여유
        </p>
      </div>

      {/* 주차장 이름 + 상태 */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-text-primary">{recommended.name}</h2>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}>
          {config.label}
        </span>
      </div>

      {/* 잔여석 히어로 */}
      <p className="mb-3">
        <span className={`text-3xl font-extrabold tabular-nums ${config.badgeText} drop-shadow-[0_0_12px_rgba(74,222,128,0.2)]`}>
          {recommended.available}
        </span>
        <span className="text-text-secondary ml-1">/ {recommended.total}면 남음</span>
      </p>

      {/* 요금 한 줄 요약 */}
      {recommended.feeBase && (
        <p className="text-sm text-text-secondary mb-4">
          {recommended.feeBase}
          {recommended.feeAdditional && ` · ${recommended.feeAdditional}`}
        </p>
      )}

      {/* 길찾기 CTA */}
      {naviUrl && (
        <a
          href={naviUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
            bg-blue-500 hover:bg-blue-600 active:bg-blue-700
            text-white text-sm font-semibold transition-colors"
        >
          <Navigation size={16} />
          길찾기
        </a>
      )}
    </div>
  );
}
