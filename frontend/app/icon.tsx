import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #8B6CFF 0%, #FF6A5A 100%)",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: -0.5,
        }}
      >
        RS
      </div>
    ),
    size,
  );
}
