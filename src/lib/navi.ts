export type NaviApp = "naver" | "kakao";

export function getNaviUrl(lat: number, lng: number, name: string, app: NaviApp = "naver"): string {
  const encoded = encodeURIComponent(name);

  if (app === "naver") {
    // 네이버지도: 모바일 앱 설치 시 앱 실행, 미설치 시 웹
    return `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encoded}&appname=haenggung-parking`;
  }

  // 카카오맵
  return `https://map.kakao.com/link/to/${encoded},${lat},${lng}`;
}

export function getNaviFallbackUrl(lat: number, lng: number, name: string): string {
  const encoded = encodeURIComponent(name);
  // 네이버지도 웹: /p/directions 경로 + 좌표,이름 형식으로 도착지 세팅
  return `https://map.naver.com/p/directions/-/${lng},${lat},${encoded}/-/car`;
}
