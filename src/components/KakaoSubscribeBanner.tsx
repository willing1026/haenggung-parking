"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { trackKakaoSubscribeClick } from "@/lib/analytics";

// Month 1 결정(2026-06-09): 구독 채널 없이 진행.
// Month 2(2026-07-05) 재결정 시 DISABLED 플래그 제거 후 활성화.
// 채널 URL 확정 시 KAKAO_CHANNEL_URL 교체.
const DISABLED = true;

// const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_placeholder";

// 카피 3안
// A안(현재): "행궁동 단골이라면 이거 하나는 챙기세요" — 단골 정체성
// B안: "놓친 주차 자리, 다음엔 미리 알 수 있어요" — 손실 회피
// C안: "행궁동 진짜 단골만 아는 정보, 카톡으로 먼저 받아요" — 소속감

const COPY = {
  label: "행궁동 단골이라면",
  headline: "이거 하나는 챙기세요",
  sub: "주차 꿀팁 · 이번 주 행궁동 · 단골 정보를 카톡으로",
  cta: "카톡으로 받기",
  url: "https://pf.kakao.com/_placeholder",
};

export function KakaoSubscribeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (DISABLED || dismissed) return null;

  return (
    <div className="mx-4 rounded-xl border border-[#FEE500]/20 bg-[#FEE500]/8 px-4 py-3.5 flex items-center gap-3">
      <div className="shrink-0 w-9 h-9 rounded-full bg-[#FEE500] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.12 1.29 3.99 3.27 5.13L3.75 15l3.17-1.73c.67.12 1.37.18 2.08.18 4.14 0 7.5-2.69 7.5-6s-3.36-6-7.5-6z"
            fill="#3C1E1E"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#FEE500]/70 font-medium mb-0.5">{COPY.label}</p>
        <p className="text-sm font-semibold text-text-primary leading-tight">{COPY.headline}</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-snug">{COPY.sub}</p>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="text-text-muted hover:text-text-secondary transition-colors"
          aria-label="닫기"
        >
          <X size={14} />
        </button>
        <a
          href={COPY.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackKakaoSubscribeClick("banner")}
          className="rounded-lg bg-[#FEE500] px-3 py-1.5 text-xs font-bold text-[#3C1E1E] whitespace-nowrap hover:bg-[#FFD700] transition-colors"
        >
          {COPY.cta}
        </a>
      </div>
    </div>
  );
}
