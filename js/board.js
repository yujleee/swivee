import { dbService, authService, storageService } from './firebase.js';
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
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

export const imgFileUpload = (event) => {
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

// 리뷰 DB에 저장
export const saveReview = async (event) => {
  event.preventDefault();
  const comment = document.getElementById('reviewCheck');
  // const { photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, 'reviews'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: 'testTest',
      nickname: 'displayName',
    });
    comment.value = '';
    getReviewList();
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

export const getReviewList = async () => {
  let cmtObjList = [];
  const q = query(
    collection(dbService, 'reviewPosting'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });
  const reviewList = document.getElementById('reviewList');
  // const currentUid = authService.currentUser.uid;
  reviewList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    // const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="boardReview">
        <div class="boardReviewersImg">
          <img src="./assets/nike_review_1.png" alt="" />
        </div>
        <div class="boardReviewersRow boardProfileImageAndNickName">
          <img
            class="boardReviewersProfile"
            src="./assets/blank-profile-picture.png"
            alt=""
          />
          <p class="boardReviewersNickname">__dw__00</p>
        </div>
        <div class="boardReviewersRow boardReviewersSmileAndComment">
          <i class="fa-regular fa-face-grin-squint"></i>
          <p>23</p>
          <i class="fa-regular fa-comment"></i>
          <p>3</p>
        </div>
      </div>`;

    const div = document.createElement('div');
    div.classList.add('boardReviews');
    div.innerHTML = temp_html;
    reviewList.appendChild(div);
  });
};
