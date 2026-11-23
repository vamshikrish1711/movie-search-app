import Poster from './Poster.jsx';
import FavouriteButton from './FavouriteButton.jsx';
import { getRating, getYear } from '../utils/movie.js';

export default function FavouritesList({ movies, onOpen, onToggleFavourite }) {
  return (
    <ol className="index-list">
      {movies.map((movie, index) => {
        const rating = getRating(movie);
        return (
          <li key={movie.id} className="index-row">
            <span className="index-row__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="index-row__open"
              onClick={() => onOpen(movie.id)}
              aria-label={`View details for ${movie.title}`}
            >
              <span className="index-row__thumb">
                <Poster path={movie.posterPath} title={movie.title} size="w185" />
              </span>
              <span className="index-row__text">
                <span className="index-row__title">{movie.title}</span>
                <span className="index-row__meta">
                  {getYear(movie)} / {rating ? `${rating} / 10` : 'Rating unavailable'}
                </span>
              </span>
            </button>
            <FavouriteButton
              active
              compact
              title={movie.title}
              onClick={() => onToggleFavourite(movie)}
            />
          </li>
        );
      })}
    </ol>
  );
}
