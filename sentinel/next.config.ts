import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/agentic-soc",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
