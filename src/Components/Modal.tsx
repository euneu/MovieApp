import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail, IGetTvDetail } from "../api";
import { makeImgPath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigText = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BigTitle = styled.h3`
  text-shadow: rgb(0, 0, 0, 0.6) 1px 1px 10px;
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  span {
    font-weight: 100;
    margin-left: 10px;
    font-size: 17px;
  }
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigSpans = styled.div`
  margin: 10px;
`;

const BigSpan = styled.span`
  font-size: 15px;
  padding: 5px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  margin-right: 10px;
`;

interface IModal {
  modal: string;
}

function Modal({ modal }: IModal) {
  const [modalMovie, setModalMovie] = useState<IGetMovieDetail>();
  const [modalTv, setModalTv] = useState<IGetTvDetail>();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const onOverlayClick = () => navigate(-1);

  // 영화 정보 가져오기
  const { data: Moviedetail, isLoading: MoviedetailLoad } =
    useQuery<IGetMovieDetail>(
      ["search", "detail"],
      () => getMovieDetail(modal, "movie"),
      // modal이 존재할 때만 쿼리 요청함
      { enabled: !!modal }
    );

  //tv쇼 정보 가져오기
  const { data: Tvdetail, isLoading: TvdetailLoad } = useQuery<IGetTvDetail>(
    ["search", "detail"],
    () => getMovieDetail(modal, "tv"),
    // modal이 존재할 때만 쿼리 요청함
    { enabled: !!modal }
  );

  useEffect(() => {
    setModalMovie(Moviedetail);
    setModalTv(Tvdetail);
  }, [Moviedetail, Tvdetail]);

  return (
    <>
      {" "}
      <AnimatePresence>
        {/* bigMovieMatch가 존재하면 나타나도록 */}
        {modal ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{
                // 스크롤 값으로 박스를 고정
                top: scrollY.get() + 100,
              }}
              layoutId={modal}
            >
              {modalMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                        modalMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigText>
                    <BigTitle>
                      {modalMovie.title}
                      <span>⭐ {modalMovie.vote_average.toFixed(1)} 점</span>
                      <span>🎬 {modalMovie.runtime} 분</span>
                    </BigTitle>

                    <BigSpans>
                      <BigSpan>개봉</BigSpan> {modalMovie.release_date}
                    </BigSpans>
                    <BigSpans>
                      {modalMovie.genres.map((genre) => (
                        <BigSpan>{genre.name}</BigSpan>
                      ))}
                    </BigSpans>
                    <BigOverview>{modalMovie.overview}</BigOverview>
                  </BigText>
                </>
              )}
              {modalTv && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                        modalTv.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigText>
                    <BigTitle>
                      {modalTv.title}
                      <span>⭐ {modalTv.vote_average.toFixed(1)} 점</span>
                    </BigTitle>

                    <BigSpans>
                      <BigSpan>개봉</BigSpan>
                    </BigSpans>
                    <BigSpans>
                      {modalTv.genres.map((genre) => (
                        <BigSpan>{genre.name}</BigSpan>
                      ))}
                    </BigSpans>
                    <BigOverview>{modalTv.overview}</BigOverview>
                  </BigText>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Modal;
