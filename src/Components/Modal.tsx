import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail } from "../api";
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

interface IModal {
  modal: string;
}

function Modal({ modal }: IModal) {
  const [modalMovie, setModalMovie] = useState<IGetMovieDetail>();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const onOverlayClick = () => navigate(-1);

  // 영화 정보 가져오기
  const { data: detail, isLoading: detailLoad } = useQuery<IGetMovieDetail>(
    ["search", "detail"],
    () => getMovieDetail(modal),
    // modal이 존재할 때만 쿼리 요청함
    { enabled: !!modal }
  );
  console.log(detail);

  useEffect(() => {
    setModalMovie(detail);
  }, [detail]);

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
                  <BigTitle>{modalMovie.title}</BigTitle>
                  <BigOverview>{modalMovie.overview}</BigOverview>
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
