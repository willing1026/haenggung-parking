# 행궁동 SNS 모니터링 시스템

부족 인텔리전스 에이전트용 자동화 모니터링 스크립트.

## 실행 방법

### 주간 브리프 (전체 채널 한 번에)
```bash
npm run intel:weekly
```

### 채널별 개별 실행
```bash
npm run intel:naver      # 네이버 블로그
npm run intel:kakao      # 카카오맵
npm run intel:naver-map  # 네이버지도
npm run intel:youtube    # 유튜브
npm run intel:instagram  # 인스타그램 (로그인 필요)
```

## 채널 리스트

| 스크립트 | 채널 | 로그인 | 키워드 |
|---------|------|--------|--------|
| `naver-blog.ts` | 네이버 블로그 | 불필요 | 행궁동, 행리단길 |
| `kakao-map.ts` | 카카오맵 | 불필요 | 행궁동 카페/맛집/주차 |
| `naver-map.ts` | 네이버지도 | 불필요 | 행궁동 카페/맛집/주차장 |
| `youtube.ts` | 유튜브 | 불필요 | 행궁동 vlog, 행리단길 |
| `instagram.ts` | 인스타그램 | **필요** | #행궁동 #행리단길 #수원행궁동 |

## 출력 위치

```
intel/
├── raw/
│   ├── naver-blog/   YYYY-MM-DD.json
│   ├── kakao-map/    YYYY-MM-DD.json
│   ├── naver-map/    YYYY-MM-DD.json
│   ├── youtube/      YYYY-MM-DD.json
│   └── instagram/    YYYY-MM-DD.json
├── auth/
│   └── instagram.json  ← 로그인 세션 (gitignore)
└── YYYY-MM-DD-weekly-brief.md
```

## 인스타그램 로그인

처음 한 번만 수동 로그인 필요합니다. `AUTH-GUIDE.md` 참고.

## 주간 실행 루틴

- **매주 월요일 오전**: `npm run intel:weekly` 실행
- 브리프 파일에서 큐레이션 3건 수동 선별
- content 에이전트에 전달

## 초기 설정 (최초 1회)

```bash
# 브라우저 바이너리 설치
npx playwright install chromium

# 인스타그램 로그인 (선택)
# AUTH-GUIDE.md 참고
```
