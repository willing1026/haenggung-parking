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

// ── 정적 전용 주차장 (실시간 데이터 없음, 요금·주소만 제공) ──

const STATIC_ONLY_LOTS: ParkingLot[] = [
  {
    id: "static-sinpung",
    name: "신풍동 공영주차장",
    total: 0, occupied: 0, available: 0,
    status: "normal",
    address: "경기도 수원시 팔달구 신풍로 51",
    lat: 37.2795, lng: 127.0130,
    feeBase: "최초 60분 무료",
    feeAdditional: "초과 10분당 300원",
    feeMaxDaily: "1일 최대 7,000원",
    feeInfo: null, hours: null,
    updatedAt: "",
  },
  {
    id: "static-yeonmudae",
    name: "연무대 공영주차장",
    total: 122, occupied: 0, available: 0,
    status: "normal",
    address: "경기도 수원시 팔달구 매향동 3-17",
    lat: 37.2878, lng: 127.0212,
    feeBase: "최초 30분 900원",
    feeAdditional: "10분당 400원",
    feeMaxDaily: "1일 14,000원",
    feeInfo: "122면 (일반 97, 대형 17, 장애인 6)", hours: null,
    updatedAt: "",
  },
  {
    id: "static-namchang",
    name: "남창동 임시주차장",
    total: 0, occupied: 0, available: 0,
    status: "normal",
    address: "경기도 수원시 팔달구 행궁로 18",
    lat: 37.2808, lng: 127.0155,
    feeBase: "최초 30분 900원",
    feeAdditional: "10분당 400원",
    feeMaxDaily: "1일 14,000원",
    feeInfo: null, hours: null,
    updatedAt: "",
  },
  {
    id: "static-paldal-tower",
    name: "팔달주차타워",
    total: 0, occupied: 0, available: 0,
    status: "normal",
    address: "경기도 수원시 팔달구 수원천로 254",
    lat: 37.2755, lng: 127.0170,
    feeBase: "최초 30분 무료",
    feeAdditional: "초과 10분당 200원",
    feeMaxDaily: null,
    feeInfo: "시장 이용 시 1시간 주차쿠폰 제공", hours: null,
    updatedAt: "",
  },
  {
    id: "static-art-museum",
    name: "수원시립미술관 주차장",
    total: 0, occupied: 0, available: 0,
    status: "normal",
    address: "경기도 수원시 팔달구 정조로 833",
    lat: 37.2833, lng: 127.0168,
    feeBase: "최초 30분 1,000원",
    feeAdditional: "10분당 1,500원",
    feeMaxDaily: "1일 30,000원",
    feeInfo: "미술관 관람 시 2시간 무료", hours: null,
    updatedAt: "",
  },
];

const HAENGGUNG_PARKING_IDS = new Set(Object.keys(HAENGGUNG_PARKING_INFO));

export function filterHaenggungArea(lots: ParkingLot[]): ParkingLot[] {
  // 실시간 데이터가 있는 주차장
  const realtime = lots
    .filter((lot) => HAENGGUNG_PARKING_IDS.has(lot.id))
    .map((lot) => {
      const info = HAENGGUNG_PARKING_INFO[lot.id];
      return info ? { ...lot, ...info } : lot;
    });

  // 정적 전용 주차장 추가
  return [...realtime, ...STATIC_ONLY_LOTS];
}
