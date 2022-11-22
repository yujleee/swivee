import {
  handleLocation,
  goToLogin,
  goToJoin,
  goToBoard,
  goToReview,
  goToMypage,
} from "./router.js";
import { handleAuth, socialLogin } from "./pages/auth.js";
import { authService } from './firebase.js';
import { changeProfile, imgFileUpload, saveReview } from './board.js';
import { toggleMoreBrand, changeShoesList, showMoreShoes } from './pages/home.js';
import { onFileChange } from './mypage.js';


// url 바뀌면 handleLocation 실행하여 화면 변경
window.addEventListener("hashchange", handleLocation);

// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener("DOMContentLoaded", function () {
  // 인증 관련 수정 추가 필요!
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 화면 표시
    handleLocation();
    const hash = window.location.hash;
    if (user) {
      // 로그인 상태이므로 항상 팬명록 화면으로 이동
      if (hash === "") {
        // 로그인 상태에서는 로그인 화면으로 되돌아갈 수 없게 설정
        window.location.replace('#mypage');
      }
    } else {
      // 로그아웃 상태이므로 로그인 화면으로 강제 이동
      if (hash !== "") {
        window.location.replace("");
      }
    }
  });
});

// onclick, onchange, onsubmit 이벤트 핸들러 리스트
// 페이지 이동 핸들러 리스트들
window.goToLogin = goToLogin;
window.goToJoin = goToJoin;
window.goToBoard = goToBoard;
window.goToReview = goToReview;
window.goToMypage = goToMypage;
window.onFileChange = onFileChange;
window.changeProfile = changeProfile;
window.toggleMoreBrand = toggleMoreBrand;
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
window.changeShoesList = changeShoesList;
window.showMoreShoes = showMoreShoes;
window.imgFileUpload = imgFileUpload;
window.saveReview = saveReview;
// window.getReviewList = getReviewList;
