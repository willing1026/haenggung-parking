import type { ParkingLot } from "@/types/parking";
import { calculateStatus } from "./status";

// ── 수원도시공사 메인 페이지에서 주차장 JSON 추출 ──

interface SuwonRawLot {
  PARKING_ID: number;
  PARKING_NM: string;
  CELL_CNT: number;
  CURRENT_CNT: number; // 잔여 면수
  USE_CNT: number;
  LAT: string;
  LNG: string;
  CONGESTION_LEVEL: string;
  PARKING_DIV_NM?: string;
  FAST_CHARGING_CELL_CNT?: number;
  SLOW_CHARGING_CELL_CNT?: number;
  OPEN_YN?: string;
}

export async function fetchSuwonParking(): Promise<ParkingLot[]> {
  const res = await fetch("https://parking.suwonudc.co.kr", {
    signal: AbortSignal.timeout(10000),
    headers: {
      "User-Agent": "HaenggungParking/1.0",
    },
  });
  if (!res.ok) throw new Error(`Suwon page: ${res.status}`);

  const html = await res.text();

  // parkingList = JSON.parse('[{...}]') 패턴에서 JSON 추출
  const match = html.match(/parkingList\s*=\s*JSON\.parse\('(.+?)'\)/);
  if (!match) throw new Error("parkingList JSON not found in page");

  // 이스케이프된 문자열 복원
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
  const rawLots: SuwonRawLot[] = JSON.parse(jsonStr);

  console.log(`[수원] ${rawLots.length}개 주차장 파싱 완료`);

  return rawLots
    .filter((lot) => lot.OPEN_YN !== "N") // 운영 중인 것만
    .map((lot) => {
      const total = lot.CELL_CNT;
      const available = lot.CURRENT_CNT;
      const occupied = lot.USE_CNT;

      return {
        id: String(lot.PARKING_ID),
        name: lot.PARKING_NM,
        total,
        occupied,
        available,
        status: calculateStatus(available, total),
        address: null, // 페이지에 주소 없음, 좌표로 대체
        lat: parseFloat(lot.LAT) || null,
        lng: parseFloat(lot.LNG) || null,
        feeInfo: null,
        feeBase: null,
        feeAdditional: null,
        feeMaxDaily: null,
        hours: null,
        updatedAt: new Date().toISOString(),
      };
    });
}

// ── 행궁동 주변 주차장 정적 정보 (요금·운영시간) ──

const HAENGGUNG_PARKING_INFO: Record<string, {
  address: string;
  feeBase: string;
  feeAdditional: string;
  feeMaxDaily: string;
  feeInfo: string | null;
}> = {
  "24800": { // 화홍문 공영
    address: "경기도 수원시 장안구 팔달로 280",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "27000": { // 연무동 공영
    address: "경기도 수원시 장안구 경수대로743번길 57",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "26600": { // 장안동 공영
    address: "경기 수원시 팔달구 장안동 52-1",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 500원",
    feeMaxDaily: "1일 최대 10,000원",
    feeInfo: null,
  },
  "31000": { // 선경도서관
    address: "경기도 수원시 팔달구 신풍로23번길 68",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "32200": { // 화성박물관(팔달구청)
    address: "경기도 수원시 팔달구 창룡대로 23",
    feeBase: "최초 30분 900원",
    feeAdditional: "10분당 400원",
    feeMaxDaily: "1일 14,000원",
    feeInfo: null,
  },
  "31800": { // 남수동 공영
    address: "경기 수원시 팔달구 창룡대로26번길 19",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "20200": { // 교동 공영
    address: "경기도 수원시 팔달구 향교로 140",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "22200": { // 영화동 지하
    address: "경기 수원시 장안구 수성로382번길 30",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
  "22201": { // 영화동 지상
    address: "경기 수원시 장안구 수성로382번길 30",
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null,
  },
};

const HAENGGUNG_PARKING_IDS = new Set(Object.keys(HAENGGUNG_PARKING_INFO));

export function filterHaenggungArea(lots: ParkingLot[]): ParkingLot[] {
  return lots
    .filter((lot) => HAENGGUNG_PARKING_IDS.has(lot.id))
    .map((lot) => {
      const info = HAENGGUNG_PARKING_INFO[lot.id];
      return info ? { ...lot, ...info } : lot;
    });
}
