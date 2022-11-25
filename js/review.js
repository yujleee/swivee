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

export const saveComment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById('commentInput');
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, 'comments'), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
    });
    comment.value = '';
    getCommentList();
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
};

//수정, 삭제 부분

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll('.editBtn, .deleteBtn');
  udBtns.forEach((udBtn) => (udBtn.disabled = 'true'));

  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0].children[0];
  const commentInputP = cardBody.children[0].children[1];

  commentText.classList.add('noDisplay');
  commentInputP.classList.add('d-flex');
  commentInputP.classList.remove('noDisplay');
  commentInputP.children[0].focus();
};

export const update_comment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  commentText.classList.remove('noDisplay');
  const commentInputP = parentNode.children[1];
  commentInputP.classList.remove('d-flex');
  commentInputP.classList.add('noDisplay');

  const commentRef = doc(dbService, 'comments', id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getCommentList();
  } catch (error) {
    alert(error);
  }
};

export const delete_comment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm('해당 응원글을 정말 삭제하시겠습니까?');
  if (ok) {
    try {
      await deleteDoc(doc(dbService, 'comments', id));
      getCommentList();
    } catch (error) {
      alert(error);
    }
  }
};

export const getCommentList = async () => {
  let cmtObjList = [];
  const q = query(collection(dbService, 'comments'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });
  const commentList = document.getElementById('commentList1');
  const currentUid = authService.currentUser.uid;
  commentList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="reviewListComment">
    <div class="reviewListBox">
      <img class="cardEmoticon" src="${cmtObj.profileImg ?? '/assets/blank-profile-picture.png'}" alt="" />
      <div class="reviewListBoxNameDate">
        <div class="reviewListBoxName">${cmtObj.nickname}</div>
        <div class="reviewListBoxDate">${new Date(cmtObj.createdAt).toLocaleString().slice(0, 25)}</div>
      </div>
    </div>
    <div class="commentAndDelEd">
    <p class="card-text">${cmtObj.text}</p>
    <p id="${cmtObj.id}" class="noDisplay">
    <input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
    <div class="${isOwner ? 'updateBtns' : 'noDisplay'}">
    <button onclick="onEditing(event)" class="editBtn">수정</button>
    <button
      name="${cmtObj.id}"
      onclick="delete_comment(event)"
      class="deleteBtn"
    >
      삭제
    </button>
  </div>
  </div>`;
    console.log('commentList', commentList);
    const div = document.createElement('div');
    div.classList.add('mycards');
    div.innerHTML = temp_html;
    commentList.appendChild(div);
  });
};

// 리뷰 삭제
export const deleteReview = async (event) => {
  event.preventDefault();
  console.log('on');
  const id = event.target.id;
  const confirm = window.confirm('해당 리뷰를 삭제하시겠어요?');
  //   window.history.back(); // 뒤로가기

  if (confirm) {
    try {
      await deleteDoc(doc(dbService, 'reviews', id));
    } catch (error) {
      console.log(error);
    }
  }
};
