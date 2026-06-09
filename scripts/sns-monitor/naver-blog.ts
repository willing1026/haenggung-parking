/**
 * 네이버 블로그 "행궁동" 최신순 검색 → TOP 10 추출
 * 실행: npm run intel:naver
 */
import { chromium } from 'playwright';
import { saveRaw, sleep } from './utils.js';

interface BlogPost {
  rank: number;
  title: string;
  url: string;
  author: string;
  date: string;
  excerpt: string;
  thumbnail: string | null;
}

const QUERIES = ['행궁동', '행리단길', '행궁동 주차'];

async function scrapeNaverBlog(query: string): Promise<BlogPost[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR,ko;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const results: BlogPost[] = [];

  try {
    // 최신순 정렬: sort=1
    const url = `https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent(query)}&sm=tab_pge&sort=1`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2500);

    // 실제 블로그 포스트 링크 (clip/ 패턴 포함)
    const postLinks = await page.locator('a[href*="m.blog.naver.com"][href*="/clip/"], a[href*="blog.naver.com/PostView"]').all();

    // clip 링크 없으면 blog.naver.com 포스트 링크 전체에서 수집
    const candidates = postLinks.length > 0
      ? postLinks
      : await page.locator('a[href*="blog.naver.com"]:not([href*="MyBlog"]):not([href*="section.blog"])').all();

    const seen = new Set<string>();
    for (const link of candidates) {
      if (results.length >= 10) break;
      try {
        const href = await link.getAttribute('href') ?? '';
        // blog.naver.com 도메인 포스트 URL만 (계정 홈·섹션 제외)
        if (!href || seen.has(href)) continue;
        if (!href.includes('blog.naver.com') && !href.includes('m.blog.naver.com')) continue;
        if (href.match(/MyBlog|section\.blog|blog\.naver\.com\/[A-Za-z0-9_]+$/)) continue;
        seen.add(href);

        const text = await link.textContent().then(t => t?.trim() ?? '');
        if (!text || text.length < 5) continue;

        // 주변 컨테이너에서 날짜·작성자 탐색
        const container = link.locator('xpath=ancestor::div[contains(@class,"item") or contains(@class,"bx") or contains(@class,"wrap")][1]').first();
        const allText = await container.textContent().then(t => t?.trim() ?? '').catch(() => text);

        // 날짜 패턴 추출 (N일 전, N시간 전, YYYY.MM.DD)
        const dateMatch = allText.match(/(\d{4}\.\d{2}\.\d{2}|\d+일 전|\d+시간 전|\d+분 전)/);
        const date = dateMatch ? dateMatch[1] : '';

        results.push({
          rank: results.length + 1,
          title: text.split('\n')[0].slice(0, 100),
          url: href,
          author: '',
          date,
          excerpt: allText.slice(0, 200),
          thumbnail: null,
        });
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
  const allResults: Record<string, BlogPost[]> = {};

  for (const query of QUERIES) {
    console.log(`[naver-blog] "${query}" 검색 중...`);
    try {
      const posts = await scrapeNaverBlog(query);
      allResults[query] = posts;
      console.log(`[naver-blog] "${query}" → ${posts.length}건 수집`);
      await sleep(3000); // 쿼리 간 간격
    } catch (e) {
      console.error(`[naver-blog] "${query}" 실패:`, e);
      allResults[query] = [];
    }
  }

  saveRaw('naver-blog', { crawledAt: new Date().toISOString(), results: allResults });
  console.log('[naver-blog] 완료');
}

main().catch(console.error);
