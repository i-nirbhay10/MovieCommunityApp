import axios from 'axios';
import {TMDB_KEY} from '@env';
// const TMDB_KEY = '9f9d932483d2df'; // replace with env
const BASE = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE,
  params: {api_key: TMDB_KEY},
});

export const fetchTrending = async (page = 1) => {
  const res = await api.get('/trending/movie/week', {params: {page}});
  return res.data; // { results, page, total_pages }
};

export const fetchMovieDetails = async id => {
  const res = await api.get(`/movie/${id}`, {
    params: {append_to_response: 'videos,credits'},
  });
  return res.data;
};

// Fetch all movie genres
export const fetchGenres = async () => {
  const res = await api.get('/genre/movie/list');
  return res.data; // { genres: [ {id, name}, ... ] }
};

export const posterUrl = (path, size = 'w342') =>
  `https://image.tmdb.org/t/p/${size}${path}`;
