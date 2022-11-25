import { dbService, authService, storageService } from './firebase.js';
import { doc, addDoc, updateDoc, deleteDoc, collection, orderBy, query, getDocs, where } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { ref, uploadString, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { searchOnYoutube } from './utill.js';

// home.html에서 신발 클릭시
export const receiveDataFromMain = async (event) => {
  const currentTarget = event.target.parentNode.children[0].alt;
  let reviewObjList = [];

  // board 메인
  const q = query(collection(dbService, 'shoesList'), where('shoesName', '==', currentTarget));
  const querySnapShot = await getDocs(q);
  // 리뷰 개수
  const q2 = query(collection(dbService, 'reviews'), where('shoeName', '==', currentTarget));
  const querySnapShot2 = await getDocs(q2);
  const reviewCount = querySnapShot2.docs.map((doc) => doc.data()).length;
  // 좋아요 개수
  const q3 = query(collection(dbService, 'shoesList'), where('shoesName', '==', currentTarget));
  const querySnapShot3 = await getDocs(q3);
  const likeCount = querySnapShot3.docs.map((doc) => doc.data().shoesLike);
  const brandLikeNumber = Number(likeCount.toString());

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
      return `<!-- Left -->
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
            <p id="reviewCount">${reviewCount}</p>
            <button onclick="shoesBrandLike(${shoes.shoesLike})"><i class="fas fa-solid fa-heart"></i>${brandLikeNumber}</button>
            
          </div>
          <div class="youTubeIcon">
            <a href="${searchOnYoutube(shoes.shoesName)}" target="_blank"><pre> <i class="fa-brands fa-youtube"> 관련 영상</i></pre></a>
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
  await getReviewList(currentTarget);
};

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
  const shoeName = document.getElementsByClassName('boardShoeTitle')[0].innerHTML;
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

  const { uid, photoURL, displayName } = authService.currentUser;
  console.log('photoURL', photoURL);
  try {
    // reviews 파일을 만든후, 아래 내용들이 저장된다.
    await addDoc(collection(dbService, 'reviews'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      shoeName: shoeName,
      reviewImg: downloadUrl,
    })
      .then(() => {
        alert('리뷰 업로드 완료');
        // 리뷰 개수 1 더해주기
        const countReview = document.getElementById('reviewCount');
        countReview.innerText = Number(countReview.innerText) + 1;
        window.location.hash = '#board';
      })
      .catch((error) => {
        alert('리뷰를 남기려면 로그인을 해주세요.');
        console.log('error:', error);
      });
    comment.value = '';
    getReviewList(shoeName);
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

export const getReviewList = async (shoeName) => {
  let cmtObjList = [];
  const qq = query(collection(dbService, 'reviews'), where('shoeName', '==', shoeName), orderBy('createdAt', 'desc'));
  const querySnapShot = await getDocs(qq);
  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(reviewsObj);
    // console.log('cmtObjList', cmtObjList);
  });
  const reviewList = document.querySelector('.boardReviews');
  reviewList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    const temp_html = `
        <a id="boardData"
        onclick="window.location.hash = '#review'; handleLocation();receiveDataFromBoard(event, '${encodeURI(JSON.stringify(cmtObj))}')">
        <div class="boardReviewersImg">
          <img class="reviewPostingImg" src="${cmtObj.reviewImg}" alt="" />
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
        </a>
      `;

    const div = document.createElement('div');
    div.classList.add('boardReview');
    div.innerHTML = temp_html;
    reviewList.appendChild(div);
  });
};

export const shoesBrandLike = async (event) => {
  console.log(event++);
  // 아이콘이 클릭이 되어서 여기로 오면
  // 디비에 있는 데이터를 가져와서
  // 디비의 값에서 바로 1이 더해지나?
  // html에 업데이트 해주기
};
