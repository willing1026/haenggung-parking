import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 space-y-8 text-text-primary">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="text-text-secondary text-sm">최종 업데이트: 2026-06-06</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. 수집하는 개인정보 항목</h2>
        <p className="text-text-secondary leading-relaxed">
          행궁동 지금(이하 "서비스")은 서비스 개선 목적으로 아래 정보를 자동 수집합니다.
        </p>
        <ul className="list-disc list-inside text-text-secondary space-y-1 pl-2">
          <li>방문 페이지 URL, 유입 경로(referrer)</li>
          <li>브라우저 종류 및 기기 유형</li>
          <li>국가/지역 (IP 기반, 비식별화)</li>
          <li>위치 정보 (주차장 거리 계산용, 서버에 저장하지 않음)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. 수집 목적 및 이용</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1 pl-2">
          <li>서비스 이용 현황 분석 및 개선</li>
          <li>오류 감지 및 성능 최적화</li>
          <li>맞춤형 광고 제공 (Google AdSense, 적용 예정)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. 제3자 서비스 위탁</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-secondary border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-text-primary">서비스</th>
                <th className="text-left py-2 pr-4 font-medium text-text-primary">목적</th>
                <th className="text-left py-2 font-medium text-text-primary">처리방침</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Google Analytics 4</td>
                <td className="py-2 pr-4">방문 통계 분석</td>
                <td className="py-2">
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">보기</a>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Vercel Analytics</td>
                <td className="py-2 pr-4">성능 측정</td>
                <td className="py-2">
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">보기</a>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Google AdSense</td>
                <td className="py-2 pr-4">광고 제공 (적용 예정)</td>
                <td className="py-2">
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">보기</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. 쿠키 사용</h2>
        <p className="text-text-secondary leading-relaxed">
          Google Analytics 및 Google AdSense는 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 비활성화할 수 있으나,
          일부 서비스 기능이 제한될 수 있습니다. Google의 광고 쿠키 설정은{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            광고 설정 페이지
          </a>
          에서 변경할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. 보유 및 이용 기간</h2>
        <p className="text-text-secondary leading-relaxed">
          수집된 정보는 서비스 운영 기간 동안 보유하며, 서비스 종료 시 즉시 파기합니다.
          Google Analytics 데이터는 Google 정책에 따라 최대 14개월 보유됩니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. 이용자 권리</h2>
        <p className="text-text-secondary leading-relaxed">
          이용자는 언제든지 개인정보 처리 정지, 삭제를 요청할 수 있습니다.
          문의는 아래 이메일로 연락 주세요.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. 문의</h2>
        <p className="text-text-secondary">
          이메일:{" "}
          <a href="mailto:willing1026@gmail.com" className="text-blue-400 underline">
            willing1026@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
