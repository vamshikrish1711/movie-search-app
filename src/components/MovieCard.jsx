import Poster from './Poster.jsx';
import FavouriteButton from './FavouriteButton.jsx';
import { getRating, getYear } from '../utils/movie.js';

export default function MovieCard({ movie, featured, isFavourite, onOpen, onToggleFavourite }) {
  const rating = getRating(movie);

  return (
    <article className={`movie${featured ? ' movie--featured' : ''}`}>
      <div className="movie__frame">
        <button
          type="button"
          className="movie__poster-button"
          onClick={() => onOpen(movie.id)}
          aria-label={`View details for ${movie.title}`}
        >
          <Poster path={movie.poster_path ?? movie.posterPath} title={movie.title} />
        </button>
        <FavouriteButton
          active={isFavourite}
          title={movie.title}
          onClick={() => onToggleFavourite(movie)}
        />
      </div>
      <div className="movie__caption">
        <h3 className="movie__title">{movie.title}</h3>
        <p className="movie__meta">
          <span>{getYear(movie)}</span>
          <span aria-hidden="true">/</span>
          <span>{rating ? `${rating} / 10` : 'Rating unavailable'}</span>
        </p>
      </div>
    </article>
  );
}
