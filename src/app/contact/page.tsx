import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의",
  description: "행궁동 지금 — 오류 신고, 제보, 광고 문의",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 space-y-8 text-text-primary">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wider text-blue-400/70 uppercase">Contact</p>
        <h1 className="text-2xl font-bold">문의</h1>
      </div>

      <div className="space-y-6">
        <ContactCard
          title="🐛 오류 신고"
          description="주차 데이터가 이상하거나 사이트가 안 되면 알려주세요."
          email="willing1026@gmail.com"
          subject="[오류 신고]"
        />
        <ContactCard
          title="📍 정보 제보"
          description="행궁동 관련 유용한 정보, 새로 오픈한 가게, 주차 꿀팁 등 알려주세요."
          email="willing1026@gmail.com"
          subject="[제보]"
        />
        <ContactCard
          title="📢 광고 / 협업 문의"
          description="지역 업체 소개, 협업 제안은 아래 메일로 연락 주세요."
          email="willing1026@gmail.com"
          subject="[광고/협업]"
        />
      </div>

      <p className="text-text-muted text-sm">
        보통 1~2일 내 회신합니다.
      </p>
    </main>
  );
}

function ContactCard({
  title,
  description,
  email,
  subject,
}: {
  title: string;
  description: string;
  email: string;
  subject: string;
}) {
  return (
    <div className="border border-border rounded-xl p-5 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(subject + " ")}`}
        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:underline"
      >
        {email} →
      </a>
    </div>
  );
}
