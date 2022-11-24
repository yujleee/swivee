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
// 사용하지 않은 듯

// 디비에 사진 업로드 하기
export const imgFileUpload = (event) => {
  // boardNewImage 태그를 가져온다
  const btnName = event.target.parentNode;

  const theFile = event.target.files[0]; // file 객체
  console.log('theFile', theFile);
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const reviewImgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('reviewImgDataUrl', reviewImgDataUrl);
    // + 사진을 파일명으로 변경
    btnName.innerText = theFile.name;
  };
};

// 리뷰 DB에 저장
export const saveReview = async (event) => {
  event.preventDefault();
  // 현재 페이지의 신발이름
  const shoeName =
    document.getElementsByClassName('boardShoeTitle')[0].innerHTML;
  const shoeBrand =
    document.getElementsByClassName('boardShoeBrand')[0].innerHTML;
  // 현재 페이지의 리뷰
  const comment = document.getElementById('reviewCheck');
  // Storage에 리뷰 사진 저장할 위치 (신발 이름별 리뷰 모음)
  const imgRef = ref(storageService, `${shoeName}/${uuidv4()}`);
  const reviewImgDataUrl = localStorage.getItem('reviewImgDataUrl');
  let downloadUrl;
  if (reviewImgDataUrl) {
    const response = await uploadString(imgRef, reviewImgDataUrl, 'data_url');
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    userReview: comment ? comment : null,
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

  // db의 shoeList에서 showName이 같은것을 찾아서
  // 거기에 사진과 리뷰를 쓴 리뷰글이 저장되야 한다.
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.

  const { uid, photoURL, displayName } = authService.currentUser;

  try {
    // reviews 파일을 만든후, 아래 내용들이 저장된다.
    await addDoc(collection(dbService, 'reviews'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      shoeName: shoeName,
      brandName: shoeBrand,
    });
    comment.value = '';
    getReviewList(shoeName);
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

const cntReviews = async (shoeName) => {
  console.log('shoeName', shoeName);
  let reviewObjList = [];
  const q = query(
    collection(dbService, 'reviews'),
    where('shoeName', '==', shoeName)
  );
  const querySnapShot = await getDocs(q);
  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    reviewObjList.push(reviewsObj);
  });
  console.log('reviewObjList', reviewObjList.length);
  return reviewObjList.length;
};

export const getReviewList = async (shoeName) => {
  // await cntReviews(shoeName);
  // console.log(cntReviews(shoeName));
  console.log('shoeName', shoeName);
  let cmtObjList = [];
  const qq = query(
    collection(dbService, 'reviews'),
    where('shoeName', '==', shoeName)
  );
  const querySnapShot = await getDocs(qq);
  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(reviewsObj);
  });

  const reviewList = document.querySelector('.boardReviews');
  reviewList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    const temp_html = `
        <div class="boardReviewersImg">
          <img class="reviewPostingImg" src="${cmtObj.profileImg}" alt="" />
        </div>
        <div class="boardReviewersRow boardProfileImageAndNickName">
          <img
            class="boardReviewersProfile"
            src="${cmtObj.profileImg}"
            alt=""
          />
          <div class="boardReviewersNickname">${cmtObj.nickname}</div>
        </div>
        <div class="boardReviewersRow boardReviewText">${cmtObj.text}</div>
        <div class="boardReviewersRow boardReviewersSmileAndComment">
          <i class="fa-regular fa-face-grin-squint"></i>
          <p>23</p>
          <i class="fa-regular fa-comment"></i>
          <p>3</p>
        </div>
      `;

    const div = document.createElement('div');
    div.classList.add('boardReview');
    div.innerHTML = temp_html;
    reviewList.appendChild(div);
  });
};

// home.html에서 신발 클릭시
export const receiveDataFromMain = async (event) => {
  const currentTarget = event.target.parentNode.children[0].alt;

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
  // 실발 리뷰 개수
  const boardTop = document.querySelector('.boardTop');
  boardTop.innerHTML = '';
  const temp = reviewObjList
    .map((shoes, idx) => {
      // const shoeCnt = await cntReviews(shoes.shoesName);
      const shoeCnt = 23;
      return `<!-- Left -->
      <div class="boardShoeImg boardImgLeft">
        <img
          src="${shoes.image}"
          alt="${shoes.shoesName}"
        />
      </div>
      <form class="boardWriteReviews">
        <p class="boardShoeBrand">${shoes.brandName}</p>
        <h1 class="boardShoeTitle">${shoes.shoesName}</h1>
        <div class="boardRow">
          <div class="boardMesageAndHeart">
            <i class="fa-regular fa-comment"></i>
            <p>${shoeCnt}</p>
            <button onclick="shoesBrandLike(${shoes.shoesLike})"><i class="fas fa-solid fa-heart"></i>${shoes.shoesLike}</button>
            
          </div>
          <div class="youTubeIcon">
            <a href=""><pre> <i class="fa-brands fa-youtube"> 관련 영상</i></pre></a>
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
                onchange="imgFileUpload(event)"
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
      </form>`;
    })
    .join('');
  boardTop.innerHTML = temp;
  getReviewList(currentTarget);
};

export const shoesBrandLike = async (event) => {
  console.log(event++);
  // 아이콘이 클릭이 되어서 여기로 오면
  // 디비에 있는 데이터를 가져와서
  // 디비의 값에서 바로 1이 더해지나?
  // html에 업데이트 해주기
};
