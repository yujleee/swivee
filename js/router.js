import { authService } from './firebase.js';
import { renderBrandList, changeShoesList, getRealtimeReviews, renderTopbrands } from './pages/home.js';
import { getUserReviewList } from './mypage.js';
import { getReviewList, receiveDataFromMain } from './board.js';

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

  if (pathName === '/index.html') {
    window.history.pushState({}, '', '/');
  }
  if (path.length == 0) {
    path = '/';
  }

  const route = routes[path] || routes['/'];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('main').innerHTML = html;

  if (path === 'mypage') {
    authService.onAuthStateChanged((user) => {
      if (!user) {
        alert('마이페이지는 로그인 후 이용하실 수 있어요.');
        goToLogin();
      } else {
        document.getElementById('profileView').src =
          authService.currentUser.photoURL ?? '/assets/blank-profile-picture.png';
        document.getElementById('profileNickname').value = authService.currentUser.displayName ?? '닉네임없나';
        getUserReviewList();
      }
    });
  }
  if (path === '/') {
    renderBrandList();
    changeShoesList();
    getRealtimeReviews();
    renderTopbrands();
  }
};

export const goToLogin = () => {
  window.location.hash = '#login';
};

export const goToJoin = () => {
  window.location.hash = '#join';
};

export const goToBoard = (shoesName) => {
  window.location.hash = '#board';
  receiveDataFromMain(null, shoesName);
  getReviewList(shoesName);
};

export const goToReview = () => {
  window.location.hash = '#review';
};

export const goToMypage = () => {
  window.location.hash = '#mypage';
};
