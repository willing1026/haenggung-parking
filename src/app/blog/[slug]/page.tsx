import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostMetas, getPost } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostMetas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 space-y-6">
      {/* 뒤로가기 */}
      <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
        ← 가이드 목록
      </Link>

      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-text-primary leading-tight">{post.title}</h1>
        <p className="text-text-secondary leading-relaxed">{post.description}</p>
        <p className="text-xs text-text-muted">{post.date}</p>
      </div>

      <div className="border-t border-border" />

      {/* 본문 */}
      <div
        className="prose-haenggung text-text-secondary leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* 제보 유도 */}
      <div className="mt-10 border border-blue-500/20 rounded-xl p-5 bg-blue-500/5 space-y-2">
        <p className="text-sm font-medium text-text-primary">오늘 행궁동 어땠어요?</p>
        <p className="text-sm text-text-secondary">주차 상황, 새로 생긴 가게, 숨겨진 스팟 뭐든 알려주세요.</p>
        <Link href="/contact" className="inline-block text-sm text-blue-400 hover:underline">
          제보하기 →
        </Link>
      </div>

      {/* 주차 현황으로 이동 */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm bg-bg-card border border-border rounded-lg px-4 py-2 text-text-secondary hover:bg-bg-card-hover transition-colors"
        >
          🅿️ 지금 주차 현황 확인하기
        </Link>
      </div>
    </main>
  );
}
