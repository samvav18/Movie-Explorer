import { fetchPopularMovies, searchMovies, fetchMovieFull } from './api.js';
import {
  renderMovies,
  renderPagination,
  renderModal,
  showModalLoading,
  closeModal,
} from './ui.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const grid = document.querySelector('#movie-grid');
const pagination = document.querySelector('#pagination');
const modal = document.querySelector('#modal');

const MAX_PAGES = 500; // TMDB doesn't serve pages beyond 500

let state = { query: '', page: 1, totalPages: 1 };

// ---------- URL helpers ----------
const readURL = () => {
  const params = new URLSearchParams(location.search);
  const page = Number(params.get('page')) || 1;

  return {
    query: params.get('q') ?? '',
    page: Math.min(Math.max(page, 1), MAX_PAGES),
  };
};

const writeURL = ({ query, page }) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', page);

  const qs = params.toString();
  history.pushState(null, '', qs ? `?${qs}` : location.pathname);
};

// ---------- Loading movies ----------
const fetchPage = (query, page) =>
  query ? searchMovies(query, page) : fetchPopularMovies(page);

const loadPage = async (page, { updateHistory = true } = {}) => {
  try {
    const { results, total_pages } = await fetchPage(state.query, page);

    state = { ...state, page, totalPages: Math.min(total_pages, MAX_PAGES) };

    renderMovies(results);
    renderPagination(state.page, state.totalPages);
    if (updateHistory) writeURL(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Failed to load movies:', error);
  }
};

// ---------- Events ----------
form.addEventListener('submit', (event) => {
  event.preventDefault();
  state = { ...state, query: input.value.trim() };
  loadPage(1);
});

pagination.addEventListener('click', (event) => {
  const button = event.target.closest('[data-page]');
  if (!button) return;
  loadPage(Number(button.dataset.page));
});

// Open the details modal when a card is clicked
grid.addEventListener('click', async (event) => {
  const card = event.target.closest('.movie-card');
  if (!card) return;

  showModalLoading();
  try {
    renderModal(await fetchMovieFull(card.dataset.id));
  } catch (error) {
    console.error('Failed to load details:', error);
    closeModal();
  }
});

// Close the modal: X button or click on the dark backdrop
modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.closest('[data-close]')) closeModal();
});

// Close the modal with Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// Browser Back/Forward buttons
window.addEventListener('popstate', () => {
  const { query, page } = readURL();
  state = { ...state, query };
  input.value = query;
  loadPage(page, { updateHistory: false });
});

// ---------- First load: start from whatever the URL says ----------
const initial = readURL();
state = { ...state, query: initial.query };
input.value = initial.query;
loadPage(initial.page, { updateHistory: false });