export default function FavouriteButton({ active, title, onClick, compact = false }) {
  return (
    <button
      type="button"
      className={`save-button${active ? ' is-saved' : ''}${compact ? ' save-button--compact' : ''}`}
      aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Save'} ${title} ${active ? 'from' : 'to'} favourites`}
      onClick={onClick}
    >
      <span className="save-button__mark" aria-hidden="true">{active ? '\u25a0' : '+'}</span>
      <span>{active ? 'Saved' : 'Save'}</span>
    </button>
  );
}
