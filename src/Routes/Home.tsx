import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovieResult } from "../api";
import { makeImgPath } from "../utils";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;

// window.outerWidth : 브라우저 전체의 너비
// window.outerHeight : 브라우저 전체의 높이
// window.innerWidth : 브라우저 화면의 너비
// window.innerHeight : 브라우저 화면의 높이

function Home() {
  const { data: nowPlaying, isLoading: nowLoad } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {nowLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 어떠한 이유에서 data가 존재하지 않아 backdrop_path가 undefined라면 그냥 ""<-이걸 보내 */}
          <Banner
            bgPhoto={makeImgPath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>

          <Slider data={nowPlaying} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
