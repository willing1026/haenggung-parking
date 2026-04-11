"use client";

import { Navigation } from "lucide-react";
import { getNaviUrl } from "@/lib/navi";

interface Props {
  lat: number;
  lng: number;
  name: string;
  variant?: "primary" | "compact";
}

export function NaviButton({ lat, lng, name, variant = "compact" }: Props) {
  const url = getNaviUrl(lat, lng, name);

  if (variant === "primary") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
          bg-blue-500 hover:bg-blue-600 active:bg-blue-700
          text-white text-sm font-semibold transition-colors"
      >
        <Navigation size={16} />
        카카오맵으로 안내
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg
        bg-blue-500/15 text-blue-400 text-sm font-medium
        hover:bg-blue-500/25 active:bg-blue-500/35 transition-colors"
    >
      <Navigation size={14} />
      길찾기
    </a>
  );
}
