"use client";

import { useParkingStore } from "@/store/parkingStore";
import { STATUS_CONFIG } from "@/lib/status";
import { NaviButton } from "./NaviButton";
import type { ParkingLot } from "@/types/parking";

// 화성행궁 좌표
const HWASEONG = { lat: 37.2841, lng: 127.0159 };

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pickRecommendation(lots: ParkingLot[]): ParkingLot | null {
  // 실시간 + 잔여 있는 것만
  const candidates = lots.filter(
    (l) => !l.id.startsWith("static-") && l.available > 0 && l.lat != null && l.lng != null,
  );
  if (candidates.length === 0) return null;

  // 점수 = 거리 점수(0~50) + 잔여 점수(0~50)
  const maxAvailable = Math.max(...candidates.map((l) => l.available));
  const distances = candidates.map((l) => haversineM(HWASEONG.lat, HWASEONG.lng, l.lat!, l.lng!));
  const maxDist = Math.max(...distances);

  let bestIdx = 0;
  let bestScore = -1;

  for (let i = 0; i < candidates.length; i++) {
    const distScore = maxDist > 0 ? (1 - distances[i] / maxDist) * 60 : 60; // 가까울수록 높음
    const availScore = maxAvailable > 0 ? (candidates[i].available / maxAvailable) * 40 : 0;
    const score = distScore + availScore;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return candidates[bestIdx];
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
      {recommended.lat && recommended.lng && (
        <NaviButton lat={recommended.lat} lng={recommended.lng} name={recommended.name} variant="primary" />
      )}
    </div>
  );
}
