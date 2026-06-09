/**
 * 유튜브 "행궁동 vlog" 최신 검색 결과 추출
 * 실행: npm run intel:youtube
 */
import { chromium } from 'playwright';
import { saveRaw, sleep } from './utils.js';

interface YoutubeVideo {
  rank: number;
  title: string;
  url: string;
  channel: string;
  views: string;
  uploadedAt: string;
  thumbnail: string | null;
}

const QUERIES = ['행궁동 vlog', '행리단길', '행궁동 카페'];

async function scrapeYoutube(query: string): Promise<YoutubeVideo[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR,ko;q=0.9',
  });

  const results: YoutubeVideo[] = [];

  try {
    // 업로드 날짜순 정렬: sp=CAI%253D
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAI%253D`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(3000);

    const items = await page.locator('ytd-video-renderer').all();

    for (let i = 0; i < Math.min(items.length, 10); i++) {
      const item = items[i];
      try {
        const titleEl = item.locator('#video-title').first();
        const title = await titleEl.textContent().then(t => t?.trim() ?? '');
        const href = await titleEl.getAttribute('href') ?? '';
        const url = href ? `https://www.youtube.com${href}` : '';

        const channelEl = item.locator('#channel-name a, ytd-channel-name a').first();
        const channel = await channelEl.textContent().then(t => t?.trim() ?? '').catch(() => '');

        const metaItems = await item.locator('#metadata-line span.inline-metadata-item').allTextContents();
        const views = metaItems[0]?.trim() ?? '';
        const uploadedAt = metaItems[1]?.trim() ?? '';

        const thumbEl = item.locator('img#img').first();
        const thumbnail = await thumbEl.getAttribute('src').catch(() => null);

        if (title && url) {
          results.push({ rank: i + 1, title, url, channel, views, uploadedAt, thumbnail });
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
  const allResults: Record<string, YoutubeVideo[]> = {};

  for (const query of QUERIES) {
    console.log(`[youtube] "${query}" 검색 중...`);
    try {
      const videos = await scrapeYoutube(query);
      allResults[query] = videos;
      console.log(`[youtube] "${query}" → ${videos.length}건 수집`);
      await sleep(4000);
    } catch (e) {
      console.error(`[youtube] "${query}" 실패:`, e);
      allResults[query] = [];
    }
  }

  saveRaw('youtube', { crawledAt: new Date().toISOString(), results: allResults });
  console.log('[youtube] 완료');
}

main().catch(console.error);
