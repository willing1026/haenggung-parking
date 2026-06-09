# 로그인 필요 채널 인증 가이드

## 인스타그램 1회 수동 로그인

인스타그램은 로그인 없이는 해시태그 탐색이 막혀 있습니다.
아래 단계로 1회만 수동 로그인하면, 이후 자동화 스크립트가 저장된 세션을 재사용합니다.

### 단계

1. 터미널에서 실행:
```bash
npx tsx scripts/sns-monitor/instagram-login.ts
```

2. Chromium 브라우저 창이 열립니다.

3. 인스타그램에 직접 로그인합니다 (이메일/비밀번호 또는 계정 선택).

4. 로그인 완료 후 터미널에서 Enter를 누릅니다.

5. 세션이 `intel/auth/instagram.json`에 저장됩니다.

6. 이후 `npm run intel:instagram` 실행 시 자동으로 세션을 사용합니다.

### 주의사항

- `intel/auth/instagram.json`은 `.gitignore`에 추가되어 있어 커밋되지 않습니다.
- 세션이 만료되면 (보통 수개월) 재로그인이 필요합니다.
- 개인 계정 사용 권장. 스크래핑 과도 시 일시 제한될 수 있음.

---

## instagram-login.ts 실행 스크립트

아래 파일을 별도로 만들어 실행합니다:

```bash
cat > scripts/sns-monitor/instagram-login.ts << 'EOF'
import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

const AUTH_FILE = path.resolve('intel/auth/instagram.json');
fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://www.instagram.com/accounts/login/');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await new Promise<void>(resolve => {
  rl.question('로그인 완료 후 Enter를 누르세요...', () => { rl.close(); resolve(); });
});

await context.storageState({ path: AUTH_FILE });
await browser.close();
console.log('세션 저장 완료:', AUTH_FILE);
EOF
npx tsx scripts/sns-monitor/instagram-login.ts
```

---

## 당근마켓 (향후 추가 예정)

당근마켓 동네생활은 위치 기반으로 로그인 필요합니다.
Month 2에 추가 예정. 현재는 수동 모니터링으로 대체.

확인 방법: 당근마켓 앱 → 동네생활 → 팔달구/행궁동 설정 후 직접 탐색.
