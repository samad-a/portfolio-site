import { siteUrl } from "@/lib/site";

// Whether a link leaves the site, such as to GitHub or a live demo. Email
// links and pages of this site don't count.
export function isExternal(href: string) {
  return /^https?:\/\//.test(href) && !href.startsWith(siteUrl);
}

// Links that leave the site open in a new tab, so the portfolio stays open
// behind them. noopener stops the new page reaching back into this one.
export const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

// Said after such a link's name, so screen reader users know a tab opens.
export const newTabNote = " (opens in a new tab)";
