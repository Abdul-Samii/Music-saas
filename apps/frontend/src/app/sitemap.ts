import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE = "https://escalium.io";

// Segments that should never appear in the sitemap
const EXCLUDED = new Set([
  "dashboard",
  "admin",
  "api",
  "meta",          // only has an OAuth callback, not a real page
  "thankyou",
  "verify-email",
  "reset-password",
  "_saved-home",
]);

function shouldSkip(segment: string): boolean {
  return (
    EXCLUDED.has(segment) ||
    segment.startsWith("_") ||   // private/internal folders
    segment.startsWith("[")      // dynamic routes ([artist], etc.) — URLs unknown without DB
  );
}

function collectUrls(dir: string): string[] {
  const urls: string[] = [];

  function walk(currentDir: string, urlPath: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    // If this folder has a page file, it's a real route
    const hasPage = entries.some(
      (e) => e.isFile() && /^page\.(tsx?|jsx?)$/.test(e.name)
    );
    if (hasPage) urls.push(urlPath || "/");

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (shouldSkip(entry.name)) continue;

      // Route groups like (auth) or (marketing) are transparent — they don't add to the URL
      const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      const nextPath = isRouteGroup ? urlPath : `${urlPath}/${entry.name}`;

      walk(path.join(currentDir, entry.name), nextPath);
    }
  }

  walk(dir, "");
  return urls;
}

function priority(urlPath: string): number {
  if (urlPath === "/") return 1.0;
  const depth = urlPath.split("/").filter(Boolean).length;
  return Math.max(0.5, 0.9 - (depth - 1) * 0.1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "src", "app");
  const urls = collectUrls(appDir);

  return urls.map((url) => ({
    url: url === "/" ? BASE : `${BASE}${url}`,
    lastModified: new Date(),
    changeFrequency: url === "/" ? "weekly" : "monthly",
    priority: priority(url),
  }));
}
