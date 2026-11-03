# Tomorrowly Arcade

A responsive Next.js App Router application featuring five games, based on the approved pastel playground design.

## Run locally

Requires Node.js 20.9+. The development command uses Webpack with polling for compatibility with macOS environments where native file-watcher streams are restricted; the production build uses Turbopack.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. All five games open in new tabs. Contact and About us links point to Tomorrowly. Update the game collection in `lib/games.ts`.

```sh
npm run typecheck
npm run build
npm start
```

## Production configuration

Deploy this standard Next.js application to a Next.js-compatible host such as Vercel. Set environment variables before building, as `NEXT_PUBLIC_*` values are bundled at build time.

- `NEXT_PUBLIC_SITE_URL`: the actual arcade domain, including `https://`. Enables canonical URLs and sitemap entries. Configured for `https://arcade.tomorrowly.co.za`.
- `NEXT_PUBLIC_GA_ID`: your Google Analytics 4 web stream measurement ID (`G-…`), currently `G-4SN252QY8D`. No Google scripts are loaded when it is absent or invalid.
- `NEXT_PUBLIC_SENTRY_DSN`: the arcade project's Sentry public DSN. Monitoring is disabled until it is supplied.
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`: configure private source-map upload at build time. Keep the auth token secret and never prefix it with `NEXT_PUBLIC_`. Maps are deleted after upload.
- `SENTRY_RELEASE` and `NEXT_PUBLIC_SENTRY_RELEASE`: optionally set both to the same deployment commit SHA/version for release attribution.

SEO includes server-rendered headings and game names, title and description, Open Graph/Twitter metadata, generated social preview image, favicon, robots.txt and domain-dependent sitemap.xml. No placeholder production domain is indexed as canonical. The homepage also includes structured game-list data.

## See which game gets clicked most

Every play button sends one custom GA4 `game_click` event with `game_id`, `game_name`, `link_url`, and `placement`. Normal clicks, keyboard activation and middle clicks are covered. The events measure departures from this arcade, not gameplay or sessions within the other games.

1. Create a GA4 property and web data stream for the arcade domain. Add its measurement ID to the environment and rebuild.
2. In GA4 Admin → Custom definitions, register event-scoped dimensions `game_name`, `game_id`, and (optionally) `placement` with exactly those parameter names.
3. Use Realtime/DebugView to verify events, then build an Exploration with `Game name` as rows, `Event count` as values, and event name filtered to `game_click`. Sort descending to find the most-clicked game. New custom dimensions may take time to become available in reports.
4. Use the custom event as the single source for the comparison; don't add the automatically collected outbound `click` count to it, or the same interaction could be counted twice.

Events are queued before the Google script loads. Analytics blockers or disabled JavaScript can prevent collection, so counts aren't guaranteed to capture every visit/click.

Reference: https://developers.google.com/analytics/devguides/collection/ga4/events

## Error monitoring

Sentry is integrated for browser, Node.js, edge request errors, and the global error boundary. Tracing samples 100% in development and 10% in production. Default PII capture is disabled; no session replay is enabled. Source maps upload only when the build token is configured.

Verified locally on 2026-11-03: a temporary app route threw an error that arrived in Sentry as TOMORROWLY-ARCADE-1, with the source file, line and throwing code visible. The temporary route was removed. No public test-error route is included. Production monitoring still requires deployment with the configured DSN; private production source-map upload requires the build-time SENTRY_AUTH_TOKEN.

Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

## Dependency overrides

The Sentry build tooling currently pulls older `glob` and `minimatch` versions with moderate security advisories. Overrides select patched `glob` 14.0.3+ and `minimatch` 11.0.4+. Recheck upstream compatibility when updating Sentry; type checking and the production build validate this configuration.

## Verification completed

- TypeScript and optimized Next.js production build.
- Homepage and five game destinations; responsive desktop/phone layout without horizontal overflow.
- Canonical URL, sitemap, robots.txt and generated PNG social image.
- Browser emitted `game_click` for DinoMunch to GA4 property `G-4SN252QY8D`; receiving/reporting in the GA dashboard has not been independently checked. A local test click is present in analytics.
- Sentry local server error captured with readable application stack frame: https://tomorrowly-0s.sentry.io/issues/TOMORROWLY-ARCADE-1
- Dependency audit: no known vulnerabilities after patched overrides.
