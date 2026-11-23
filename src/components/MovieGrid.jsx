import MovieCard from './MovieCard.jsx';

export default function MovieGrid({ movies, isFavourite, onOpen, onToggleFavourite }) {
  return (
    <div className="results-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          featured={index === 0}
          isFavourite={isFavourite(movie.id)}
          onOpen={onOpen}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}
