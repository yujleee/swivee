import { dbService, authService, storageService } from "./firebase.js";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const saveComment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("commentInput");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "comments"), {
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

// function save_comment() {
//   const newWord = document.querySelector("#comment-input").value;
//   let date = new Date();
//   let year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   let day = date.getDate();

//   let time = new Date();
//   let minutes = String(time.getMinutes()).padStart(2, "0");
//   let hours = String(time.getHours()).padStart(2, "0");
//   let seconds = String(time.getSeconds()).padStart(2, "0");

//   let here = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   // let taewook = `${year}-${month}-${day}`

//   let temp_html = `<div class="reviewListComment">
//     <div class="reviewListBox">
//       <img class="cardEmoticon" src="./assets/blank-profile-picture.png" alt="" />
//       <div class="reviewListBoxNameDate">
//         <div class="reviewListBoxName">이름</div>
//         <div class="reviewListBoxDate">${here}</div>
//       </div>
//     </div>
//     <p class="card-text">${newWord}</p>
//   </div>`;

//   $(".reviewList").append(temp_html);
// }

export const getCommentList = async () => {
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
  const commentList = document.getElementById("commentList1");
  const currentUid = authService.currentUser.uid;
  commentList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="reviewListComment">
    <div class="reviewListBox">
      <img class="cardEmoticon" src="${
        cmtObj.profileImg ?? "/assets/blank-profile-picture.png"
      }" alt="" />
      <div class="reviewListBoxNameDate">
        <div class="reviewListBoxName">${cmtObj.nickname}</div>
        <div class="reviewListBoxDate">${new Date(cmtObj.createdAt)
          .toLocaleString()
          .slice(0, 25)}</div>
      </div>
    </div>
    <p class="card-text">${cmtObj.text}</p>
  </div>`;
    console.log("commentList", commentList);
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commentList.appendChild(div);
  });
};
