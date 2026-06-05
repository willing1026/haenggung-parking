import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "행궁동 지금 — 주차·로컬 가이드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0D14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 태그 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "8px",
              padding: "6px 16px",
              color: "#60a5fa",
              fontSize: "18px",
              letterSpacing: "0.1em",
            }}
          >
            수원 · 행궁동
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            color: "#F1F3F5",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          행궁동 지금
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: "32px",
            color: "#868E96",
            marginBottom: "60px",
          }}
        >
          가기 전에 여기 먼저 — 주차 · 핫스팟 · 로컬 가이드
        </div>

        {/* 하단 구분선 + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ width: "40px", height: "2px", background: "#3b82f6" }} />
          <div style={{ color: "#4A5060", fontSize: "22px" }}>
            haenggung-parking.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
