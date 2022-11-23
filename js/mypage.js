import { dbService,authService, storageService } from './firebase.js';
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { collection, addDoc} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'; 


  export const changeProfiles = async(event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true; 
  const imgRef= ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
    )
  console.log(authService.currentUser)
  
  
  // const newNickname = document.getElementById("profileNickname").value;
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if(imgDataUrl){
    const response = await uploadString (imgRef,imgDataUrl,"data_url"); //imgRef:이미지저장 위치
    downloadUrl = await getDownloadURL (response.ref);
  } 
  const storageRef = ref(storageService,'some-child')
  const userName1 = document.getElementById("userNickname").textContent; ;
  const message = document.getElementById("profileNickname").value; ;
  

  uploadString(storageRef, message).then(() => {
    alert('프로필 수정 완료');
    window.location.hash = "#mypage";
    })
    .catch((error)=> {
      alert("프로필 수정 실패");
      console.log("error:" , error);
    });
  await updateProfile(authService.currentUser,{
    displayName : message ? message : null,
    //displayName에다가 새로운 닉네임을 넣고
    photoURL : downloadUrl ? downloadUrl :null,
  })
  

  try {
    const docRef = await addDoc(collection(dbService, "users"), {
      email: authService.currentUser.email,
      nickname: message
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}; 

export const onChangeNickname = async(event) => {
  event.preventDefault();
  document.getElementById("changeNickname").disabled = true

  const storageRef = ref(storageService,'some-child')
  const userName1 = document.getElementById("userNickname").textContent; ;
  const message = document.getElementById("profileNickname").value; 

  uploadString(storageRef, message).then(() => {
    alert('프로필 수정 완료');
    window.location.hash = "#mypage";
    })
    .catch((error)=> {
      alert("프로필 수정 실패");
      console.log("error:" , error);
    });
  await updateProfile(authService.currentUser,{
    displayName : message ? message : null
  })

  try {
    const docRef = await addDoc(collection(dbService, "users"), {
      email: authService.currentUser.email,
      nickname: message
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}







export const onFileChange = (event) => {
  console.log('event.target.files:', event.target.files);
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('imgDataUrl', imgDataUrl);
    document.getElementById('profileView').src = imgDataUrl;
  };
};

