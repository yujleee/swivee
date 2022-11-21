// import { authService } from './firebase.js';

const routes = {
  '/': '/pages/main.html',
  login: '/pages/login.html',
  join: '/pages/join.html',
  mypage: '/pages/mypage.html',
  board: '/pages/board.html',
  review: '/pages/review.html',
};

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