import { handleLocation, goToLogin, goToJoin, goToBoard, goToReview, goToMypage } from './router.js';
import { handleAuth, socialLogin, logout } from './pages/auth.js';
import { authService } from './firebase.js';
import { imgFileUpload, saveReview, receiveDataFromMain, shoesBrandLike } from './board.js';
import { toggleMoreBrand, changeShoesList, showMoreShoes, renderBrandList, getRealtimeReviews } from './pages/home.js';
import { onFileChange, changeProfiles, onChangeNickname, onDeleteImg, changeUserPassword, getUserReviewList } from './mypage.js';
import { saveComment, updateComment, deleteComment, onEditing, deleteReview, receiveDataFromBoard, reviseReview } from './review.js';

const activeMenu = document.querySelector('.active');
window.addEventListener('hashchange', handleLocation);

document.addEventListener('DOMContentLoaded', function () {
  renderBrandList();
  changeShoesList();
  getRealtimeReviews();
  authService.onAuthStateChanged((user) => {
    handleLocation();
    const hash = window.location.hash;
    if (user) {
      activeMenu.textContent = 'Logout';
      activeMenu.setAttribute('onclick', 'logout()');
      if (hash === '') {
        window.location.replace('#');
      }
    } else {
      if (hash !== '') {
        window.location.replace('');
      }
      activeMenu.textContent = 'Login';
      activeMenu.setAttribute('onclick', 'goToLogin()');
    }
  });
});

const toTop = document.querySelector('.toTop');
window.addEventListener('scroll', checkHeight);
function checkHeight() {
  if (window.scrollY > 10) {
    toTop.classList.add('active');
  } else {
    toTop.classList.remove('active');
  }
}
toTop.addEventListener('click', () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// 메인 페이지
window.goToLogin = goToLogin;
window.goToJoin = goToJoin;
window.goToBoard = goToBoard;
window.goToReview = goToReview;
window.goToMypage = goToMypage;
window.onFileChange = onFileChange;
window.toggleMoreBrand = toggleMoreBrand;
// 로그인 & 회원가입
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
window.changeUserPassword = changeUserPassword;
window.logout = logout;
// 신발 리뷰
window.receiveDataFromMain = receiveDataFromMain;
window.changeShoesList = changeShoesList;
window.showMoreShoes = showMoreShoes;
window.imgFileUpload = imgFileUpload;
window.saveReview = saveReview;
window.shoesBrandLike = shoesBrandLike;
// 리뷰 보기
window.receiveDataFromBoard = receiveDataFromBoard;
window.handleLocation = handleLocation;
window.getUserReviewList = getUserReviewList;
window.saveComment = saveComment;
window.deleteComment = deleteComment;
window.onEditing = onEditing;
window.updateComment = updateComment;
window.deleteReview = deleteReview;
window.reviseReview = reviseReview;
// 마이 페이지
window.changeProfiles = changeProfiles;
window.renderBrandList = renderBrandList;
window.getRealtimeReviews = getRealtimeReviews;
window.onChangeNickname = onChangeNickname;
window.onDeleteImg = onDeleteImg;
