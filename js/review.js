import { dbService, authService, storageService } from "./firebase.js";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  where,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const receiveDataFromBoard = async (event, shoeData) => {
  if (!authService.currentUser) {
    alert("로그인이 필요합니다.");
    goToLogin();
    return;
  }

  const poster = JSON.parse(decodeURI(shoeData));
  localStorage.setItem("id", poster.id);
  localStorage.setItem("shoeName", poster.shoeName);
  localStorage.setItem("creatorId", poster.creatorId);
  const creatorId = localStorage.getItem("creatorId");
  const currentUid = authService.currentUser.uid;
  const isOwner = currentUid === creatorId;
  let cmtObjList = [];
  const q = query(
    collection(dbService, "comments"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });

  const reviewCount = cmtObjList.length;
  const temp_html = `<div class="reviewHead">
        <div class="reviewHeadProfile">
          <div class="reviewProfileImg">
            <a href="#"><img src="${poster.profileImg}" /></a>
          </div>
          <div class="reviewHeadProfileName">
            <div class="reviewHeadProfileNameN">${poster.nickname}</div>
            <div class="reviewHeadProfileNameD">${new Date(poster.createdAt)
              .toLocaleString()
              .slice(0, 25)}</div>
          </div>
        </div>
        ${
          isOwner
            ? `<div class="editButtons">
            <i id="fix" class="fa-regular fa-pen-to-square reviewEdit" onclick="reviseReview(event)"></i>
          <i class="fa-regular fa-trash-can reviewDelete" onclick="deleteReview(event)"></i>
        </div>`
            : ""
        }
      </div>
      <div class="reviewImgBox" role="img">
        <img class="reviewImg" src="${poster.reviewImg}" />
      </div>
      <div class="reviewBody">
      <textarea
        id="reviseComment" class="noDisplay reviseInputArea">${
          poster.text
        }</textarea> 
        <button onclick="updateReviews(event)" class="saveReviseComment noDisplay">저장</button>
        </div>
        
        <p class="reviewComment">${poster.text}
       
      <section>
        <h1 class="blind">댓글</h1>
        <div id="reviews" class="commentHead">
      
        
          <input type="text" id="commentInput" placeholder="이 신발은 어떠셨나요?" name="comment"/>
          <button class="commentButton" onclick="saveComment(event)">입력</button>
        </div>
        <div class="commentLineBox">
          <div class="commentLine"></div>
          <div class="commentLineTitle">댓글 ${reviewCount}개</div>
        </div>
      </section>
      <div id="commentList1"></div>`;

  const reviewDiv = document.querySelector(".review");
  reviewDiv.innerHTML = temp_html;
  getCommentList();
};

export const saveComment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("commentInput");
  const commentVal = comment.value;
  const reviewId = localStorage.getItem("id");
  const { uid, photoURL, displayName } = authService.currentUser;
  if (!commentVal) {
    alert("댓글을 입력해 주세요");
    comment.focus();
    return;
  }
  try {
    await addDoc(collection(dbService, "comments"), {
      reviewId: reviewId,
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
    });
    comment.value = "";
    getCommentList();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

export const onEditing = (event) => {
  event.preventDefault();
  const udBtns = document.querySelectorAll(".editBtn, .deleteBtn");
  udBtns.forEach((udBtn) => (udBtn.disabled = "true"));
  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0];
  const commentInputP = cardBody.children[1];
  commentText.classList.add("noDisplay");
  commentInputP.classList.remove("noDisplay");
  commentInputP.focus();
  udBtns.forEach((udBtns) => udBtns.classList.add("noDisplay"));
};

export const updateComment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;
  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  commentText.classList.remove("noDisplay");
  const commentInputP = parentNode.children[1];
  commentInputP.classList.remove("d-flex");
  commentInputP.classList.add("noDisplay");

  const commentRef = doc(dbService, "comments", id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getCommentList();
  } catch (error) {
    alert(error);
  }
};

export const deleteComment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("해당 댓글을 정말 삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "comments", id));
      getCommentList();
    } catch (error) {
      alert(error);
    }
  }
};

export const getCommentList = async () => {
  let cmtObjList = [];
  const reviewId = localStorage.getItem("id");
  const q = query(
    collection(dbService, "comments"),
    where("reviewId", "==", reviewId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });

  const currentUid = authService.currentUser.uid;
  const commentTitle = document.querySelector(".commentLineTitle");
  commentTitle.innerHTML = `댓글 ${cmtObjList.length}개`;
  const commentList = document.getElementById("commentList1");
  commentList.innerHTML = "";
  let temp_html = "";

  if (cmtObjList.length === 0) {
    temp_html = ` <div class="empty">
    <i class="fa-regular fa-face-sad-tear"></i>
    <p class="emptyMessage">등록된 댓글이 없어요!</p>
</div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commentList.appendChild(div);
  }

  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    temp_html = `
    <div class="reviewListComment">
    <div class="reviewListBox">
      <img class="cardEmoticon" src="${
        cmtObj.profileImg
      }" ?? '/assets/blank-profile-picture.png'}" alt="" />
      <div class="reviewListBoxNameDate">
        <div class="reviewListBoxName">${cmtObj.nickname}</div>
        <div class="reviewListBoxDate">${new Date(cmtObj.createdAt)
          .toLocaleString()
          .slice(0, 25)}</div>
      </div>
    </div>
    <div class="commentAndDelEd">
    <p class="card-text">${cmtObj.text}</p>
    <p id="${
      cmtObj.id
    }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><img src="../assets/circle-check-regular.svg" class="updateBtn" onclick="updateComment(event)"/></p>
    <div class="${isOwner ? "updateBtns" : "noDisplay"}">
    <img src="../assets/pen-to-square-regular.svg" class="editBtn" onclick="onEditing(event)"/>
    <img src="../assets/trash-can-regular.svg" name="${
      cmtObj.id
    }" onclick="deleteComment(event)" class="deleteBtn"/>
  </div>
  </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commentList.appendChild(div);
  });
};

export const deleteReview = async (event) => {
  event.preventDefault();
  const id = localStorage.getItem("id");
  const shoesName = localStorage.getItem("shoeName");
  const confirm = window.confirm("해당 리뷰를 삭제하시겠어요?");

  if (confirm) {
    try {
      await deleteDoc(doc(dbService, "reviews", id));
      localStorage.removeItem("id");
      localStorage.removeItem("creatorId");
      goToBoard(shoesName);
    } catch (error) {
      console.log(error);
    }
  }
};

export const reviseReview = async (event) => {
  event.preventDefault();

  const udBtns = document.querySelectorAll(".editButtons");
  udBtns.forEach((udBtn) => udBtn.classList.add("noDisplay"));
  const reviewBody = event.target; //수정 아이콘
  console.log(reviewBody);
  const commentText = document.querySelector("#reviseComment");
  //commentText : board에서 들고 온 textarea
  console.log(commentText);
  const userOriginText = document.querySelector(".reviewComment");
  const reviseBtn = document.querySelector(".saveReviseComment"); //수정완료버튼
  commentText.classList.remove("noDisplay");
  userOriginText.classList.add("noDisplay");
  reviseBtn.classList.remove("noDisplay");
  console.log(userOriginText);
};

export const updateReviews = async (event) => {
  const parentNode = event.target.parentNode;
  console.log(parentNode);
  const commentText = parentNode.children[0];
  console.log(commentText);
  const commentInputP = commentText.value;




  const creatorId = localStorage.getItem("id");
  const commentRef = doc(dbService, "reviews", creatorId);
  const savebtn = document.querySelector(".saveReviseComment");
  savebtn.classList.add("noDisplay");

  try {
    await updateDoc(commentRef, { text: commentInputP });
    const changeComment = document.querySelector("#reviseComment");
    changeComment.value = commentInputP;
    const changeDiv = document.querySelector(".reviewBody");
    changeDiv.innerHTML = '';
    const p = `<p class="reviewComment">${commentInputP}`;
    changeDiv.innerHTML = p;
  } catch (error) {
    alert(error);
  }
};
