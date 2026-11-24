//All Dom Rendering
import { IMG_URL } from './config.js';
import { getPageNumbers } from './utils.js';

const PLACEHOLDER = 'https://placehold.co/500x750?text=No+Image';

const grid = document.querySelector('#movie-grid');

const createMovieCard = ({ id, title, poster_path, vote_average, release_date }) => {
  const poster = poster_path ? `${IMG_URL}${poster_path}` : PLACEHOLDER;
  const year = release_date?.slice(0, 4) || 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'NR';

  return `
    <article class="movie-card" data-id="${id}">
      <img src="${poster}" alt="${title} poster" loading="lazy">
      <div class="movie-info">
        <h3>${title}</h3>
        <p>${year} · ⭐ ${rating}</p>
      </div>
    </article>
  `;
};

export const renderMovies = (movies) => {
  grid.innerHTML = movies.map(createMovieCard).join('');
};

const pagination = document.querySelector('#pagination');

export const renderPagination = (current, total) => {
  if (total <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const numbers = getPageNumbers(current, total)
    .map((page) =>
      page === '...'
        ? '<span class="dots">…</span>'
        : `<button class="page-btn ${page === current ? 'active' : ''}" data-page="${page}">${page}</button>`
    )
    .join('');

  pagination.innerHTML = `
    <button class="page-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>Prev</button>
    ${numbers}
    <button class="page-btn" data-page="${current + 1}" ${current === total ? 'disabled' : ''}>Next</button>
  `;
};

const modal = document.querySelector('#modal');

const formatRuntime = (min) => (min ? `${Math.floor(min / 60)}h ${min % 60}m` : 'N/A');

export const showModalLoading = () => {
  modal.innerHTML = '<div class="modal-content"><p>Loading...</p></div>';
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

export const closeModal = () => {
  modal.hidden = true;
  modal.innerHTML = '';
  document.body.style.overflow = '';
};

export const renderModal = ({
  title,
  tagline,
  overview,
  poster_path,
  release_date,
  runtime,
  vote_average,
  genres = [],
  cast = [],
}) => {
  const poster = poster_path ? `${IMG_URL}${poster_path}` : PLACEHOLDER;
  const year = release_date?.slice(0, 4) || 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'NR';

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <img src="${poster}" alt="${title} poster">
      <div class="modal-body">
        <h2>${title} <span class="year">(${year})</span></h2>
        ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
        <p>⭐ ${rating} · ${formatRuntime(runtime)}</p>
        <p class="genres">${genres.map(({ name }) => name).join(' · ')}</p>
        <p>${overview || 'No overview available.'}</p>
        <h4>Cast</h4>
        <ul class="cast">
          ${cast.map(({ name, character }) => `<li><strong>${name}</strong>${character ? ` as ${character}` : ''}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};