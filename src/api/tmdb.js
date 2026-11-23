const API_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim();

export const isConfigured = apiKey.length > 0;

async function request(path, params, signal) {
  if (!isConfigured) {
    throw new Error('Add VITE_TMDB_API_KEY to .env, then restart the dev server.');
  }

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not reach TMDB. Check your connection and try again.');
  }

  if (response.status === 401) {
    throw new Error('TMDB rejected the API key. Check VITE_TMDB_API_KEY.');
  }
  if (response.status === 429) {
    throw new Error('TMDB rate limit reached. Wait a moment and try again.');
  }
  if (!response.ok) {
    throw new Error(`TMDB returned status ${response.status}. Try again.`);
  }
  return response.json();
}

export async function searchMovies(title, signal) {
  const data = await request(
    '/search/movie',
    { query: title, include_adult: false, page: 1 },
    signal,
  );
  return Array.isArray(data.results) ? data.results : [];
}

export async function getMovieDetails(id, signal) {
  return request(`/movie/${id}`, { append_to_response: 'credits' }, signal);
}

export function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}
