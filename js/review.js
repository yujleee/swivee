import { dbService, authService, storageService } from './firebase.js';
import { doc, addDoc, updateDoc, deleteDoc, collection, orderBy, query, getDocs, where } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export const receiveDataFromBoard = async (event, shoeData) => {
  const poster = JSON.parse(decodeURI(shoeData));
  // 리뷰 개수

  let cmtObjList = [];
  const q = query(collection(dbService, 'comments'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
    console.log('cmtObjList', cmtObjList);
  });
  const reviewCount = cmtObjList.length;
  const temp_html = `<div class="reviewHead">
        <div class="reviewHeadProfile">
          <div class="reviewProfileImg">
            <a href="#"><img src="${poster.profileImg}" /></a>
          </div>
          <div class="reviewHeadProfileName">
            <div class="reviewHeadProfileNameN">${poster.nickname}</div>
            <div class="reviewHeadProfileNameD">${new Date(poster.createdAt).toLocaleString().slice(0, 25)}</div>
          </div>
        </div>
        <div class="editButtons">
          <i class="fa-regular fa-pen-to-square reviewEdit"></i>
          <i class="fa-regular fa-trash-can reviewDelete" onclick="deleteReview(event)"></i>
        </div>
      </div>
      <div class="reviewImgBox" role="img">
        <img src="${poster.reviewImg}" />
      </div>
      <p class="reviewComment">${poster.text}
      </p>
      <section>
        <h1 class="blind">댓글</h1>
        <div id="reviews" class="commentHead">
          <input type="text" id="commentInput" class="commentBox" placeholder="이 신발은 어떠셨나요?" name="comment" />
          <button class="commentButton" onclick="saveComment(event)">입력</button>
        </div>
        <div class="commentLineBox">
          <div class="commentLine"></div>
          <div class="commentLineTitle">댓글 ${reviewCount}개</div>
        </div>
      </section>
      <div id="commentList1"></div>`;
  const reviewDiv = document.querySelector('.review');
  // div.classList.add("review");
  reviewDiv.innerHTML = temp_html;
  // await getCommentList();
  // const box = document.querySelector(".");
  // reviewDiv.appendChild(div);
  getCommentList();
};

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
  console.log(udBtns);
  const cardBody = event.target.parentNode.parentNode; //cardbody = 수정 버튼
  console.log(cardBody);
  const commentText = cardBody.children[0];
  const commentInputP = cardBody.children[1];
  commentText.classList.add('noDisplay');
  // commentInputP.classList.add('d-flex');
  commentInputP.classList.remove('noDisplay');
  console.log(commentInputP);
  commentInputP.focus();
  udBtns.forEach((udBtns) => udBtns.classList.add('noDisplay'));
};

export const update_comment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  commentText.classList.remove('noDisplay'); //수정input display:none
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

  const currentUid = authService.currentUser.uid;
  const commentList = document.getElementById('commentList1');
  debugger;
  commentList.innerHTML = '';
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `
    <div class="reviewListComment">
    <div class="reviewListBox">
      <img class="cardEmoticon" src="${cmtObj.profileImg}" ?? '/assets/blank-profile-picture.png'}" alt="" />
      <div class="reviewListBoxNameDate">
        <div class="reviewListBoxName">${cmtObj.nickname}</div>
        <div class="reviewListBoxDate">${new Date(cmtObj.createdAt).toLocaleString().slice(0, 25)}</div>
      </div>
    </div>
    <div class="commentAndDelEd">
    <p class="card-text">${cmtObj.text}</p>
    <p id="${cmtObj.id}" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
    <div class="${isOwner ? 'updateBtns' : 'noDisplay'}">
    <button onclick="onEditing(event)" class="editBtn">수정</button>
    <button
      name="${cmtObj.id}"
      onclick="delete_comment(event)"
      class="deleteBtn">
      삭제
    </button>
  </div>
  </div>`;

    /*
    const div = document.createElement("div");
  div.classList.add("review");
  div.innerHTML = temp_html;
  // await getCommentList();
  const box = document.querySelector(".box");
  box.appendChild(div);
  */
    // const div = document.createElement("div");
    // div.innerHTML = temp_html;
    debugger;
    const div = document.createElement('div');
    div.classList.add('mycards');
    div.innerHTML = temp_html;
    commentList.appendChild(div);
    // commentList1.appendChild(div);
  });
  // commentList = document.getElementById("commentList1");
  // commentList.innerHTML = "";
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
