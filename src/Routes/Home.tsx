import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowMovie,
  getPopularMovie,
  getTopRatedMovie,
  getUpComingMovie,
  IGetMovieResult,
} from "../api";
import { makeImgPath } from "../utils";
import Slider from "../Components/Slider";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  text-shadow: rgb(0, 0, 0, 0.6) 1px 1px 10px;
`;

const Overview = styled.p`
  text-shadow: rgb(0, 0, 0, 0.6) 1px 1px 10px;
  font-size: 1.3rem;
  width: 50%;
`;

const SliderContainer = styled.div``;

const SliderTitle = styled.h3`
  padding: 0 0 10px 5px;
  font-size: 40px;
  text-shadow: rgb(0, 0, 0, 0.6) 1px 1px 10px;
`;
// window.outerWidth : 브라우저 전체의 너비
// window.outerHeight : 브라우저 전체의 높이
// window.innerWidth : 브라우저 화면의 너비
// window.innerHeight : 브라우저 화면의 높이

function Home() {
  // 원하는 url로 이동할 수 있음
  const navigate = useNavigate();
  // route가 url에 위치하면 데이터가 존재 없으면 null
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");

  const { data: nowPlaying, isLoading: nowLoad } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getNowMovie
  );

  const { data: popularPlaying, isLoading: popularLoad } =
    useQuery<IGetMovieResult>(["movies", "popularPlaying"], getPopularMovie);

  const { data: TopRatedPlaying, isLoading: topRatedLoad } =
    useQuery<IGetMovieResult>(["movies", "topRatedPlaying"], getTopRatedMovie);

  const { data: upComingPlaying, isLoading: upComingLoad } =
    useQuery<IGetMovieResult>(["movies", "upComingPlaying"], getUpComingMovie);

  return (
    <Wrapper>
      {nowLoad && popularLoad && topRatedLoad && upComingLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 어떠한 이유에서 data가 존재하지 않아 backdrop_path가 undefined라면 그냥 ""<-이걸 보내 */}
          <Banner
            bgphoto={makeImgPath(
              popularPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{popularPlaying?.results[0].title}</Title>
            <Overview>{popularPlaying?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <SliderTitle>상영 중인 영화</SliderTitle>
            <Slider movies={nowPlaying?.results!} />

            <SliderTitle>인기 영화</SliderTitle>
            <Slider movies={popularPlaying?.results!} />

            <SliderTitle>평점 높은 영화</SliderTitle>
            <Slider movies={TopRatedPlaying?.results!} />

            <SliderTitle>개봉 예정 영화</SliderTitle>
            <Slider movies={upComingPlaying?.results!} />
          </SliderContainer>
          <Modal modal={bigMovieMatch?.params.movieId!} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
