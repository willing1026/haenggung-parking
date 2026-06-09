declare function gtag(...args: unknown[]): void;

// 부족 건강 지표 이벤트 스킴
// 카카오 채널 구독 퍼널: 클릭(사이트) → 채널 친구 추가(카카오) → 재방문
// GA에서는 클릭까지만 직접 측정 가능. 실제 친구 추가는 카카오 채널 관리자 콘솔에서 확인.

export function trackKakaoSubscribeClick(location: "blog_bottom" | "banner" | "contact") {
  if (typeof gtag === "undefined") return;
  gtag("event", "kakao_subscribe_click", {
    event_category: "permission_ladder",
    event_label: location,
  });
}

export function trackShare(method: "kakaotalk" | "link_copy" | "other", contentSlug: string) {
  if (typeof gtag === "undefined") return;
  gtag("event", "share", {
    method,
    content_type: "article",
    content_id: contentSlug,
    event_category: "tribe_health",
  });
}

export function trackReport(source: "blog_bottom" | "contact_page") {
  if (typeof gtag === "undefined") return;
  gtag("event", "report_click", {
    event_category: "tribe_engagement",
    event_label: source,
  });
}
