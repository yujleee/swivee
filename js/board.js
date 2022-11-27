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
import { ref, uploadString, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { searchOnYoutube } from './utill.js';

export const receiveDataFromMain = async (event, shoesName) => {
  const currentTarget = !event ? shoesName : event.target.parentNode.children[0].alt;
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
  const boardTop = document.querySelector('.boardTop');
  boardTop.innerHTML = '';
  const temp = reviewObjList
    .map((shoes, idx) => {
      return `
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
            <p id="reviewCount">${reviewCount}</p>
            <i class="fas fa-solid fa-heart"> <button id="shoeLikeBtn" onclick="shoesBrandLike('${encodeURI(
              JSON.stringify(shoes)
            )}')"> ${shoes.shoesLike}</button></i>
          </div>
          <div class="youTubeIcon">
            <a href="${searchOnYoutube(
              shoes.shoesName
            )}" target="_blank"><pre> <i class="fa-brands fa-youtube"> 관련 영상</i></pre></a>
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
              placeholder="리뷰를 남겨주세요..."
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

export const imgFileUpload = (event) => {
  const btnName = event.target.parentNode;
  const theFile = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(theFile);
  reader.onloadend = (finishedEvent) => {
    const reviewImgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('reviewImgDataUrl', reviewImgDataUrl);
    btnName.innerText = theFile.name;
  };
};

export const saveReview = async (event) => {
  event.preventDefault();

  if (!authService.currentUser) {
    alert('로그인이 필요합니다.');
    goToLogin();
  }

  const shoeName = document.getElementsByClassName('boardShoeTitle')[0].innerHTML;
  const shoeBrand = document.getElementsByClassName('boardShoeBrand')[0].innerHTML;
  let imgUploadButton = document.getElementsByClassName('boardNewImage')[0];
  const comment = document.getElementById('reviewCheck');
  const imgRef = ref(storageService, `${shoeName}/${uuidv4()}`);
  const reviewImgDataUrl = localStorage.getItem('reviewImgDataUrl');
  let downloadUrl;
  if (reviewImgDataUrl) {
    const response = await uploadString(imgRef, reviewImgDataUrl, 'data_url');
    downloadUrl = await getDownloadURL(response.ref);
  }

  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, 'reviews'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      brandName: shoeBrand,
      nickname: displayName,
      shoeName: shoeName,
      reviewImg: downloadUrl,
    })
      .then(() => {
        alert('리뷰 업로드 완료');
        const countReview = document.getElementById('reviewCount');
        countReview.innerText = Number(countReview.innerText) + 1;
        window.location.hash = '#board';
      })
      .catch((error) => {
        alert('리뷰를 남기려면 로그인을 해주세요.');
        console.log('error:', error);
      });
    comment.value = '';
    imgUploadButton.innerHTML = '+ 사진 올리기';
    getReviewList(shoeName);
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

export const getReviewList = async (shoeName) => {
  let cmtObjList = [];
  const q = query(collection(dbService, 'reviews'), where('shoeName', '==', shoeName), orderBy('createdAt', 'desc'));
  const querySnapShot = await getDocs(q);
  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(reviewsObj);
  });
  const reviewList = document.querySelector('.boardReviews');
  reviewList.innerHTML = '';
  const countReview = cmtObjList.length;
  let temp_html = '';
  if (countReview === 0) {
    temp_html = `
            <i class="fa-regular fa-face-sad-tear"></i>
            <p class="emptyMessage">등록된 리뷰가 없어요!</p>
        `;
    const div = document.createElement('div');
    div.classList.add('empty');
    div.innerHTML = temp_html;
    reviewList.appendChild(div);
  } else {
    cmtObjList.forEach((cmtObj) => {
      temp_html = `
           <a id="boardData"
           onclick="window.location.hash = '#review'; handleLocation();receiveDataFromBoard(event, '${encodeURI(
             JSON.stringify(cmtObj)
           )}')">
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
             <i class="fa-regular fa-comment"></i>
             <p>${countReview}</p>
           </div>
           </a>
         `;
      const div = document.createElement('div');
      div.classList.add('boardReview');
      div.innerHTML = temp_html;
      reviewList.appendChild(div);
    });
  }
};

export const shoesBrandLike = async (data) => {
  data.preventDefault();
  const currentData = JSON.parse(decodeURI(data));
  const updateLikeNumber = currentData.shoesLike + 1;
  const likeRef = doc(dbService, 'shoesList', currentData.id);
  try {
    await updateDoc(likeRef, { shoesLike: updateLikeNumber });
  } catch (error) {
    alert(error);
  }
  const currentLike = document.getElementById('shoeLikeBtn');
  currentLike.innerText = updateLikeNumber;
};
