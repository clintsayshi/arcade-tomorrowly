import type { Game } from "./games";

export const gaId = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_ID : undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGameClick(game: Game) {
  if (!gaId || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (..._args: unknown[]) {
    // The Google tag expects an Arguments object in dataLayer.
    window.dataLayer!.push(arguments);
  };
  window.gtag("event", "game_click", {
    game_id: game.id,
    game_name: game.name,
    link_url: game.url,
    placement: game.featured ? "featured" : "collection",
    transport_type: "beacon",
  });
}
