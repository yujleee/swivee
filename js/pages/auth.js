import { emailRegex, pwRegex } from '../utill.js';
import { authService } from '../firebase.js';
import { goToLogin } from '../router.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  GithubAuthProvider,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';

export const handleAuth = (event) => {
  event.preventDefault();
  const buttonText = event.target.value;
  const email = document.getElementById('email');
  const emailVal = email.value;
  const pw = document.getElementById('pw');
  const pwVal = pw.value;
  if (!emailVal) {
    alert('이메일을 입력해 주세요');
    email.focus();
    return;
  }
  if (!pwVal) {
    alert('비밀번호를 입력해 주세요');
    pw.focus();
    return;
  }

  const matchedEmail = emailVal.match(emailRegex);
  const matchedPw = pwVal.match(pwRegex);
  if (matchedEmail === null) {
    alert('이메일 형식에 맞게 입력해 주세요');
    email.focus();
    email.value = '';
    return;
  }
  if (matchedPw === null) {
    alert('비밀번호는 8자리 이상 영문자, 숫자, 특수문자 조합이어야 합니다.');
    pw.focus();
    pw.value = '';
    return;
  }

  const submitBox2 = document.querySelector('#submitBox2').value;
  if (submitBox2 === '로그인') {
    signInWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.hash = '#';
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log('errorMessage:', errorMessage);
        if (errorMessage.includes('user-not-found')) {
          alert('가입되지 않은 회원입니다.');
          return;
        } else if (errorMessage.includes('wrong-password')) {
          alert('비밀번호가 잘못 되었습니다.');
        }
      });
  } else {
    createUserWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        alert('회원가입이 완료되었습니다!');
        const user = userCredential.user;
        signOut(authService).then(() => {
          localStorage.clear();
          goToLogin();
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log('errorMessage:', errorMessage);
        if (errorMessage.includes('email-already-in-use')) {
          alert('이미 가입된 이메일입니다.');
        }
      });
  }
};

export const socialLogin = (str) => {
  let provider;
  if (str === 'google') {
    provider = new GoogleAuthProvider();
  } else if (str === 'github') {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      const user = result.user;
      window.location.hash = '#';
    })
    .catch((error) => {
      console.log('error:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export const logout = () => {
  signOut(authService)
    .then(() => {
      localStorage.clear();
    })
    .catch((error) => {
      console.log('error:', error);
    });
};
