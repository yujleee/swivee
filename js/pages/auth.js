import { emailRegex, pwRegex } from "../utill.js";
import { authService } from "../firebase.js";
import { goToLogin } from "../router.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  GithubAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// 로그인 성공 시 화면으로 이동
export const handleAuth = (event) => {
  event.preventDefault();

  const buttonText = event.target.value
  const email = document.getElementById("email");
  const emailVal = email.value;
  const pw = document.getElementById("pw");
  const pwVal = pw.value;
  console.log(emailVal, pwVal);
  
  

  // 유효성 검사 진행
  if (!emailVal) {
    alert("이메일을 입력해 주세요");
    email.focus();
    return;
  }
  if (!pwVal) {
    alert("비밀번호를 입력해 주세요");
    pw.focus();
    return;
  }
  

  const matchedEmail = emailVal.match(emailRegex);
  const matchedPw = pwVal.match(pwRegex);

  if (matchedEmail === null) {
    alert("이메일 형식에 맞게 입력해 주세요");
    email.focus();
    email.value = "";
    return;
  }
  if (matchedPw === null) {
    alert("비밀번호는 8자리 이상 영문자, 숫자, 특수문자 조합이어야 합니다.");
    pw.focus();
    pw.value = "";
    return;
  }
  // 유효성 검사 통과 후 로그인 또는 회원가입 API 요청
  const submitBox2 = document.querySelector("#submitBox2").value;
  if (submitBox2 === "로그인") {
    // 유효성검사 후 로그인 성공 시 화면으로

    signInWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        
        const user = userCredential.user;
        console.log(user)
        window.location.hash = "#";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          alert("가입되지 않은 회원입니다.");
          return;
        } else if (errorMessage.includes("wrong-password")) {
          alert("비밀번호가 잘못 되었습니다.");
        }
      });
  } else {
    // 회원가입 버튼 클릭의 경우
    createUserWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        console.log(userCredential)
        // Signed in
        alert("회원가입이 완료되었습니다!");
        // const user = userCredentialdebugger.user;
        const user = userCredential.user;
          signOut(authService)
            .then(() => {
              // Sign-out successful.
              localStorage.clear();
              goToLogin();
            })
            
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("email-already-in-use")) {
          alert("이미 가입된 이메일입니다.");
        }
      });
  }
};

// 소셜 로그인

export const socialLogin = (str) => {
  let provider;
  if (str === "google") {
    provider = new GoogleAuthProvider();
  } else if (str === "github") {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      const user = result.user;
      window.location.hash = "#";
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("error:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

//로그아웃

export const logout = () => {
  signOut(authService)
    .then(() => {
      // Sign-out successful.
      localStorage.clear();
      console.log("로그아웃 성공");
    })
    .catch((error) => {
      // An error happened.
      console.log("error:", error);
    });
};
