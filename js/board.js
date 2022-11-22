import { authService, storageService } from './firebase.js';
import {
  ref,
  uploadString,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// 리뷰 작성을 누르면 사진과 리뷰가 올라간다. 아래 함수가 실행된다
export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById('boardReviewButton').disabled = true;
  const imgRef = ref(
    storageService,
    // `/${uuidv4()}`
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  const newReview = document.getElementById('boardWriteReview').value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem('imgDataUrl');
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, 'data_url');
    console.log('response: ', response);
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    displayName: newReview ? newReview : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert('프로필 수정 완료');
      window.location.hash = '#board';
    })
    .catch((error) => {
      alert('프로필 수정 실패');
      console.log('error:', error);
    });
};

export const onFileChange = (event) => {
  console.log('event.target.files:', event.target.files);
  const theFile = event.target.files[0]; // file 객체
  console.log('theFile', theFile);
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('imgDataUrl', imgDataUrl);
    // document.getElementById('profileView').src = imgDataUrl;
    // console.log(imgDataUrl);
  };
};

// export const uploadReview = () => {
//   const fileCheck = document.getElementById('imgInput').value;
//   const reviewCheck = document.getElementById('reviewCheck').value;
//   const uploadReview = document.getElementById('uploadReview').value;

//   console.log('fileCheck', fileCheck);
//   console.log('reviewCheck', reviewCheck);

//   console.log('uploadReview', uploadReview);

//   // fileCheck.addEventListener('input', uploadReview);
//   // reviewCheck.addEventListener('input', uploadReview);
//   // fileCheck.addEventListener('keyup', uploadReview);
//   // reviewCheck.addEventListener('keyup', uploadReview);

//   switch (!(fileCheck.value && reviewCheck.value)) {
//     case true:
//       document.getElementById('uploadReview').disabled = true;
//       // loginButton.disabled = true;
//       break;
//     case false:
//       loginButton.disabled = false;
//       break;
//   }
// };
// // 파일 첨부 여부 체크
