# Reel Index

A single-page movie search app built with Vite and React. Search the TMDB catalogue by title and browse a poster-led result wall. Open a film to see its overview, runtime, genres, release date, rating, director and other details in a keyboard-accessible dialog. Save films to a favourites list that persists in localStorage.

Search is debounced by 400 ms, in-flight requests are aborted when the query changes, and the UI covers idle, loading, error with retry, no-results and empty-favourites states. Missing posters, dates and ratings get designed fallbacks.

## Design direction

Swiss editorial print, built around posters rather than uniform cards. Paper `#f3f0e9`, surface `#e8e2d6`, ink `#17130e`, muted `#6e6558`, vermilion accent `#be410d`. Display type is Instrument Serif, body type is IBM Plex Sans, and metadata uses IBM Plex Mono.

## Get a TMDB API key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/).
2. Open Settings → API in your account menu.
3. Request an API key (v3 auth) and copy the key string.

No API key is committed to this repository.

## Run locally

```bash
npm install
cp .env.example .env
# put your TMDB v3 key after VITE_TMDB_API_KEY= in .env
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build   # production build into dist/
npm run preview # serve the production build locally
npm run lint    # oxlint
```

## Environment variables

| Variable | Required | Where |
| --- | --- | --- |
| `VITE_TMDB_API_KEY` | Yes | `.env` locally; Vercel project env vars for Production, Preview and Development |

`.env` and `.vercel` are gitignored. Because the key is read through a `VITE_` variable, Vite embeds it in the browser bundle. Use a TMDB key you are comfortable exposing in a client app, and keep rate limits in mind.

## Live URL

Pending deployment.
