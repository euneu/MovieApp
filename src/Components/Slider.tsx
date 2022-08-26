import styled from "styled-components";
import { makeImgPath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, PathMatch } from "react-router-dom";
import { IGetMovieResult } from "../api";

const Slide = styled(motion.div)`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  font-size: 20px;
  color: black;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 500px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const BtnBox = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  width: 50px;
  height: 510px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: all 0.3s ease 0s;

  &:hover {
    background-color: rgba(0, 0, 0, 1);
    svg {
      transform: scale(1.3);
      fill: rgb(255, 255, 255, 1);
    }
  }
`;

const Svg = styled(motion.svg)`
  padding-right: 10px;
  fill: rgb(255, 255, 255, 0);
`;

const Info = styled(motion.div)`
  padding: 20px;
  width: 100%;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  color: white;
  opacity: 0;
  position: absolute;
  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

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

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
`;

const rowVariants = {
  hidden: (direction: boolean) => ({
    x: direction ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (direction: boolean) => ({
    x: direction ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
};

const BoxVarient = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const infoVarient = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

interface ISlide {
  data?: IGetMovieResult;
}

function Slider({ data }: ISlide) {
  // 원하는 url로 이동할 수 있음
  const navigate = useNavigate();
  // route가 url에 위치하면 데이터가 존재 없으면 null
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  // ⭐ 한번에 보여주고 싶은 영화의 수
  const offset = 5;

  //슬라이드 다음 페이지 넘기기 위한 인덱스
  // index는 슬라이드 하나를 말함
  const [index, setIndex] = useState(0);

  //슬라이드 방향
  // false는 다음 true는 이전
  const [direction, setDirection] = useState(true);

  //인덱스 증가, 감소 버튼을 여러번 눌렀을 때 이상한 gap이 생기는 걸 막아줌
  // 즉 슬라이드 내에 이동중인 애니메이션이 끝났는지 확인
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // 인덱스 증가, 다음 슬라이드로
  const nextIndex = () => {
    if (data) {
      //애니메이션 아직 안 끝났음
      if (leaving) return;
      toggleLeaving();

      // ⭐ 보여줄 영화 끝났는데 인덱스가 넘어가는 것을 방지하려고
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1; //내림
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setDirection(() => false);
    }
  };

  //인덱스 감소, 다음 슬라이드로
  const prevIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1; //내림
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setDirection(() => true);
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);

  // ⭐ 슬라이더에서 클릭한 영화 정보 -> 이 정보로 정보 모달창을 채울 것
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <>
      <Slide>
        <BtnBox style={{ left: 0 }} onClick={prevIndex}>
          <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924z"
              data-name="Left"
            />
          </Svg>
        </BtnBox>
        {/* onExitComplete exit가 끝난 후 실행됨 
    ⭐ 클릭을 여러번 하면 슬라이더에 이상한 gap이 생기는 현상을 막기 위함
    initial = {false}
    컴포넌트가 처음 렌더링 될때 자식의 초기 애니메이션 비활성화
    ⭐ 새로 고침해서 랜더링할 때 슬라이더가 고정되어있지 않고 오른쪽에서 나타나는 현상 막기 위함
*/}

        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={direction}
        >
          {/* ⭐ key가 바뀌면 새로운 Row가 생겼다고 인식함 */}
          <Row
            variants={rowVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {/* ⭐ 메인 화면에 사용한 영화 제외 하려면 slice(1) 
        index는 페이지, offset는 보여주고 싶은 영화 개수*/}
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  variants={BoxVarient}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(movie.id)}
                  key={movie.id}
                  bgPhoto={makeImgPath(movie.poster_path, "w500")}
                >
                  {/* 부모에게 있는 whilehover 같은 props는 자동적으로 자식에게 상속됨 */}
                  <Info variants={infoVarient}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <BtnBox style={{ right: 0 }} onClick={nextIndex}>
          <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414z"
              data-name="Right"
            />
          </Svg>
        </BtnBox>
      </Slide>
      {/* //상세페이지 모달창 */}
      <AnimatePresence>
        {/* bigMovieMatch가 존재하면 나타나도록 */}
        {bigMovieMatch ? (
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
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default Slider;
