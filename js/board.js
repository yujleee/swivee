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
  where,
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
  const reviewImgDataUrl = localStorage.getItem('reviewImgDataUrl');
  let downloadUrl;
  if (reviewImgDataUrl) {
    const response = await uploadString(imgRef, reviewImgDataUrl, 'data_url');
    console.log('response: ', response);
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    displayName: newReview ? newReview : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert('리뷰 업로드 완료');
      window.location.hash = '#board';
    })
    .catch((error) => {
      alert('리뷰 업로드 실패');
      console.log('error:', error);
    });
};

export const imgFileUpload = (event) => {};

// 리뷰 DB에 저장
export const saveReview = async (event) => {
  event.preventDefault();
  console.log('event.target.files:', event.target.files);
  const theFile = event.target.files[0]; // file 객체
  console.log('theFile', theFile);
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const reviewImgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('reviewImgDataUrl', reviewImgDataUrl);
    // document.getElementById('reviewPostingImg').src = reviewImgDataUrl;
    // console.log(reviewImgDataUrl);
  };

  // 현재 페이지의 신발이름을 가져와
  const shoeName =
    document.getElementsByClassName('boardShoeTitle')[0].innerHTML;
  console.log('shoeName', shoeName);
  // db의 shoeList에서 showName이 같은것을 찾아서

  // 거기에 사진과 리뷰를 쓴 리뷰글이 저장되야 한다.

  const comment = document.getElementById('reviewCheck');
  // const { photoURL, displayName } = authService.currentUser;

  try {
    // reviews 파일을 만든후, 아래 내용들이 저장된다.
    await addDoc(collection(dbService, 'reviews'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: 'testTest',
      nickname: shoeName,
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
    collection(dbService, 'reviews'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
    console.log(commentObj.id);
  });

  const reviewList = document.querySelector('.reviewList');
  // const currentUid = authService.currentUser.uid;
  reviewList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    // const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="boardReview">
        <div class="boardReviewersImg">
          <img class="reviewPostingImg" src="./assets/nike_review_1.png" alt="" />
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

// home.html에서 신발 클릭시
export const receiveDataFromMain = async (event) => {
  const currentTarget = event.target.parentNode.children[0].alt;
  console.log(event.target.parentNode.children[0].src);
  console.log(event.target.parentNode.children[0].alt);

  let reviewObjList = [];

  const q = query(
    collection(dbService, 'shoesList'),
    where('shoesName', '==', currentTarget)
  );
  const querySnapShot = await getDocs(q);

  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    reviewObjList.push(reviewsObj);
  });

  const boardTop = document.querySelector('.boardTop');
  boardTop.innerHTML = '';

  const temp = reviewObjList
    .map(
      (shoes, idx) =>
        `<!-- Left -->
      <div class="boardShoeImg boardImgLeft">
        <img
          src="${shoes.image}"
          alt="${shoes.shoesName}"
        />
      </div>
      <form class="boardWriteReviews">
        <p>${shoes.brandName}</p>
        <h1 class="boardShoeTitle">${shoes.shoesName}</h1>
        <div class="boardRow">
          <div class="boardMesageAndHeart">
            <i class="fa-regular fa-comment"></i>
            <p>123</p>
            <i class="fas fa-solid fa-heart"></i>
            <p>123</p>
          </div>
          <div class="youTubeIcon">
            <i class="fa-brands fa-youtube"><a href="">관련 영상</a></i>
          </div>
        </div>
        <!-- Right -->
        <div class="boardReviewRight boardReviewColumn">
          <label for="imgInput">
            <div class="boardNewImage">
              + 사진 올리기
              <input
                type="file"
                id="imgInput"
                accept="image/*"
                name="imgInput"
              />
            </div>
          </label>
          <div class="boardWriteReview">
            <textarea
              id="reviewCheck"
              placeholder=" 리뷰를 남겨주세요..."
            ></textarea>
          </div>
          <div class="boardReviewButton">
            <button id="uploadReview" onclick="saveReview(event)" type="button">
              리뷰 작성
            </button>
          </div>
          <div class="clear"></div>
        </div>
      </form>`
    )
    .join('');
  boardTop.innerHTML = temp;
};
