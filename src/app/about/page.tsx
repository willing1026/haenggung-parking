import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description: "행궁동 주차 때문에 답답해서 만든 사이트. 행궁동을 자주 찾는 사람들을 위한 실용 가이드.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 space-y-10 text-text-primary">
      <div className="space-y-4">
        <p className="text-xs font-medium tracking-wider text-blue-400/70 uppercase">About</p>
        <h1 className="text-2xl font-bold leading-tight">
          행궁동 주차 때문에<br />답답해서 만들었어요.
        </h1>
      </div>

      <div className="space-y-4 text-text-secondary leading-relaxed">
        <p>
          주말에 행궁동 갔다가 주차장 만차 보고 20분 동안 골목 빙빙 돌았어요.
          폰으로 검색해도 실시간 정보가 없고, 각 주차장 앱은 따로따로고.
          그냥 답답해서 집에 와서 만들기 시작했습니다.
        </p>
        <p>
          처음엔 주차 현황 하나만 보여주는 대시보드였는데,
          행궁동을 자주 가다 보니까 주차 말고도 알면 좋은 것들이 너무 많더라고요.
          이번 주 팝업이 어딘지, 어느 카페가 요즘 뜨는지, 사진 찍기 좋은 스팟은 어딘지.
        </p>
        <p>
          그래서 방향을 바꿨어요. 주차 유틸리티가 아니라,
          <strong className="text-text-primary"> 행궁동 가기 전에 한 번 들르는 곳</strong>으로.
        </p>
      </div>

      <div className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary">이 사이트가 도움이 되는 사람</h2>
        <ul className="space-y-2 text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            행궁동을 자주 찾는 단골 — 매번 새로운 걸 발견하고 싶은 분
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            주말 나들이 전에 주차 미리 확인하고 싶은 분
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            행궁동이 처음인데 제대로 즐기고 싶은 분
          </li>
        </ul>
      </div>

      <div className="space-y-4 text-text-secondary leading-relaxed">
        <h2 className="font-semibold text-text-primary text-lg">지금 제공하는 것</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            행궁동 공영주차장 실시간 잔여 현황 (30초 갱신)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            내 위치 기준 가까운 주차장 순으로 정렬
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">→</span>
            행궁동 로컬 가이드 블로그 (업데이트 중)
          </li>
        </ul>
      </div>

      <div className="pt-4 flex gap-4 text-sm">
        <Link href="/" className="text-blue-400 hover:underline">
          주차 현황 보기 →
        </Link>
        <Link href="/blog" className="text-blue-400 hover:underline">
          가이드 블로그 →
        </Link>
        <Link href="/contact" className="text-blue-400 hover:underline">
          문의하기 →
        </Link>
      </div>
    </main>
  );
}
