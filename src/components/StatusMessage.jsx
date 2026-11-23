export default function StatusMessage({ variant, title, message, actionLabel, onAction }) {
  return (
    <div className={`status status--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <p className="status__title">{title}</p>
      {message && <p className="status__message">{message}</p>}
      {actionLabel && (
        <button type="button" className="button button--solid" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
