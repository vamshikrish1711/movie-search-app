import { useCallback, useEffect, useRef, useState } from 'react';
import { discoverMovies } from '../api/tmdb.js';

const cache = new Map();

function pageKey(filters, page) {
  return `${filters.year}|${filters.month}|${filters.region}|${filters.sort}|${page}`;
}

function readCached(filters, page) {
  const movies = [];
  const seen = new Set();
  let totalPages = 0;
  let totalResults = 0;

  for (let current = 1; current <= page; current += 1) {
    const entry = cache.get(pageKey(filters, current));
    if (!entry) return null;
    for (const movie of entry.results) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id);
        movies.push(movie);
      }
    }
    totalPages = entry.totalPages;
    totalResults = entry.totalResults;
  }

  return { movies, totalPages, totalResults };
}

export function useTrendingMovies(filters, enabled) {
  const { year, month, region, sort } = filters;
  const filterKey = `${year}|${month}|${region}|${sort}`;
  const [pages, setPages] = useState({});
  const [attempts, setAttempts] = useState({});
  const [settled, setSettled] = useState(null);
  const latestRequest = useRef(0);

  const page = pages[filterKey] ?? 1;
  const requestKey = `${filterKey}|${page}`;
  const attempt = attempts[requestKey] ?? 0;
  const key = `${requestKey}|${attempt}`;

  useEffect(() => {
    if (!enabled || cache.has(requestKey)) return undefined;

    const requestId = ++latestRequest.current;
    const controller = new AbortController();

    discoverMovies({ year, month, region, sort, page }, controller.signal)
      .then((data) => {
        if (requestId === latestRequest.current) {
          cache.set(requestKey, data);
          setSettled({ key, error: null });
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && requestId === latestRequest.current) {
          setSettled({ key, error: error.message });
        }
      });

    return () => controller.abort();
  }, [enabled, requestKey, key, year, month, region, sort, page]);

  const cached = enabled ? readCached(filters, page) : null;
  const previous = enabled && page > 1 ? readCached(filters, page - 1) : null;
  const error = settled?.key === key ? settled.error : null;
  const status = !enabled ? 'idle' : error ? 'error' : cached ? 'success' : 'loading';
  const movies = cached?.movies ?? previous?.movies ?? [];
  const totalPages = cached?.totalPages ?? previous?.totalPages ?? 0;

  const retry = useCallback(() => {
    setAttempts((current) => ({ ...current, [requestKey]: (current[requestKey] ?? 0) + 1 }));
  }, [requestKey]);

  const loadMore = useCallback(() => {
    if (!totalPages || page >= totalPages) return;
    setPages((current) => ({ ...current, [filterKey]: page + 1 }));
  }, [filterKey, page, totalPages]);

  return {
    status,
    movies,
    error,
    retry,
    loadMore,
    isLoadingMore: status === 'loading' && Boolean(previous),
    hasMore: page < totalPages,
    loadedCount: movies.length,
    totalResults: cached?.totalResults ?? previous?.totalResults ?? 0,
  };
}
