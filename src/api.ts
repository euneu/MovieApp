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
  //name은 tv쇼 이름
  name?: string;
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
export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Igenres[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  children: React.ReactNode | React.ReactNode[];
}

export interface IGetTvDetail {
  adult: boolean;
  backdrop_path: string;
  created_by: [];
  episode_run_time: [];
  first_air_date: string;
  genres: Igenres[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: [];
  last_air_date: string;
  last_episode_to_air: EpisodeToAir[];
  name: string;
  ext_episode_to_air: EpisodeToAir[];
  networks: [];
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

interface EpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: string;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Igenres {
  id: number;
  name: string;
}
interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

//상영 중인 상영물
export function getNow(kid: string, data: string) {
  return fetch(
    `${BASE_PATH}/${kid}/${data}?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((response) => response.json());
}
//인기 있는 상영물
export function getPopular(kid: string) {
  return fetch(
    `${BASE_PATH}/${kid}/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((response) => response.json());
}
//평점 높은 상영물
export function getTopRated(kid: string) {
  return fetch(
    `${BASE_PATH}/${kid}/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((response) => response.json());
}
// 개봉 예정 영화
export function getUpComingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((response) => response.json());
}
// 영화 상세 정보
export function getMovieDetail(Id: string | undefined, kid: string) {
  return fetch(`${BASE_PATH}/${kid}/${Id}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}
