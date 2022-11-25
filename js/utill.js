// // 페이지 스크롤
// const toTop = document.querySelector(".toTop");

// window.addEventListener("scroll", checkHeight);

// function checkHeight() {
//   if (window.scrollY > 10) {
//     toTop.classList.add("active");
//   } else {
//     toTop.classList.remove("active");
//   }
// }

// toTop.addEventListener("click", () => {
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth",
//   });
// });

//유효성 검사

export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// 신발 유튜브 영상 링크
export const searchOnYoutube = (shoesName) => {
  const pattern = /\s/g; // 공백 체크하는 정규표현식

  if (shoesName.match(pattern)) {
    const keyword = shoesName.replace(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/).replace(/\s/g, '+');
    return `https://www.youtube.com/results?search_query=${keyword}`;
  } else {
    return `https://www.youtube.com/results?search_query=${shoesName}`;
  }
};
