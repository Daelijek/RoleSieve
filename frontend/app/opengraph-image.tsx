import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "RoleSieve — vacancy intelligence for HeadHunter, turned into a clear resume plan";

export default async function OG() {
  const logoData = await readFile(
    join(process.cwd(), "public/brand/logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#07070C",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          color: "#E8E9EE",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -200,
            width: 760,
            height: 760,
            background:
              "radial-gradient(circle, rgba(139,108,255,0.55), transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -160,
            width: 560,
            height: 560,
            background:
              "radial-gradient(circle, rgba(255,106,90,0.42), transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 56,
          }}
        >
          <img
            src={logoSrc}
            width={64}
            height={64}
            alt=""
            style={{ borderRadius: 14 }}
          />
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -0.5,
              display: "flex",
            }}
          >
            RoleSieve
          </div>
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -2.5,
            maxWidth: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex" }}>Vacancy intelligence</span>
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(135deg, #8B6CFF, #FF6A5A)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            for HeadHunter.
          </span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#9CA0AE",
            marginTop: 36,
            maxWidth: 940,
            display: "flex",
            lineHeight: 1.4,
          }}
        >
          Turn job posts into a clear plan to improve your resume — top
          skills, frequent phrases, a clean Excel report.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(255,255,255,0.04)",
            padding: "10px 18px",
            borderRadius: 999,
            color: "#9CA0AE",
            fontSize: 18,
            fontFamily: "monospace",
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#4ade80",
              borderRadius: 999,
              display: "flex",
            }}
          />
          HH API · OK
        </div>
      </div>
    ),
    size,
  );
}
