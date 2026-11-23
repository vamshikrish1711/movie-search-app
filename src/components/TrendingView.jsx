import MovieGrid from './MovieGrid.jsx';
import StatusMessage from './StatusMessage.jsx';

export default function TrendingView({
  trending,
  isFavourite,
  onOpen,
  onToggleFavourite,
  compact = false,
  onOpenTrending,
}) {
  const { status, movies, error, retry, loadMore, isLoadingMore, hasMore, loadedCount } = trending;
  const visibleMovies = compact ? movies.slice(0, 12) : movies;

  if (status === 'loading' && !isLoadingMore) {
    return <StatusMessage variant="loading" title="Loading films" message="Reading the catalogue for this selection." />;
  }

  if (status === 'error') {
    return (
      <StatusMessage
        variant="error"
        title="Trending films failed to load"
        message={error}
        actionLabel="Retry trending"
        onAction={retry}
      />
    );
  }

  if (movies.length === 0) {
    return (
      <StatusMessage
        variant="empty"
        title="No films for this selection"
        message="Try a different month or region. Some combinations have no theatrical releases."
      />
    );
  }

  return (
    <>
      <MovieGrid
        movies={visibleMovies}
        isFavourite={isFavourite}
        onOpen={onOpen}
        onToggleFavourite={onToggleFavourite}
      />
      <div className="pagination">
        <p className="pagination__count" role="status">
          {compact
            ? `${visibleMovies.length} films`
            : `${loadedCount} ${loadedCount === 1 ? 'film' : 'films'} loaded`}
        </p>
        {compact ? (
          <button type="button" className="text-link" onClick={onOpenTrending}>
            Open trending view
          </button>
        ) : (
          <button
            type="button"
            className="button button--solid"
            onClick={loadMore}
            disabled={!hasMore || isLoadingMore}
          >
            {isLoadingMore ? 'Loading more' : 'Load more'}
          </button>
        )}
      </div>
    </>
  );
}
