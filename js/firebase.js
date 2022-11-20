// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

// 아래 데이터는 본인의 Firebase 프로젝트 설정에서 확인할 수 있습니다.
const firebaseConfig = {
  apiKey: 'AIzaSyAiDUkdMMRP5z0IwIhLjqUpmOcmZyGc7JA',
  authDomain: 'swivee-ddd5a.firebaseapp.com',
  projectId: 'swivee-ddd5a',
  storageBucket: 'swivee-ddd5a.appspot.com',
  messagingSenderId: '474272792989',
  appId: '1:474272792989:web:d9928bc84d4c2eed5e6f74',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
