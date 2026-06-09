/**
 * 주간 브리프 생성기 — 모든 채널 실행 후 Markdown 보고서 작성
 * 실행: npm run intel:weekly
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { INTEL_DIR, today, ensureDir } from './utils.js';

interface RawResult {
  crawledAt: string;
  results: Record<string, unknown[]>;
}

function loadRaw(channel: string): RawResult | null {
  const file = path.join(INTEL_DIR, 'raw', channel, `${today()}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

function runScript(name: string): boolean {
  try {
    console.log(`\n▶ ${name} 실행 중...`);
    execSync(`npx tsx scripts/sns-monitor/${name}.ts`, { stdio: 'inherit', cwd: process.cwd() });
    return true;
  } catch (e) {
    console.error(`✗ ${name} 실패:`, e);
    return false;
  }
}

function countResults(raw: RawResult | null): number {
  if (!raw) return 0;
  return Object.values(raw.results).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
}

function formatNaverBlogSection(raw: RawResult | null): string {
  if (!raw) return '_데이터 없음_\n';
  const lines: string[] = [];
  for (const [query, posts] of Object.entries(raw.results)) {
    lines.push(`\n**"${query}" 검색 결과:**`);
    const arr = posts as Array<{ rank: number; title: string; url: string; author: string; date: string; excerpt: string }>;
    arr.slice(0, 5).forEach(p => {
      lines.push(`${p.rank}. [${p.title}](${p.url}) — ${p.author} | ${p.date}`);
      if (p.excerpt) lines.push(`   > ${p.excerpt.slice(0, 100)}`);
    });
  }
  return lines.join('\n') + '\n';
}

function formatYoutubeSection(raw: RawResult | null): string {
  if (!raw) return '_데이터 없음_\n';
  const lines: string[] = [];
  for (const [query, videos] of Object.entries(raw.results)) {
    lines.push(`\n**"${query}" 검색 결과:**`);
    const arr = videos as Array<{ rank: number; title: string; url: string; channel: string; views: string; uploadedAt: string }>;
    arr.slice(0, 5).forEach(v => {
      lines.push(`${v.rank}. [${v.title}](${v.url})`);
      lines.push(`   채널: ${v.channel} | ${v.views} | ${v.uploadedAt}`);
    });
  }
  return lines.join('\n') + '\n';
}

function formatMapSection(channel: string, raw: RawResult | null): string {
  if (!raw) return '_데이터 없음_\n';
  const lines: string[] = [];
  for (const [query, places] of Object.entries(raw.results)) {
    lines.push(`\n**"${query}":**`);
    const arr = places as Array<{ rank: number; name: string; category: string; rating: string; reviewCount: string }>;
    arr.slice(0, 5).forEach(p => {
      lines.push(`${p.rank}. ${p.name} (${p.category}) — ★${p.rating} 리뷰 ${p.reviewCount}`);
    });
  }
  return lines.join('\n') + '\n';
}

async function main() {
  const date = today();
  console.log(`\n=== 행궁동 주간 인텔리전스 브리프 (${date}) ===\n`);

  // P0 채널 실행
  const results = {
    naverBlog: runScript('naver-blog'),
    kakakoMap: runScript('kakao-map'),
    naverMap: runScript('naver-map'),
    youtube: runScript('youtube'),
    instagram: runScript('instagram'), // 로그인 없으면 자동 skip
  };

  // 데이터 로드
  const naverBlogData = loadRaw('naver-blog');
  const kakaoMapData = loadRaw('kakao-map');
  const naverMapData = loadRaw('naver-map');
  const youtubeData = loadRaw('youtube');
  const instaData = loadRaw('instagram');

  const totalCount =
    countResults(naverBlogData) +
    countResults(kakaoMapData) +
    countResults(naverMapData) +
    countResults(youtubeData) +
    countResults(instaData);

  // Markdown 브리프 생성
  const brief = `# 행궁동 주간 인텔리전스 브리프 — ${date}

생성: 부족 인텔리전스 에이전트 | 총 수집: ${totalCount}건

---

## 실행 결과 요약

| 채널 | 상태 | 수집 건수 |
|------|------|---------|
| 네이버 블로그 | ${results.naverBlog ? '✓' : '✗'} | ${countResults(naverBlogData)}건 |
| 카카오맵 | ${results.kakakoMap ? '✓' : '✗'} | ${countResults(kakaoMapData)}건 |
| 네이버지도 | ${results.naverMap ? '✓' : '✗'} | ${countResults(naverMapData)}건 |
| 유튜브 | ${results.youtube ? '✓' : '✗'} | ${countResults(youtubeData)}건 |
| 인스타그램 | ${instaData ? '✓' : '⚠ 로그인 필요'} | ${countResults(instaData)}건 |

---

## 네이버 블로그 — 최신순 TOP 10

${formatNaverBlogSection(naverBlogData)}

---

## 유튜브 — 최신 vlog

${formatYoutubeSection(youtubeData)}

---

## 카카오맵 — 장소 리스트

${formatMapSection('kakao-map', kakaoMapData)}

---

## 네이버지도 — 장소 리스트

${formatMapSection('naver-map', naverMapData)}

---

## 큐레이션 3건 (수동 선별 필요)

> 아래 항목은 부족 인텔리전스 에이전트가 위 데이터를 검토 후 수동으로 채워야 합니다.

1. **[주차/실용 정보 유형]**
   - 제목:
   - URL:
   - 공유 이유:

2. **[오픈/폐업 실시간 유형]**
   - 제목:
   - URL:
   - 공유 이유:

3. **[숨은 장소/발견 유형]**
   - 제목:
   - URL:
   - 공유 이유:

---

## 부족 세계관 업데이트 (변경 사항)

> 이번 주 새로 관찰된 키워드·서사·패턴:

- (없음)

---

## content 에이전트 전달 메모

> 이번 주 씨앗 콘텐츠 소재 추천:

- (큐레이션 3건 선별 후 작성)

---

원시 데이터 위치: intel/raw/{channel}/${date}.json
`;

  ensureDir(INTEL_DIR);
  const briefPath = path.join(INTEL_DIR, `${date}-weekly-brief.md`);
  fs.writeFileSync(briefPath, brief, 'utf-8');
  console.log(`\n✓ 주간 브리프 생성 완료: ${briefPath}`);
}

main().catch(console.error);
