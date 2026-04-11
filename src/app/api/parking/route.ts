import { NextResponse } from "next/server";
import { fetchSuwonParking, filterHaenggungArea } from "@/lib/parking-api";

export const revalidate = 30;

export async function GET() {
  try {
    const allLots = await fetchSuwonParking();
    const lots = filterHaenggungArea(allLots);

    console.log(`[API] 전체 ${allLots.length}개 → 행궁동 ${lots.length}개`);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      lots,
    });
  } catch (e) {
    console.error("[API]", e);
    return NextResponse.json(
      { timestamp: new Date().toISOString(), lots: [] },
      { status: 500 },
    );
  }
}
