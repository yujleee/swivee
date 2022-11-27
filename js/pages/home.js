import { collection, query, where, getDocs, orderBy, onSnapshot, limit, getCountFromServer } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { dbService } from '../firebase.js';

// 브랜드 더보기
export const toggleMoreBrand = (event) => {
  event.preventDefault();
  const btnMoreBrand = document.querySelector('.btnMoreBrand');
  const allBrandItems = document.querySelectorAll('.brandItem');

  if (btnMoreBrand.classList.contains('fa-chevron-down')) {
    allBrandItems.forEach((item) => {
      if (item.classList.contains('hide')) {
        item.classList.toggle('hide');
      }
    });
  } else {
    allBrandItems.forEach((item) => {
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

// 브랜드 리스트 가져오기
const getBrands = async () => {
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

  return brandObjList;
};

// 브랜드 리스트 렌더링
export const renderBrandList = async () => {
  const brandObjList = await getBrands();

  const allBrandList = document.querySelector('.allBrandList');
  allBrandList.innerHTML = '';

  const temp = brandObjList
    .map(
      (brand, idx) => `
            <li class="brandItem ${idx < 5 ? 'show' : 'hide'}" onclick="changeShoesList(event)" data-brand="${brand.brand}">
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

// 실시간 리뷰 렌더링
const renderRealtimeReviews = (reviews) => {
  const realTimeReviewList = document.querySelector('.realTimeReviewList');
  realTimeReviewList.innerHTML = '';

  let temp = '';
  if (reviews.length === 0) {
    temp = '<li class="realTimeReviewItem empty">최근 작성된 리뷰가 없어요.</li>';
  } else {
    temp = reviews
      .map(
        (review, idx) => `
                  <li class="realTimeReviewItem">
                    <span class="rank">${idx + 1}</span>
                    <div class="reviewBox">
                      <div class="boardReviewersRow boardProfileImageAndNickName">
                        <img class="boardReviewersProfile" src="${review.profileImg ?? '/assets/blank-profile-picture.png'}" alt="프로필" />
                        <p class="boardReviewersNickname ellipsis">${review.nickname}</p>
                      </div>
                      <p class="comment">${review.text}</p>
                    </div>
                </li>`
      )
      .join('');
  }

  realTimeReviewList.innerHTML = temp;
};

// 인기 브랜드 렌더링
export const renderTopbrands = async () => {
  const brandObjList = await getBrands();

  let brandsTotal = [];

  for (let i = 0; i < brandObjList.length; i++) {
    const q = query(collection(dbService, 'reviews'), where('brandName', '==', `${brandObjList[i].brandName}`));
    const snapshot = await getCountFromServer(q);

    if (snapshot.data().count > 0) {
      const totalReviewObj = {
        count: snapshot.data().count,
        logo: brandObjList[i].logo,
        brandName: brandObjList[i].brandName,
      };
      brandsTotal.push(totalReviewObj);
    }
  }

  brandsTotal.sort((a, b) => {
    if (a.count > b.count) return 1;
    if (a.count < b.count) return -1;
    return 0;
  });

  const topBrandList = document.querySelector('.topBrandList');
  topBrandList.innerHTML = '';

  let temp = '';

  if (brandsTotal.length === 0) {
    temp = '<li class="topBrandItem empty"> 인기 브랜드를 볼 수 없어요.</li>';
  } else {
    temp = brandsTotal
      .map(
        (brand, idx) => `<li class="topBrandItem">
                  <span class="rank">${idx + 1}</span>
                  <div class="imgBox">
                      <img src="${brand.logo}" alt="${brand.brandName}" />
                  </div>
                  <p class="brandName">${brand.brandName}</p>
              </li>`
      )
      .join('');
  }

  topBrandList.innerHTML = temp;
};
