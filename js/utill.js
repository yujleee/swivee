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
export const pwRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
