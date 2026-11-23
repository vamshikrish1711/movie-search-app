import { useCallback, useState } from 'react';
import SearchPanel from './components/SearchPanel.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import FavouritesList from './components/FavouritesList.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import { useMovieSearch } from './hooks/useMovieSearch.js';
import { useFavourites } from './hooks/useFavourites.js';

export default function App() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('search');
  const [selectedId, setSelectedId] = useState(null);
  const { results, status, error, retry } = useMovieSearch(query);
  const { favourites, toggle, isFavourite } = useFavourites();

  const openDetails = useCallback((id) => setSelectedId(id), []);
  const closeDetails = useCallback(() => setSelectedId(null), []);
  const changeView = useCallback((nextView) => setView(nextView), []);
  const showSearch = useCallback(() => setView('search'), []);

  function renderResults() {
    if (!query.trim()) {
      return (
        <StatusMessage
          variant="empty"
          title="Start with a title"
          message="Search for a film to see posters, release years and ratings. Save any film to keep it here."
        />
      );
    }
    if (status === 'loading') {
      return <StatusMessage variant="loading" title="Searching TMDB" message="Matching titles and posters are on the way." />;
    }
    if (status === 'error') {
      return (
        <StatusMessage
          variant="error"
          title="Search failed"
          message={error}
          actionLabel="Retry search"
          onAction={retry}
        />
      );
    }
    if (status === 'success' && results.length === 0) {
      return (
        <StatusMessage
          variant="empty"
          title="No films found"
          message="Try a different spelling or a shorter title."
        />
      );
    }
    if (status === 'success') {
      return (
        <MovieGrid
          movies={results}
          isFavourite={isFavourite}
          onOpen={openDetails}
          onToggleFavourite={toggle}
        />
      );
    }
    return null;
  }

  function renderFavourites() {
    if (favourites.length === 0) {
      return (
        <StatusMessage
          variant="empty"
          title="Nothing saved yet"
          message="Use Save on any poster to add a film to this list. Your list stays on this device."
          actionLabel="Search films"
          onAction={showSearch}
        />
      );
    }
    return (
      <FavouritesList
        movies={favourites}
        onOpen={openDetails}
        onToggleFavourite={toggle}
      />
    );
  }

  return (
    <div className="app">
      <header className="masthead">
        <p className="wordmark">Reel Index</p>
        <p className="masthead__note">A poster-led search of the TMDB catalogue</p>
      </header>

      <main className="layout">
        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          view={view}
          onViewChange={changeView}
          resultCount={results.length}
          favouriteCount={favourites.length}
          hasSearched={status !== 'idle' && Boolean(query.trim())}
        />

        <section className="content" aria-label="Film collection">
          <div className="content__head">
            <h1>{view === 'search' ? 'Find a film' : 'Saved films'}</h1>
            <p className="content__intro">
              {view === 'search'
                ? 'Posters first. Open a film for cast, runtime and release details.'
                : `${favourites.length} ${favourites.length === 1 ? 'film' : 'films'} kept on this device.`}
            </p>
          </div>
          {view === 'search' ? renderResults() : renderFavourites()}
        </section>
      </main>

      <footer className="footer">
        <span>Reel Index</span>
        <span>Film data and images from TMDB</span>
      </footer>

      {selectedId !== null && (
        <MovieDetails
          movieId={selectedId}
          isFavourite={isFavourite(selectedId)}
          onToggleFavourite={toggle}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}
