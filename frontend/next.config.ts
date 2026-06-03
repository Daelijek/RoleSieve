import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Lock Turbopack root to frontend/ (repo parent has Python backend, no `next` package).
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
