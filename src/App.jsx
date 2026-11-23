import { useCallback, useEffect, useState } from 'react';
import SearchPanel from './components/SearchPanel.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import FavouritesList from './components/FavouritesList.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import TrendingControls from './components/TrendingControls.jsx';
import TrendingView from './components/TrendingView.jsx';
import { useMovieSearch } from './hooks/useMovieSearch.js';
import { useFavourites } from './hooks/useFavourites.js';
import { useTrendingMovies } from './hooks/useTrendingMovies.js';
import { defaultFilters, normalizeFilters, trendingHeading } from './utils/trending.js';

const VIEWS = ['search', 'trending', 'favourites'];

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get('view');
  const defaults = defaultFilters();
  return {
    view: VIEWS.includes(requestedView) ? requestedView : 'search',
    filters: normalizeFilters({
      year: params.get('year') ?? defaults.year,
      month: params.get('month') ?? defaults.month,
      region: params.get('region') ?? 'IN',
      sort: params.get('sort') ?? 'popular',
    }),
  };
}

export default function App() {
  const [state, setState] = useState(readUrlState);
  const { view, filters } = state;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { results, status, error, retry } = useMovieSearch(query);
  const { favourites, toggle, isFavourite } = useFavourites();
  const trending = useTrendingMovies(filters, view === 'trending');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (view === 'trending') {
      params.set('year', String(filters.year));
      params.set('month', String(filters.month));
      params.set('region', filters.region);
      params.set('sort', filters.sort);
    }
    const queryString = params.toString();
    const target = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', `${target}${window.location.hash}`);
  }, [view, filters]);

  useEffect(() => {
    const handlePopState = () => setState(readUrlState());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openDetails = useCallback((id) => setSelectedId(id), []);
  const closeDetails = useCallback(() => setSelectedId(null), []);
  const changeView = useCallback((nextView) => setState((current) => ({ ...current, view: nextView })), []);
  const changeFilters = useCallback((nextFilters) => {
    setState((current) => ({ ...current, filters: normalizeFilters(nextFilters) }));
  }, []);
  const showSearch = useCallback(() => changeView('search'), [changeView]);

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

  const heading = view === 'trending'
    ? trendingHeading(filters)
    : view === 'favourites' ? 'Saved films' : 'Find a film';
  const intro = view === 'trending'
    ? 'Filters update the list and the URL. Open a film for more detail.'
    : view === 'favourites'
      ? `${favourites.length} ${favourites.length === 1 ? 'film' : 'films'} kept on this device.`
      : 'Posters first. Open a film for cast, runtime and release details.';

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
          trendingCount={trending.loadedCount}
          hasSearched={status !== 'idle' && Boolean(query.trim())}
          trendingControls={<TrendingControls filters={filters} onChange={changeFilters} />}
        />

        <section className="content" aria-label="Film collection">
          <div className="content__head">
            <h1>{heading}</h1>
            <p className="content__intro">{intro}</p>
          </div>
          {view === 'trending' && (
            <TrendingView
              trending={trending}
              isFavourite={isFavourite}
              onOpen={openDetails}
              onToggleFavourite={toggle}
            />
          )}
          {view === 'search' && renderResults()}
          {view === 'favourites' && renderFavourites()}
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
