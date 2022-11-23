import { authService, storageService } from './firebase.js';
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// import{updateProfile}from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";


  export const changeProfiles = async(event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true; 
  const imgRef= ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
    )
  const newNickname = document.getElementById("profilenickname").value;
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if(imgDataUrl){
    const response = await uploadString (imgRef,imgDataUrl,"data_url");
    downloadUrl = await getDownloadURL (response.ref);
  } 


  //<프로필을 수정코드 >
  await updateProfile(authService.currentUser,{
    displayName : newNickname ? newNickname : null,
    //displayName에다가 새로운 닉네임을 넣고
    photoURL : downloadUrl ? downloadUrl :null,
  }) 
   .then(()=>{
    alert('프로필 수정 완료');
    window.location.hash = "#mypage";
   })
   .catch((error)=> {
    alert("프로필 수정 실패");
    console.log("error:" , error);
   });
};


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

