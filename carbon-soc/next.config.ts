import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // static HTML export for GitHub Pages
  basePath: "/agentic-soc",  // must match the GitHub repo name
  images: {
    unoptimized: true,       // required for static export
  },
  trailingSlash: true,       // ensures paths like /incidents/ work on gh-pages
};

export default nextConfig;
