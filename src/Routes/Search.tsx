import { useLocation } from "react-router-dom";

function Search() {
  //location 지금 있는 곳에 관한 정보를 얻을 수 있음
  const location = useLocation();
  // URLSearchParams url 에서 특정 쿼리 문자열을 가져오거나 수정
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  //keyword로 api 요청 보내서 데이터 가져오고 맵핑하기
  return null;
}

export default Search;
