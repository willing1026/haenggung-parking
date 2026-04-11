export function getNaviUrl(lat: number, lng: number, name: string): string {
  const encoded = encodeURIComponent(name);
  // 카카오맵 우선 (한국 시장 표준)
  // 모바일: 앱 실행, 미설치 시 웹 폴백
  return `https://map.kakao.com/link/to/${encoded},${lat},${lng}`;
}
