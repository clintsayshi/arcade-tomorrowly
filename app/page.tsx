import { Gamepad2 } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Tomorrowly Arcade home"><span className="brand-mark"><Gamepad2 size={24} strokeWidth={2} aria-hidden="true" /></span><span>tomorrowly<span className="brand-suffix"> / arcade</span></span></a>
        <nav aria-label="Contact and company"><a href="mailto:hello@tomorrowly.co.za">hello@tomorrowly.co.za</a><a href="https://tomorrowly.co.za" target="_blank" rel="noopener noreferrer">About us<span className="sr-only"> (opens in a new tab)</span></a></nav>
      </header>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Tomorrowly Arcade game collection",
          numberOfItems: games.length,
          itemListElement: games.map((game, index) => ({
            "@type": "ListItem", position: index + 1, name: game.name, url: game.url,
          })),
        }).replace(/</g, "\\u003c") }} />
        <section className="intro" aria-labelledby="intro-title"><h1 id="intro-title">Good games.<br />Great distractions.</h1><p>A small collection of worlds worth getting lost in. Pick one. Jump in.</p></section>
        <section id="games" aria-label="Our games">
          <div className="featured-grid">{games.filter(game => game.featured).map(game => <GameCard key={game.id} game={game} />)}</div>
          <div className="collection-grid">{games.filter(game => !game.featured).map(game => <GameCard key={game.id} game={game} />)}</div>
        </section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Tomorrowly Arcade</span><span>Made for the joy of playing.</span></footer>
    </div>
  );
}
