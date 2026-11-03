"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return <html lang="en-ZA"><body style={{ margin: "12vh auto", padding: 28, maxWidth: 600, fontFamily: "Arial, sans-serif", color: "#202126", background: "#fffefa" }}><h1>A little interruption.</h1><p>Something went wrong loading the arcade. Please try again.</p><button onClick={reset}>Try again</button><p><a href="mailto:hello@tomorrowly.co.za">hello@tomorrowly.co.za</a></p></body></html>;
}
