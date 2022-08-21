const API_KEY = "4a648eb924ccac5ff6d4e455936456fd";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr`
  ).then((response) => response.json());
}
