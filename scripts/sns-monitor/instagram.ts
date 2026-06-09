/**
 * 인스타그램 #행궁동 #행리단길 해시태그 최신 포스트 추출
 *
 * ⚠️  로그인 필요: AUTH-GUIDE.md 참고하여 1회 수동 로그인 후 실행
 * 실행: npm run intel:instagram
 */
import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { saveRaw, sleep, INTEL_DIR } from './utils.js';

interface InstaPost {
  rank: number;
  url: string;
  thumbnail: string | null;
  altText: string;
  hashtags: string[];
}

const AUTH_FILE = path.join(INTEL_DIR, 'auth', 'instagram.json');

function hasAuthFile(): boolean {
  return fs.existsSync(AUTH_FILE);
}

async function scrapeInstagram(hashtag: string): Promise<InstaPost[]> {
  if (!hasAuthFile()) {
    console.warn(`[instagram] 로그인 파일 없음. AUTH-GUIDE.md 참고하여 먼저 로그인하세요.`);
    console.warn(`[instagram] 예상 경로: ${AUTH_FILE}`);
    return [];
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: AUTH_FILE,
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const results: InstaPost[] = [];

  try {
    const url = `https://www.instagram.com/explore/tags/${encodeURIComponent(hashtag)}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await sleep(3000);

    // 최근 게시물 섹션으로 스크롤
    await page.evaluate(() => window.scrollBy(0, 400));
    await sleep(2000);

    const posts = await page.locator('article a[href*="/p/"]').all();

    for (let i = 0; i < Math.min(posts.length, 12); i++) {
      const post = posts[i];
      try {
        const href = await post.getAttribute('href') ?? '';
        const url = `https://www.instagram.com${href}`;

        const img = post.locator('img').first();
        const thumbnail = await img.getAttribute('src').catch(() => null);
        const altText = await img.getAttribute('alt').then(t => t?.trim() ?? '').catch(() => '');

        // alt 텍스트에서 해시태그 추출
        const hashtags = (altText.match(/#[^\s#]+/g) ?? []);

        results.push({ rank: i + 1, url, thumbnail, altText: altText.slice(0, 200), hashtags });
      } catch {
        // skip
      }

      // 너무 빠른 스크롤 방지
      if (i % 4 === 3) {
        await page.evaluate(() => window.scrollBy(0, 600));
        await sleep(1500);
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function main() {
  const hashtags = ['행궁동', '행리단길', '수원행궁동', '행궁동카페'];
  const allResults: Record<string, InstaPost[]> = {};

  for (const tag of hashtags) {
    console.log(`[instagram] #${tag} 수집 중...`);
    try {
      const posts = await scrapeInstagram(tag);
      allResults[tag] = posts;
      console.log(`[instagram] #${tag} → ${posts.length}건 수집`);
      await sleep(5000); // 인스타 봇 탐지 방지
    } catch (e) {
      console.error(`[instagram] #${tag} 실패:`, e);
      allResults[tag] = [];
    }
  }

  saveRaw('instagram', { crawledAt: new Date().toISOString(), results: allResults });
  console.log('[instagram] 완료');
}

main().catch(console.error);
