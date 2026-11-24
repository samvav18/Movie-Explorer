// All fetch calls
import { API_KEY, BASE_URL } from './config.js';

export async function fetchPopularMovies(page = 1) {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

export async function fetchMovieDetails(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

export async function fetchMovieFull(id) {
  const [details, credits] = await Promise.all([
    fetchMovieDetails(id),
    fetchMovieCredits(id),
  ]);

  return { ...details, cast: credits.cast.slice(0, 10) };
}

export async function fetchGenres() {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

export async function fetchMovieCredits(id) {
  const url = `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

