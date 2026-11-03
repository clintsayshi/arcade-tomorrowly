export const games = [
  { id: "chopper-run", name: "Chopper Run", url: "https://chopper-run.vercel.app", art: "helicopter", color: "blue", label: "The next game is one click away", cta: "Let’s play", featured: true },
  { id: "your-world", name: "Your World", url: "https://yourworld.co.za", art: "world", color: "mint", label: "A different kind of escape", cta: "Enter your world", featured: true },
  { id: "k53-driving-game", name: "K53 Driving Game", url: "https://k53-driving-game.vercel.app/", art: "🚗", color: "lilac", cta: "Let’s play", featured: false },
  { id: "dinomunch", name: "DinoMunch", url: "https://dinomunch.vercel.app/", art: "🦖", color: "cream", cta: "Let’s play", featured: false },
  { id: "wall-boxer", name: "Wall Boxer", url: "https://wall-boxer-game.vercel.app/", art: "🥊", color: "pink", cta: "Let’s play", featured: false },
  { id: "mk1", name: "MK1", url: "https://mk1.tomorrowly.co.za", art: "🏁", color: "blue", cta: "Let’s play", featured: false },
] as const;
export type Game = (typeof games)[number];
