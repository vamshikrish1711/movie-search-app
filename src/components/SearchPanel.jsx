export default function SearchPanel({
  query,
  onQueryChange,
  view,
  onViewChange,
  resultCount,
  favouriteCount,
  hasSearched,
}) {
  return (
    <aside className="rail">
      <div className="rail__block">
        <label className="field-label" htmlFor="movie-search">Search by title</label>
        <div className="search-field">
          <input
            id="movie-search"
            type="search"
            value={query}
            placeholder="A film title"
            autoComplete="off"
            spellCheck="false"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <p className="field-help">Search runs as you type. Poster results come from TMDB.</p>
      </div>

      <nav className="rail__block views" aria-label="Views">
        <span className="field-label" id="views-label">Views</span>
        <div role="group" aria-labelledby="views-label" className="views__list">
          <button
            type="button"
            className="view-tab"
            aria-current={view === 'search' ? 'page' : undefined}
            onClick={() => onViewChange('search')}
          >
            <span>Results</span>
            <span>{hasSearched ? resultCount : '0'}</span>
          </button>
          <button
            type="button"
            className="view-tab"
            aria-current={view === 'favourites' ? 'page' : undefined}
            onClick={() => onViewChange('favourites')}
          >
            <span>Favourites</span>
            <span>{favouriteCount}</span>
          </button>
        </div>
      </nav>

      <p className="rail__credit">
        Film data and images from{' '}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
      </p>
    </aside>
  );
}
