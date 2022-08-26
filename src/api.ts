import { Spring } from "framer-motion";
import { NumberLiteralType } from "typescript";

const API_KEY = "4a648eb924ccac5ff6d4e455936456fd";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  title: string;
}
export interface IGetMovieResult {
  datas: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_results: number;
  total_pages: NumberLiteralType;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr`
  ).then((response) => response.json());
}
