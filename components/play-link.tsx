"use client";

import { ArrowUpRight } from "lucide-react";
import type { Game } from "@/lib/games";
import { trackGameClick } from "@/lib/analytics";

export function PlayLink({ game }: { game: Game }) {
  return (
    <a className="play-link" href={game.url} target="_blank" rel="noopener noreferrer"
      aria-label={`Play ${game.name} (opens in a new tab)`}
      onClick={() => trackGameClick(game)}
      onAuxClick={(event) => { if (event.button === 1) trackGameClick(game); }}>
      {game.cta}<ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
