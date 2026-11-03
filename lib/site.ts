export const siteName = "Tomorrowly Arcade";
export const siteDescription = "Good games. Great distractions. Discover Chopper Run, Your World, K53 Driving Game, DinoMunch, Wall Boxer and MK1 in Tomorrowly’s game collection.";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
export const siteUrl = configuredUrl ? new URL(configuredUrl) : undefined;
if (siteUrl && !["http:", "https:"].includes(siteUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an http or https URL.");
}
