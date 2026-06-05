import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMetas } from "@/lib/posts";

export const metadata: Metadata = {
  title: "행궁동 가이드",
  description: "행궁동 단골이 직접 쓴 주차 꿀팁, 카페 가이드, 나들이 코스.",
};

export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-8 space-y-6">
      <div className="space-y-1 px-1">
        <p className="text-xs font-medium tracking-wider text-blue-400/70 uppercase">Local Guide</p>
        <h1 className="text-xl font-bold text-text-primary">행궁동 가이드</h1>
        <p className="text-sm text-text-secondary">단골이 직접 쓴 실용 정보</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-text-muted text-sm px-1">곧 첫 글이 올라와요.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="bg-bg-card border border-border rounded-xl p-5 space-y-2 hover:bg-bg-card-hover transition-colors">
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
                <h2 className="font-semibold text-text-primary leading-snug">{post.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <p className="text-xs text-text-muted">{post.date}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
