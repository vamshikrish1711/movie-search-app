import { useState } from 'react';
import { posterUrl } from '../api/tmdb.js';

function initials(title) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export default function Poster({ path, title, size = 'w500' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const src = posterUrl(path, size);

  if (!src || failedSrc === src) {
    return (
      <div className="poster poster--fallback" role="img" aria-label={`No poster available for ${title}`}>
        <span className="poster__initials" aria-hidden="true">{initials(title) || 'NR'}</span>
        <span className="poster__note" aria-hidden="true">No poster</span>
      </div>
    );
  }

  return (
    <img
      className="poster"
      src={src}
      alt={`${title} poster`}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
