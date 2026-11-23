import { useCallback, useEffect, useState } from 'react';
import { toFavourite } from '../utils/movie.js';

const STORAGE_KEY = 'reel-index:favourites:v1';

function readFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved)
      ? saved.filter((movie) => movie && Number.isInteger(movie.id) && typeof movie.title === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState(readFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      return;
    }
  }, [favourites]);

  const toggle = useCallback((movie) => {
    setFavourites((current) => (
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [toFavourite(movie), ...current]
    ));
  }, []);

  const isFavourite = useCallback(
    (id) => favourites.some((item) => item.id === id),
    [favourites],
  );

  return { favourites, toggle, isFavourite };
}
