import type { ParkingStatus } from "@/types/parking";

export function calculateStatus(available: number, total: number): ParkingStatus {
  if (total === 0) return "full";
  const ratio = available / total;
  if (ratio > 0.5) return "available";
  if (ratio > 0.2) return "normal";
  if (ratio > 0.05) return "congested";
  return "full";
}

export const STATUS_CONFIG: Record<
  ParkingStatus,
  { label: string; barColor: string; badgeBg: string; badgeText: string; cardGlow: string }
> = {
  available: {
    label: "여유",
    barColor: "bg-green-500",
    badgeBg: "bg-green-500/15",
    badgeText: "text-green-400",
    cardGlow: "glow-green",
  },
  normal: {
    label: "보통",
    barColor: "bg-amber-500",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    cardGlow: "glow-amber",
  },
  congested: {
    label: "혼잡",
    barColor: "bg-orange-500",
    badgeBg: "bg-orange-500/15",
    badgeText: "text-orange-400",
    cardGlow: "glow-orange",
  },
  full: {
    label: "만차",
    barColor: "bg-red-500",
    badgeBg: "bg-red-500/15",
    badgeText: "text-red-400",
    cardGlow: "glow-red",
  },
};
