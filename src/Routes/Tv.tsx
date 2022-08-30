import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNow,
  getPopular,
  getTopRated,
  getUpComingMovie,
  IGetMovieResult,
} from "../api";
import { makeImgPath } from "../utils";
import Slider from "../Components/Slider";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import {
  Wrapper,
  Loader,
  Banner,
  Title,
  Overview,
  SliderContainer,
  SliderTitle,
} from "../Routes/Home";
import TvModal from "../Components/TvModal";

function Tv() {
  // 원하는 url로 이동할 수 있음
  const navigate = useNavigate();
  // route가 url에 위치하면 데이터가 존재 없으면 null
  const bigMovieMatch: PathMatch<string> | null = useMatch("/tv/:Id");

  const { data: nowPlaying, isLoading: nowLoad } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    () => getNow("tv", "on_the_air")
  );

  const { data: popularPlaying, isLoading: popularLoad } =
    useQuery<IGetMovieResult>(["movies", "popularPlaying"], () =>
      getPopular("tv")
    );

  const { data: TopRatedPlaying, isLoading: topRatedLoad } =
    useQuery<IGetMovieResult>(["movies", "topRatedPlaying"], () =>
      getTopRated("tv")
    );

  return (
    <Wrapper>
      {nowLoad && popularLoad && topRatedLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 어떠한 이유에서 data가 존재하지 않아 backdrop_path가 undefined라면 그냥 ""<-이걸 보내 */}
          <Banner
            bgphoto={makeImgPath(
              popularPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{popularPlaying?.results[0].name}</Title>
            <Overview>{popularPlaying?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <SliderTitle>방영 중인 시리즈</SliderTitle>
            <Slider movies={nowPlaying?.results!} kid="tv" />

            <SliderTitle>인기 시리즈</SliderTitle>
            <Slider movies={popularPlaying?.results!} kid="tv" />

            <SliderTitle>평점 높은 시리즈</SliderTitle>
            <Slider movies={TopRatedPlaying?.results!} kid="tv" />
          </SliderContainer>
          <TvModal modal={bigMovieMatch?.params.Id!} />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
