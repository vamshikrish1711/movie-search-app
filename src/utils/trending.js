export const FIRST_YEAR = 1950;

export const REGIONS = [
  { code: 'WW', name: 'Worldwide' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NZ', name: 'New Zealand' },
];

export const MONTHS = [
  { value: 0, label: 'Whole year' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const pad = (value) => String(value).padStart(2, '0');

export function currentDate() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function yearOptions() {
  const { year } = currentDate();
  return Array.from({ length: year - FIRST_YEAR + 1 }, (_, index) => year - index);
}

export function dateRange(year, month) {
  const firstMonth = month === 0 ? 1 : month;
  const lastMonth = month === 0 ? 12 : month;
  const lastDay = new Date(year, lastMonth, 0).getDate();
  return {
    from: `${year}-${pad(firstMonth)}-01`,
    to: `${year}-${pad(lastMonth)}-${pad(lastDay)}`,
  };
}

export function normalizeFilters({ year, month, region, sort }) {
  const { year: currentYear, month: currentMonth } = currentDate();
  const parsedYear = Number(year);
  const safeYear = Number.isInteger(parsedYear)
    ? Math.min(Math.max(parsedYear, FIRST_YEAR), currentYear)
    : currentYear;

  const parsedMonth = Number(month);
  let safeMonth = Number.isInteger(parsedMonth) && parsedMonth >= 0 && parsedMonth <= 12
    ? parsedMonth
    : currentMonth;
  if (safeYear === currentYear && safeMonth > currentMonth) safeMonth = currentMonth;

  return {
    year: safeYear,
    month: safeMonth,
    region: REGIONS.some((item) => item.code === region) ? region : 'IN',
    sort: sort === 'rating' ? 'rating' : 'popular',
  };
}

export function defaultFilters() {
  const { year, month } = currentDate();
  return normalizeFilters({ year, month, region: 'IN', sort: 'popular' });
}

export function regionName(code) {
  return REGIONS.find((item) => item.code === code)?.name ?? 'Worldwide';
}

export function monthName(month) {
  return MONTHS.find((item) => item.value === month)?.label ?? '';
}

export function trendingHeading({ year, month, region, sort }) {
  const lead = sort === 'rating' ? 'Highest rated' : 'Most popular';
  const place = region === 'WW' ? 'worldwide' : `in ${regionName(region)}`;
  const when = month === 0 ? String(year) : `${monthName(month)} ${year}`;
  return `${lead} ${place}, ${when}`;
}
