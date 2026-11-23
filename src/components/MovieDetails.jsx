import { useEffect, useRef, useState } from 'react';
import { getMovieDetails } from '../api/tmdb.js';
import { directorName, formatDate, formatRuntime, getRating } from '../utils/movie.js';
import FavouriteButton from './FavouriteButton.jsx';
import Poster from './Poster.jsx';

const TITLE_ID = 'movie-details-title';

export default function MovieDetails({ movieId, isFavourite, onToggleFavourite, onClose }) {
  const [loaded, setLoaded] = useState({ key: null, data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const latestRequest = useRef(0);
  const dialogRef = useRef(null);
  const key = `${movieId}::${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++latestRequest.current;

    getMovieDetails(movieId, controller.signal)
      .then((data) => {
        if (requestId === latestRequest.current) setLoaded({ key, data, error: null });
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && requestId === latestRequest.current) {
          setLoaded({ key, data: null, error: error.message });
        }
      });

    return () => controller.abort();
  }, [movieId, key, attempt]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('[data-autofocus]')?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const isCurrent = loaded.key === key;
  const status = !isCurrent ? 'loading' : loaded.error ? 'error' : 'success';
  const movie = isCurrent ? loaded.data : null;
  const error = isCurrent ? loaded.error : null;
  const rating = getRating(movie ?? {});
  const director = directorName(movie?.credits);
  const genres = movie?.genres?.length
    ? movie.genres.map((genre) => genre.name).join(', ')
    : 'Genres not listed';

  return (
    <div
      className="dialog-layer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Film details"
        aria-labelledby={status === 'success' ? TITLE_ID : undefined}
        ref={dialogRef}
      >
        <button type="button" className="dialog__close" onClick={onClose} data-autofocus>
          Close
        </button>

        {status === 'loading' && (
          <p className="dialog__message" role="status">Loading film details.</p>
        )}

        {status === 'error' && (
          <div className="status status--error" role="alert">
            <p className="status__title">Details unavailable</p>
            <p className="status__message">{error}</p>
            <button
              type="button"
              className="button button--solid"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        )}

        {status === 'success' && movie && (
          <div className="dialog__body">
            <div className="dialog__poster">
              <Poster path={movie.poster_path} title={movie.title} />
            </div>
            <div className="dialog__content">
              <h2 id={TITLE_ID} className="dialog__title">{movie.title}</h2>
              {movie.tagline && <p className="dialog__tagline">{movie.tagline}</p>}

              <dl className="facts">
                <div>
                  <dt>Released</dt>
                  <dd>{formatDate(movie.release_date)}</dd>
                </div>
                <div>
                  <dt>Runtime</dt>
                  <dd>{formatRuntime(movie.runtime)}</dd>
                </div>
                <div>
                  <dt>Genres</dt>
                  <dd>{genres}</dd>
                </div>
                <div>
                  <dt>Rating</dt>
                  <dd>
                    {rating
                      ? `${rating} / 10${movie.vote_count ? ` from ${movie.vote_count} votes` : ''}`
                      : 'Not rated yet'}
                  </dd>
                </div>
                {director && (
                  <div>
                    <dt>Director</dt>
                    <dd>{director}</dd>
                  </div>
                )}
                {movie.original_title && movie.original_title !== movie.title && (
                  <div>
                    <dt>Original title</dt>
                    <dd>{movie.original_title}</dd>
                  </div>
                )}
              </dl>

              <p className="dialog__overview">
                {movie.overview || 'No overview has been added for this film.'}
              </p>

              <FavouriteButton
                active={isFavourite}
                title={movie.title}
                onClick={() => onToggleFavourite(movie)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
