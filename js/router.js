// import { authService } from './firebase.js';

const routes = {
  '/': '/pages/main.html',
  login: '/pages/login.html',
  join: '/pages/join.html',
  mypage: '/pages/mypage.html',
  board: '/pages/board.html',
  review: '/pages/review.html',
};

// const kimTaeWook = "남자 28 개발자";
// 위처럼 표현했을 때 문제? 
// 김태욱의 성별이 뭐에요? --> 

// 객체는 비슷한 주제로 묶여있어.
const kimTaeWook = {
  성별: "남자",
  나이: 28,
  직업: "개발자"
}

// html 에서는 <script> </script>

// kimTaeWook.나이 = 28

// 객체는 "키 - 값" 이 있고 "key - value"
// 객체는 키로 값을 불러온다.

export const handleLocation = async () => {
  let path = window.location.hash.replace('#', '');
  const pathName = window.location.pathname;

  // Live Server를 index.html에서 오픈할 경우
  if (pathName === '/index.html') {
    window.history.pushState({}, '', '/');
  }
  if (path.length == 0) {
    path = '/';
  }

  const route = routes[path] || routes['/'];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('main').innerHTML = html;
};

// 페이지 이동
export const goToLogin = () => {
  window.location.hash = '#login';
};

export const goToJoin = () => {
  window.location.hash = '#join';
};

export const goToBoard = () => {
  window.location.hash = '#board';
};

export const goToReview = () => {
  window.location.hash = '#review';
};

export const goToMypage = () => {
  window.location.hash = '#mypage';
};
