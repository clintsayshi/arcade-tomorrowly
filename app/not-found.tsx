import Link from "next/link";
export default function NotFound() {
  return <main className="error-page"><h1>A wrong turn.</h1><p>This page isn’t in our arcade. Let’s get you back to the games.</p><Link className="play-link" href="/">Back to the arcade</Link></main>;
}
