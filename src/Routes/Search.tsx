import { useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useLocation, useMatch } from "react-router-dom";
import styled from "styled-components";
import { getSerchData, IGetMovieResult } from "../api";
import Modal from "../Components/Modal";
import Slider from "../Components/Slider";
import { Banner, Loader, SliderContainer, SliderTitle, Wrapper } from "./Home";

const Container = styled.div`
  height: 10rem;
`;

function Search() {
  //location 지금 있는 곳에 관한 정보를 얻을 수 있음
  const location = useLocation();
  // URLSearchParams url 에서 특정 쿼리 문자열을 가져오거나 수정
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigMovieMatch: PathMatch<string> | null = useMatch("/search/movie/:Id");

  const { data: searchMovie, isLoading: searchMovieLoad } =
    useQuery<IGetMovieResult>(["movies", "searchMovie"], () =>
      getSerchData(keyword, "movie")
    );

  const { data: searchTv, isLoading: searchTvLoad } = useQuery<IGetMovieResult>(
    ["tvs", "searchtv"],
    () => getSerchData(keyword, "tv")
  );
  return (
    <Wrapper>
      <Container />
      {searchMovieLoad && searchTvLoad ? (
        <Loader>Loading...</Loader>
      ) : searchMovie && searchTv ? (
        <>
          <SliderContainer>
            <SliderTitle>영화</SliderTitle>
            <Slider movies={searchMovie?.results!} kid="movie" search="serch" />
            <Modal modal={bigMovieMatch?.params.Id!} />
            <SliderTitle>시리즈</SliderTitle>
            <Slider movies={searchTv?.results!} kid="tv" search="serch" />
          </SliderContainer>
        </>
      ) : (
        <Loader>검색어를 정확하게 입력하세요</Loader>
      )}
    </Wrapper>
  );
}

export default Search;
