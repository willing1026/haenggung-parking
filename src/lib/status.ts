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
  { label: string; color: string; bgColor: string }
> = {
  available: { label: "여유", color: "text-green-700", bgColor: "bg-green-100" },
  normal: { label: "보통", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  congested: { label: "혼잡", color: "text-orange-700", bgColor: "bg-orange-100" },
  full: { label: "만차", color: "text-red-700", bgColor: "bg-red-100" },
};

export const STATUS_RING_COLOR: Record<ParkingStatus, string> = {
  available: "#22c55e",
  normal: "#eab308",
  congested: "#f97316",
  full: "#ef4444",
};
