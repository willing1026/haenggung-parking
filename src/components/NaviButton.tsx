"use client";

import { useCallback } from "react";
import { Navigation } from "lucide-react";
import { getNaviUrl, getNaviFallbackUrl } from "@/lib/navi";

interface Props {
  lat: number;
  lng: number;
  name: string;
  variant?: "primary" | "compact";
}

export function NaviButton({ lat, lng, name, variant = "compact" }: Props) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const appUrl = getNaviUrl(lat, lng, name, "naver");
      const webUrl = getNaviFallbackUrl(lat, lng, name, "naver");

      // 모바일: 앱 스킴 시도 → 타임아웃 시 웹 폴백
      const start = Date.now();
      const timeout = setTimeout(() => {
        // 앱이 열렸으면 페이지가 백그라운드로 가서 타이머가 지연됨
        if (Date.now() - start < 2000) {
          window.location.href = webUrl;
        }
      }, 800);

      window.addEventListener(
        "blur",
        () => clearTimeout(timeout),
        { once: true },
      );

      window.location.href = appUrl;
    },
    [lat, lng, name],
  );

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
          bg-blue-500 hover:bg-blue-600 active:bg-blue-700
          text-white text-sm font-semibold transition-colors"
      >
        <Navigation size={16} />
        네이버지도로 안내
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg
        bg-blue-500/15 text-blue-400 text-sm font-medium
        hover:bg-blue-500/25 active:bg-blue-500/35 transition-colors"
    >
      <Navigation size={14} />
      길찾기
    </button>
  );
}
