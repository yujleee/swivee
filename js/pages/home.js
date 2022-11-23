import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  limit,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { dbService } from '../firebase.js';

// 브랜드 더보기
export const toggleMoreBrand = (event) => {
  event.preventDefault();
  const btnMoreBrand = document.querySelector('.btnMoreBrand');
  const AllBrandItems = document.querySelectorAll('.brandItem');

  if (btnMoreBrand.classList.contains('fa-chevron-down')) {
    AllBrandItems.forEach((item) => {
      if (item.classList.contains('hide')) {
        item.classList.toggle('hide');
      }
    });
  } else {
    AllBrandItems.forEach((item) => {
      if (!item.classList.contains('show')) {
        item.classList.toggle('hide');
      }
    });
  }
  btnMoreBrand.classList.toggle('fa-chevron-down');
  btnMoreBrand.classList.toggle('fa-chevron-up');
};

// 브랜드별 신발 리스트
export const changeShoesList = async (event) => {
  let currentTarget = !event ? 1 : Number(event.target.parentNode.parentNode.dataset.brand);
  let shoesObjList = [];

  const q = query(collection(dbService, 'shoesList'), where('brand', '==', currentTarget));
  const querySnapShot = await getDocs(q);

  const btnMoreShoes = document.querySelector('.btnMoreShoes');

  querySnapShot.forEach((doc) => {
    const shoesObj = {
      id: doc.id,
      ...doc.data(),
    };
    shoesObjList.push(shoesObj);
  });

  if (shoesObjList.length < 9) {
    btnMoreShoes.classList.add('hide');
  } else {
    if (btnMoreShoes.classList.contains('hide')) btnMoreShoes.classList.remove('hide');
  }

  const shoesList = document.querySelector('.shoesList');
  shoesList.innerHTML = '';

  let temp = '';
  if (shoesObjList.length === 0) {
    temp = `  <div class="empty">
                <i class="fa-regular fa-face-sad-tear"></i>
                <p class="emptyMessage">등록된 신발이 없어요!</p>
            </div>`;
  } else {
    temp = shoesObjList
      .map(
        (shoes, idx) =>
          `<li onclick="receiveDataFromMain(event)" class="shoesItem ${idx >= 9 ? 'hide' : ''}">
            <a href="#board" class="shoesLink">
            <div class="imgBox">
                <img
                src="${shoes.image}"
                alt="${shoes.shoesName}"
                />
            </div>
            <div class="infoBox">
                <p class="brandName">${shoes.brandName}</p>
                <p class="shoesName">${shoes.shoesName}</p>
            </div>
            </a>
        </li>`
      )
      .join('');
  }

  shoesList.innerHTML = temp;
};

// 신발 더보기
export const showMoreShoes = () => {
  const allShoesList = document.querySelectorAll('.shoesItem');
  const btnMoreShoes = document.querySelector('.btnMoreShoes');

  const listLength = allShoesList.length;

  allShoesList.forEach((shoes, idx) => {
    if (shoes.classList.contains('hide')) {
      shoes.classList.remove('hide');
    }

    if (idx === listLength - 1) {
      btnMoreShoes.classList.add('hide');
    }
  });
};

// 브랜드 가져오기
export const getBrandList = async () => {
  const q = query(collection(dbService, 'brandList'), orderBy('brand'));
  const querySnapShot = await getDocs(q);

  let brandObjList = [];

  querySnapShot.forEach((doc) => {
    const brandObj = {
      id: doc.id,
      ...doc.data(),
    };
    brandObjList.push(brandObj);
  });

  const allBrandList = document.querySelector('.allBrandList');
  allBrandList.innerHTML = '';

  const temp = brandObjList
    .map(
      (brand, idx) => `
            <li class="brandItem ${idx < 5 ? 'show' : 'hide'}" onclick="changeShoesList(event)" data-brand="${
        brand.brand
      }">
                <div class="imgBox">
                    <img src="${brand.logo}" alt="${brand.brandName}" />
                </div>
            </li>
      `
    )
    .join('');

  allBrandList.innerHTML = temp;
};

// 실시간 리뷰
export const getRealtimeReviews = async () => {
  const q = query(collection(dbService, 'reviews'), orderBy('createdAt', 'desc'), limit(5));

  let reviewsObjList = [];

  await onSnapshot(q, (snapshot) => {
    console.log(snapshot);
    snapshot.forEach((doc) => {
      const reviewObj = {
        id: doc.id,
        ...doc.data(),
      };
      reviewsObjList.push(reviewObj);
    });

    renderRealtimeReviews(reviewsObjList);
  });
};

const renderRealtimeReviews = (reviews) => {
  console.log(reviews);
  const realTimeReviewList = document.querySelector('.realTimeReviewList');
  realTimeReviewList.innerHTML = '';

  const temp = reviews
    .map(
      (review, idx) => `
              <li class="realTimeReviewItem">
                <span class="rank">${idx + 1}</span>
                <div class="reviewBox">
                  <div class="boardReviewersRow boardProfileImageAndNickName">
                    <img class="boardReviewersProfile" src="${
                      review.profileImg ?? '/assets/blank-profile-picture.png'
                    }" alt="프로필" />
                    <p class="boardReviewersNickname ellipsis">${review.nickname}</p>
                  </div>
                  <p class="comment">${review.text}</p>
                </div>
            </li>`
    )
    .join('');

  realTimeReviewList.innerHTML = temp;
};
