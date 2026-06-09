/**
 * 네이버지도 "행궁동" 검색 → 장소·리뷰 추출
 * 실행: npm run intel:naver-map
 */
import { chromium } from 'playwright';
import { saveRaw, sleep } from './utils.js';

interface NaverPlace {
  rank: number;
  name: string;
  category: string;
  address: string;
  rating: string;
  reviewCount: string;
  recentReview: string;
}

async function scrapeNaverMap(query: string): Promise<NaverPlace[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR,ko;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const results: NaverPlace[] = [];

  try {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(4000);

    // 검색결과 iframe이 있을 수 있음
    const frame = page.frame({ name: 'searchIframe' }) ?? page;

    const items = await frame.locator('li.UEzoS, li[class*="item"]').all();

    for (let i = 0; i < Math.min(items.length, 15); i++) {
      const item = items[i];
      try {
        const nameEl = item.locator('span.YwYLL, .place_bluelink, span[class*="name"]').first();
        const name = await nameEl.textContent().then(t => t?.trim() ?? '');

        const categoryEl = item.locator('span.KCMnt, span[class*="category"]').first();
        const category = await categoryEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const addressEl = item.locator('span.LDgIH, span[class*="address"]').first();
        const address = await addressEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const ratingEl = item.locator('span.h69bs, span[class*="rating"]').first();
        const rating = await ratingEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const reviewEl = item.locator('span.MVx6e, span[class*="review"]').first();
        const reviewCount = await reviewEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const recentReviewEl = item.locator('div[class*="reviewText"], p[class*="review"]').first();
        const recentReview = await recentReviewEl.textContent().then(t => t?.trim().slice(0, 100) ?? '').catch(() => '');

        if (name) {
          results.push({ rank: i + 1, name, category, address, rating, reviewCount, recentReview });
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
  const queries = ['행궁동 카페', '행리단길 맛집', '행궁동 주차장'];
  const allResults: Record<string, NaverPlace[]> = {};

  for (const query of queries) {
    console.log(`[naver-map] "${query}" 검색 중...`);
    try {
      const places = await scrapeNaverMap(query);
      allResults[query] = places;
      console.log(`[naver-map] "${query}" → ${places.length}건 수집`);
      await sleep(3000);
    } catch (e) {
      console.error(`[naver-map] "${query}" 실패:`, e);
      allResults[query] = [];
    }
  }

  saveRaw('naver-map', { crawledAt: new Date().toISOString(), results: allResults });
  console.log('[naver-map] 완료');
}

main().catch(console.error);
