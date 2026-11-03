import type { Game } from "@/lib/games";
import { PlayLink } from "./play-link";

export function GameCard({ game }: { game: Game }) {
  return (
    <article className={`game-card ${game.color} ${game.featured ? "featured" : "collection-card"}`} aria-labelledby={`${game.id}-title`}>
      {game.art === "helicopter" ? (
        <div className="sky" aria-hidden="true"><div className="cloud" /><div className="cloud small" /><span className="helicopter">🚁</span><div className="city" /></div>
      ) : game.art === "world" ? (
        <div className="world-art" aria-hidden="true"><div className="planet"><div className="land" /><div className="land two" /><div className="land three" /></div><div className="orbit" /><span className="star">✦</span></div>
      ) : <span className="game-art" aria-hidden="true">{game.art}</span>}
      {"label" in game && <span className="game-label">{game.label}</span>}
      <div className="game-content"><h2 id={`${game.id}-title`}>{game.name}</h2><PlayLink game={game} /></div>
    </article>
  );
}
