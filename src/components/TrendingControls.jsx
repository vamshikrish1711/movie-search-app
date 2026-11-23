import { currentDate, MONTHS, REGIONS, yearOptions } from '../utils/trending.js';

export default function TrendingControls({ filters, onChange }) {
  const { year, month, region, sort } = filters;
  const today = currentDate();

  return (
    <div className="rail__block trending-controls">
      <span className="field-label" id="trending-filters-label">Trending filters</span>
      <div role="group" aria-labelledby="trending-filters-label" className="trending-controls__list">
        <label className="control">
          <span className="field-label">Year</span>
          <select
            id="trending-year"
            className="select"
            value={year}
            onChange={(event) => onChange({ ...filters, year: Number(event.target.value) })}
          >
            {yearOptions().map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="control">
          <span className="field-label">Month</span>
          <select
            id="trending-month"
            className="select"
            value={month}
            onChange={(event) => onChange({ ...filters, month: Number(event.target.value) })}
          >
            {MONTHS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={year === today.year && option.value > today.month}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span className="field-label">Region</span>
          <select
            id="trending-region"
            className="select"
            value={region}
            onChange={(event) => onChange({ ...filters, region: event.target.value })}
          >
            {REGIONS.map((option) => (
              <option key={option.code} value={option.code}>{option.name}</option>
            ))}
          </select>
        </label>

        <label className="control">
          <span className="field-label">Sort</span>
          <select
            id="trending-sort"
            className="select"
            value={sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value })}
          >
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
          </select>
        </label>
      </div>
    </div>
  );
}
