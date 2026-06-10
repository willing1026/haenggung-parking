/**
 * 새 콘텐츠 발행 후 Google/Naver에 sitemap ping 전송
 * 사용: npx tsx scripts/ping-sitemap.ts
 *
 * Google Indexing API는 뉴스/구인 사이트 전용이므로 sitemap ping 방식 사용.
 * Google은 Ping API를 공식 지원하지 않지만 Search Console이 sitemap 제출
 * 이후 자동 크롤링하므로, Naver ping + 로그 출력으로 운영.
 */

const SITE_URL = "https://haenggung-parking.vercel.app";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

const PING_TARGETS = [
  {
    name: "Naver",
    url: `https://searchadvisor.naver.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  },
];

async function pingSitemap() {
  console.log(`[sitemap-ping] 대상: ${SITEMAP_URL}`);
  console.log(`[sitemap-ping] 시각: ${new Date().toISOString()}`);
  console.log("");

  for (const target of PING_TARGETS) {
    try {
      const res = await fetch(target.url, { method: "GET" });
      console.log(`[${target.name}] 상태: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`[${target.name}] 실패:`, err);
    }
  }

  console.log("");
  console.log("[Google] Search Console에 sitemap 제출 완료 상태 확인:");
  console.log(`  → https://search.google.com/search-console (Sitemaps 메뉴)`);
  console.log("[완료] Search Console 인증 후 자동 크롤링 스케줄에 진입됩니다.");
}

pingSitemap().catch(console.error);
