export function getYear(movie) {
  const date = movie.releaseDate ?? movie.release_date;
  return date && /^\d{4}/.test(date) ? date.slice(0, 4) : 'Year unknown';
}

export function getRating(movie) {
  const value = Number(movie.voteAverage ?? movie.vote_average);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : null;
}

export function toFavourite(movie) {
  return {
    id: movie.id,
    title: movie.title || 'Untitled',
    posterPath: movie.poster_path ?? movie.posterPath ?? null,
    releaseDate: movie.release_date ?? movie.releaseDate ?? null,
    voteAverage: movie.vote_average ?? movie.voteAverage ?? 0,
  };
}

export function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}/.test(value)) return 'Release date unknown';
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRuntime(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return 'Runtime unknown';
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
}

export function directorName(credits) {
  return credits?.crew?.find((person) => person.job === 'Director')?.name ?? null;
}
