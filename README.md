# Reel Index

A single-page movie search app built with Vite and React. Search the TMDB catalogue by title, browse a poster-led trending wall, and save films to a favourites list that persists in localStorage. Open a film to see its overview, runtime, genres, release date, rating, director and other details in a keyboard-accessible dialog.

Search is debounced by 400 ms. Both search and trending abort in-flight requests and ignore stale responses. The UI covers idle, loading, error with retry, no-results and empty-favourites states. Missing posters, dates and ratings get designed fallbacks.

## Trending view

The Trending view uses `GET /discover/movie`, filtered by year, month, region and sort:

- **Year:** current year down to 1950.
- **Month:** any month of a past year, or the current month and earlier in the current year. Future months are disabled. "Whole year" spans January 1 to December 31.
- **Region:** ISO 3166-1 codes including India (default), United States, United Kingdom, Japan, South Korea, France, Germany, Australia, Canada and Brazil, plus Worldwide. Regional queries use `region`, `with_release_type=2|3` and `release_date.gte/lte` so TMDB applies dates to that country's theatrical releases. Worldwide omits those and uses `primary_release_date.gte/lte` instead.
- **Sort:** "Most popular" (`popularity.desc`) or "Highest rated" (`vote_average.desc` with `vote_count.gte=100`).

Every change refetches automatically. Results are cached in memory per year, month, region, sort and page for the session, so switching back does not refetch. "Load more" requests the next TMDB page. The heading and URL describe the current selection, for example `?view=trending&year=2026&month=11&region=IN&sort=popular`. No extra environment variable is needed; the view uses the same TMDB key.

The home page shows a 12-poster trending preview for the current filters when no search is active, with a link to the full trending view. The Reel Index wordmark returns to the home page from any view.

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

https://movie-app-sable-phi.vercel.app
