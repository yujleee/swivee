import { dbService, authService, storageService } from './firebase.js';
import { ref, uploadString, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { updateProfile, updatePassword } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { collection, addDoc, doc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export const changeProfiles = async (event) => {
  event.preventDefault();
  document.getElementById('profileBtn').disabled = true;
  const imgRef = ref(storageService, `${authService.currentUser.uid}/${uuidv4()}`);
  const imgDataUrl = localStorage.getItem('imgDataUrl');
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, 'data_url');
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert('프로필 수정 완료!');
      window.location.hash = '#mypage';
    })
    .catch((error) => {
      alert('프로필 수정 실패!');
      console.log('error:', error);
    });
};

export const onChangeNickname = async (event) => {
  event.preventDefault();
  document.getElementById('changeNickname').disabled = true;
  const storageRef = ref(storageService, 'some-child');
  const message = document.getElementById('profileNickname').value;
  uploadString(storageRef, message)
    .then(() => {
      alert('닉네임 수정 완료');
      window.location.hash = '#mypage';
    })
    .catch((error) => {
      alert('닉네임 수정 실패');
      console.log('error:', error);
    });
  await updateProfile(authService.currentUser, {
    displayName: message ? message : null,
  });
};

// 삭제버튼 기능 구현 중
// export const onDeleteImg = async (event) => {
//   console.log('삭제함수')
//   await updateProfile(authService.currentUser, {
//     displayName: null,
//     photoURL: null,
//   }).then(()=>{
//   console.log(authService.currentUser);
//   }).catch(error=>{
//     console.log('error:', error)
//   })
//   ;

// };
// "https://firebasestorage.googleapis.com/v0/b/swivee-ddd5a.appspot.com/o/n3KEkQvNjihCbpNqENAfrf6obZO2%2F625ed9da-ce34-486d-a5a0-27f5424e377b?alt=media&token=91ddb350-0cc6-4e2e-a478-950d8ccd1dd9"

export const onDeleteImg = async (event) => {
  event.preventDefault();
  const defaultImage =
    'https://firebasestorage.googleapis.com/v0/b/swivee-ddd5a.appspot.com/o/n3KEkQvNjihCbpNqENAfrf6obZO2%2F625ed9da-ce34-486d-a5a0-27f5424e377b?alt=media&token=91ddb350-0cc6-4e2e-a478-950d8ccd1dd9';
  if (authService.currentUser.photoURL != defaultImage) {
    await updateProfile(authService.currentUser, {
      photoURL: defaultImage,
    })
      .then(() => {
        const deleteuserImg = document.getElementById('profileView');
        deleteuserImg.src = authService.currentUser.photoURL;
        alert('이미지 삭제');
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
};

export const changeUserPassword = async (event) => {
  const userInputPassword = document.getElementById('userPasswordInput');
  const user = authService.currentUser;
  const newPassword = userInputPassword.value;

  await updatePassword(user, newPassword)
    .then(() => {
      alert('비밀번호 변경 완료!');
    })
    .catch((error) => {
      console.log('error:', error);
      alert('비밀번호 변경 실패!');
    });
};

export const onFileChange = (event) => {
  const theFile = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(theFile);
  reader.onloadend = (finishedEvent) => {
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('imgDataUrl', imgDataUrl);
    document.getElementById('profileView').src = imgDataUrl;
  };
};

export const getUserReviewList = async () => {
  let cmtObjList = [];
  const qq = query(collection(dbService, 'reviews'), where('creatorId', '==', authService.currentUser.uid));
  const querySnapShot = await getDocs(qq);
  querySnapShot.forEach((doc) => {
    const reviewsObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(reviewsObj);
  });

  const userReviewList = document.querySelector('.boardReviews');
  userReviewList.innerHTML = '';
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
    userReviewList.appendChild(div);
  });
};
