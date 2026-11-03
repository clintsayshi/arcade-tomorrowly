"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent, type CSSProperties } from "react";

const characters = ["🚁", "🦖", "🚗", "🌍", "🥊", "🏁"];

export function Newsletter({ enabled, signupUrl }: { enabled: boolean; signupUrl?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const submitting = useRef(false);
  const successTitle = useRef<HTMLHeadingElement>(null);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !enabled) return;
    submitting.current = true;
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), fullName: form.get("fullName"), website: form.get("website") }),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setStatus("error");
        setMessage(typeof result.message === "string" ? result.message : "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(result.message);
      requestAnimationFrame(() => successTitle.current?.focus());
    } catch {
      setStatus("error");
      setMessage("We couldn’t complete your signup. Please check your connection and try again.");
    } finally { submitting.current = false; }
  }

  return (
    <section className={`newsletter ${status === "success" ? "newsletter-success" : ""}`} aria-labelledby="newsletter-title">
      {status === "success" ? <>
        <div className="newsletter-celebration" aria-hidden="true">
          <div className="celebration-orbit" />
          <span className="celebration-check"><Check size={34} strokeWidth={3} /></span>
          {characters.map((character, i) => <span key={character} className="celebration-character" style={{ "--i": i, "--x": `${[ -140, -85, 135, 86, -148, 145 ][i]}px`, "--y": `${[ -60, -100, -66, -110, 22, 24 ][i]}px`, "--tilt": `${[ -16, 12, 18, -10, -20, 14 ][i]}deg` } as CSSProperties}>{character}</span>)}
          {Array.from({ length: 18 }, (_, i) => <span key={i} className="celebration-confetti" style={{ "--i": i, "--angle": `${i * 20}deg`, "--distance": `${90 + (i % 4) * 16}px` } as CSSProperties} />)}
        </div>
        <h2 id="newsletter-title" ref={successTitle} tabIndex={-1}>Your next adventure is loading.</h2>
        <p className="newsletter-thanks" role="status">{message}</p>
        <span className="newsletter-signoff">See you in the next update.</span>
      </> : <>
        <div className="newsletter-copy"><h2 id="newsletter-title">Good games.<br />Fresh in your inbox.</h2><p>New games, early peeks, and what we’re building next. Get the occasional update from Tomorrowly.</p><div className="newsletter-cast" aria-hidden="true">{characters.slice(0, 4).map(character => <span key={character}>{character}</span>)}</div></div>
        <div className="newsletter-form-wrap">
          <form onSubmit={subscribe} aria-busy={status === "sending"}>
            <label htmlFor="newsletter-name">Full name</label>
            <input id="newsletter-name" name="fullName" type="text" autoComplete="name" placeholder="Your name" required maxLength={150} disabled={status === "sending"} aria-describedby="newsletter-response" />
            <label htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={status === "sending"} aria-describedby="newsletter-note newsletter-response" aria-invalid={status === "error" ? true : undefined} />
            <div className="newsletter-trap" aria-hidden="true"><label htmlFor="newsletter-website">Leave this field empty</label><input id="newsletter-website" type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
            <button type="submit" disabled={!enabled || status === "sending"}>{status === "sending" ? <>Joining…<LoaderCircle className="newsletter-spinner" size={18} aria-hidden="true" /></> : <>Keep me in the loop<ArrowUpRight size={18} aria-hidden="true" /></>}</button>
            <p id="newsletter-note" className="newsletter-note">Game news from Tomorrowly, sent with Mailchimp. Unsubscribe any time.</p>
            <p id="newsletter-response" className="newsletter-response" role={status === "error" ? "alert" : "status"}>{!enabled ? "Signups open soon. Watch this space." : message}</p>
            {status === "error" && signupUrl && <a className="newsletter-fallback" href={signupUrl} target="_blank" rel="noopener noreferrer">Open the Mailchimp signup page <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </form>
        </div>
      </>}
    </section>
  );
}
