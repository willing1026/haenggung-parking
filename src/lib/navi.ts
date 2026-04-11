export function getNaviUrl(lat: number, lng: number, name: string): string {
  const encoded = encodeURIComponent(name);
  return `https://map.kakao.com/link/to/${encoded},${lat},${lng}`;
}
