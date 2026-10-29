import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/site";

// Lets phones add the site to the home screen with its own name and icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName}'s portfolio`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "browser",
    background_color: "#a9dbee",
    theme_color: "#a9dbee",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
