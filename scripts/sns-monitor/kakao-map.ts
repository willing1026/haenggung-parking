/**
 * 카카오맵 "행궁동" 장소 검색 → 신규 리뷰·평점·매장 리스트 추출
 * 실행: npm run intel:kakao
 */
import { chromium } from 'playwright';
import { saveRaw, sleep } from './utils.js';

interface KakaoPlace {
  rank: number;
  name: string;
  category: string;
  address: string;
  rating: string;
  reviewCount: string;
  url: string;
}

async function scrapeKakaoMap(query: string): Promise<KakaoPlace[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR,ko;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const results: KakaoPlace[] = [];

  try {
    const url = `https://map.kakao.com/?q=${encodeURIComponent(query)}`;
    // 카카오맵은 headless 환경에서 봇 탐지가 강함. 결과가 0이면 정상.
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await sleep(4000);

    // 장소 탭 클릭 (있으면)
    const placeTab = page.locator('#info\\.main\\.options > li:nth-child(1) a, a:has-text("장소")').first();
    if (await placeTab.isVisible().catch(() => false)) {
      await placeTab.click();
      await sleep(2000);
    }

    const items = await page.locator('#info\\.search\\.place\\.list > li, ul.placelist > li').all();

    for (let i = 0; i < Math.min(items.length, 15); i++) {
      const item = items[i];
      try {
        const nameEl = item.locator('.link_name, a.tit_name').first();
        const name = await nameEl.textContent().then(t => t?.trim() ?? '');
        const href = await nameEl.getAttribute('href') ?? '';

        const categoryEl = item.locator('.cate_g, span.ico_cate').first();
        const category = await categoryEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const addressEl = item.locator('.addr, p.addr').first();
        const address = await addressEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const ratingEl = item.locator('.rating, em.num_rate').first();
        const rating = await ratingEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const reviewEl = item.locator('.count_review, span.num_review').first();
        const reviewCount = await reviewEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        if (name) {
          results.push({ rank: i + 1, name, category, address, rating, reviewCount, url: href });
        }
      } catch {
        // skip
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function main() {
  const queries = ['행궁동 카페', '행리단길', '행궁동 맛집', '행궁동 주차'];
  const allResults: Record<string, KakaoPlace[]> = {};

  for (const query of queries) {
    console.log(`[kakao-map] "${query}" 검색 중...`);
    try {
      const places = await scrapeKakaoMap(query);
      allResults[query] = places;
      console.log(`[kakao-map] "${query}" → ${places.length}건 수집`);
      await sleep(3000);
    } catch (e) {
      console.error(`[kakao-map] "${query}" 실패:`, e);
      allResults[query] = [];
    }
  }

  saveRaw('kakao-map', { crawledAt: new Date().toISOString(), results: allResults });
  console.log('[kakao-map] 완료');
}

main().catch(console.error);
