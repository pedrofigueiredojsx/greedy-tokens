import { ImageResponse } from "next/og";

export const alt = "Greedy Tokens - preço WoW Token";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#09090b",
        color: "#f4f4f5",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 800, color: "#fbbf24" }}>
        Greedy Tokens
      </div>
      <div style={{ fontSize: 40, marginTop: 24, color: "#a1a1aa" }}>
        Preço do WoW Token por região, com histórico
      </div>
    </div>,
    size,
  );
}
