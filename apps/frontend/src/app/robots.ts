import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/api/", "/verify-email", "/reset-password"],
    },
    sitemap: "https://escalium.io/sitemap.xml",
  };
}
