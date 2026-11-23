import { useCallback, useEffect, useRef, useState } from 'react';
import { searchMovies } from '../api/tmdb.js';

const DEBOUNCE_MS = 400;
const initial = { key: null, results: [], error: null };

export function useMovieSearch(query) {
  const title = query.trim();
  const [committed, setCommitted] = useState(initial);
  const [attempt, setAttempt] = useState(0);
  const latestRequest = useRef(0);
  const key = `${title}::${attempt}`;

  useEffect(() => {
    if (!title) return undefined;

    const requestId = ++latestRequest.current;
    const controller = new AbortController();

    const timer = setTimeout(() => {
      searchMovies(title, controller.signal)
        .then((results) => {
          if (requestId === latestRequest.current) {
            setCommitted({ key, results, error: null });
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError' || requestId !== latestRequest.current) return;
          setCommitted({ key, results: [], error: error.message });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, title, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  if (!title) return { status: 'idle', results: [], error: null, retry };
  if (committed.key !== key) return { status: 'loading', results: [], error: null, retry };
  return {
    status: committed.error ? 'error' : 'success',
    results: committed.results,
    error: committed.error,
    retry,
  };
}
